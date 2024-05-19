import { patchState, signalStore, withState } from '@ngrx/signals';
import { setAllEntities, updateEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { exhaustMap, pipe } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { GameMockService } from './game-mock.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { emptyCurrentMove, emptyCurrentMoveWithColor, setMoveType, setSelectedNodeId } from './current-move-functions';
import {
    inBetweenPosition,
    isWithinBounds,
    manhattanDistance,
    possibleDestinations,
    toId,
    toPosition,
} from './position-functions';
import { emptyGameConfig } from './game-config-functions';
import { Position } from './models/position';
import { GameConfig } from './models/game-config';
import { CurrentMove } from './models/current-move';
import { MoveType } from './models/move-type';
import { Node, NodeType } from './models/node';
import { Move } from '@ng-frontend/generated-api-client';
import { Color } from './models/color';
import { CreateMove } from './models/create-move';
import { HFENtoGameSetup } from './halma-fen';

type GameBoardState = {
    currentMove: CurrentMove;
    ownColor: Color | undefined;
    config: GameConfig;
    boardRotation: number;
    boardRotateNext: boolean;
    lastCompletedMove: CreateMove | undefined;
    lastReceivedMove: Move | undefined;
};

const initialState: GameBoardState = {
    currentMove: emptyCurrentMove(),
    ownColor: undefined,
    config: emptyGameConfig(),
    boardRotation: 0,
    boardRotateNext: true,
    lastCompletedMove: undefined,
    lastReceivedMove: undefined,
};

@Injectable()
export class GameBoardStore extends signalStore(withState(initialState), withEntities<Node>()) {
    private readonly gameService = inject(GameMockService);

    public createGameFromHFEN(hfenNotation: string): void {
        const { nodes, currentMove } = HFENtoGameSetup(hfenNotation);
        patchState(this, setAllEntities(nodes));
        patchState(this, { currentMove });
        // TODO pull this from FEN notation
        patchState(this, { config: { players: [], bounds: { width: 5, height: 5, cornerSize: 2 } } });
    }

    // TODO Far from complete, does not apply the state correctly, proof of concept
    public onMove(move: Move): void {
        if (move.move_number === this.lastCompletedMove()?.move_number) {
            return; // Filter out our own moves
        }

        const oldPiece = this.getNode(move.from_position);

        patchState(
            this,
            updateEntity({
                id: move.from_position,
                changes: { type: NodeType.EMPTY, color: Color.NONE },
            })
        );

        patchState(
            this,
            updateEntity({
                id: move.to_position,
                changes: { type: NodeType.PIECE, color: oldPiece.color },
            })
        );

        patchState(this, { lastReceivedMove: move });
    }

    public onClickNode(id: string): void {
        const node = this.getNode(id);

        switch (node.type) {
            case NodeType.SELECTED:
                // Deselect suggestions
                this.deselectPossibleMoves();
                this.deselectSelected();
                break;
            case NodeType.POSSIBLE_MOVE: // TODO not only listen on this type, you want to be able to disable suggestions
                this.setCompletedMove(node);
                // Calculate move type
                this.setMoveType(node);

                // Calculate move type
                this.setMoveType(node);

                // Deselect suggestions
                this.deselectPossibleMoves();

                // Deselect old node
                this.clearNode();

                // Select new node
                this.selectNode(node);

                if (this.isEndOfTurn()) {
                    // Next turn
                    // TODO: rotate board if this.boardRotateNext === true && players.length > 1

                    this.deselectSelected();
                } else {
                    // Highlight possible move nodes
                    this.highlightPossibleMoveNodes(node);
                }

                break;
            case NodeType.PIECE:
                this.deselectSelected();
                this.deselectPossibleMoves();
                this.selectNode(node);
                // Highlight possible move nodes
                this.highlightPossibleMoveNodes(node);
                break;
            default:
                break;
        }
    }

    public setOwnColor(ownColor: Color | undefined) {
        patchState(this, { ownColor });

        if (ownColor) {
            patchState(this, { currentMove: emptyCurrentMoveWithColor(ownColor) });
        }
    }

    public endTurn() {
        // Deselect suggestions
        this.deselectPossibleMoves();

        this.deselectSelected();

        // TODO Probably missing something
        patchState(this, { currentMove: setMoveType(this.currentMove(), undefined) });
    }

    private setCompletedMove(node: Node) {
        patchState(this, {
            lastCompletedMove: {
                color: this.currentMove.colorToMove(),
                move_number: (this.lastReceivedMove()?.move_number ?? 0) + 1,
                from_position: this.currentMove.selectedNodeId() ?? '',
                to_position: node.id,
            },
        });
    }

    private deselectSelected() {
        if (this.currentMove.selectedNodeId()) {
            patchState(
                this,
                updateEntity({
                    id: this.currentMove.selectedNodeId() ?? '',
                    changes: { type: NodeType.PIECE },
                })
            );
            patchState(this, {
                currentMove: setSelectedNodeId(this.currentMove(), undefined),
            });
        }
    }

    private clearNode() {
        if (this.currentMove.selectedNodeId()) {
            patchState(
                this,
                updateEntity({
                    id: this.currentMove.selectedNodeId() ?? '',
                    changes: { type: NodeType.EMPTY, color: Color.NONE },
                })
            );
        }
    }

    private deselectPossibleMoves() {
        patchState(
            this,
            updateEntities({
                predicate: (node) => node.type === NodeType.POSSIBLE_MOVE,
                changes: { type: NodeType.EMPTY },
            })
        );
    }

    private isEndOfTurn(): boolean {
        return this.currentMove.moveType() === MoveType.SHIFT;
    }

    private highlightPossibleMoveNodes(node: Node): void {
        if (!this.currentMove.selectedNodeId()) {
            return;
        }

        let possiblePositions = possibleDestinations(node.id, this.currentMove.moveType());

        const validNodeIds = possiblePositions
            .filter((position) => this.isPossibleMove(position))
            .map((position) => toId(position));

        patchState(
            this,
            updateEntities({
                predicate: (node) => validNodeIds.includes(node.id),
                changes: { type: NodeType.POSSIBLE_MOVE },
            })
        );
    }

    private isPossibleMove(position: Position) {
        if (!isWithinBounds(position, this.config.bounds())) {
            // TODO do we even needs this anymore?
            return false;
        }

        if (this.entityMap()[toId(position)]?.type !== NodeType.EMPTY) {
            return false;
        }

        const distance = manhattanDistance(toPosition(this.currentMove.selectedNodeId() ?? ''), position);

        if (this.isJump(distance)) {
            const betweenPosition = inBetweenPosition(toPosition(this.currentMove.selectedNodeId() ?? ''), position);
            // TODO safeCorner

            if (this.isPieceOrUndefined(toId(betweenPosition))) {
                return false;
            }
        }

        return true;
    }

    private isJump(distance: number) {
        return distance > 1;
    }

    // TODO Test
    private isPieceOrUndefined(id: string) {
        return this.entityMap()[id].type === NodeType.PIECE;
    }

    private setMoveType(node: Node): void {
        if (this.currentMove.selectedNodeId()) {
            patchState(this, {
                currentMove: setMoveType(
                    this.currentMove(),
                    this.getMoveType(this.currentMove.selectedNodeId() ?? '', node.id)
                ),
            });
        }
    }

    private getMoveType(startId: string, endId: string): MoveType {
        const manhattenDistance = manhattanDistance(toPosition(startId), toPosition(endId));
        return manhattenDistance > 1 ? MoveType.JUMP : MoveType.SHIFT;
    }

    private selectNode(node: Node) {
        if (this.canSelectNode(node)) {
            patchState(
                this,
                updateEntity({
                    id: node.id,
                    changes: { type: NodeType.SELECTED, color: this.currentMove.colorToMove() },
                })
            );
            patchState(this, {
                currentMove: setSelectedNodeId(this.currentMove(), node.id),
            });
        }
    }

    private getNode(id: string): Node {
        return this.entityMap()[id];
    }

    private canSelectNode(node: Node): boolean {
        if (node.type === NodeType.POSSIBLE_MOVE) {
            return true;
        }

        if (this.ownColor()) {
            return node.color === this.ownColor() && node.type !== NodeType.SELECTED;
        }

        return node.color === this.currentMove.colorToMove() && node.type !== NodeType.SELECTED;
    }

    public rotateBoard(deg: number) {
        // TODO set next angle according the next player
        // TODO Whole lot of hardcoded, not very useful code
        if (this.ownColor()) {
            let rotation;
            if (this.ownColor() === 'Y') {
                rotation = 0;
            } else {
                rotation = 180;
            }
            patchState(this, {
                boardRotation: rotation,
            });
        }
    }

    public setBoardRotateNext(next: boolean) {
        patchState(this, {
            boardRotateNext: next,
        });
    }

    createGame = rxMethod<GameConfig>(
        pipe(
            exhaustMap((config) =>
                this.gameService.loadGame(config).pipe(
                    tapResponse({
                        next: (nodes) => {
                            patchState(this, setAllEntities(nodes));
                            patchState(this, { config });
                        },
                        error: console.error,
                    })
                )
            )
        )
    );
}
