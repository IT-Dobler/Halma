import { patchState, signalStore, withState } from '@ngrx/signals';
import { setAllEntities, updateEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { exhaustMap, pipe } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { GameMockService } from './game-mock.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { emptyCurrentMove, setMoveType, setSelectedNodeId } from './current-move-functions';
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

type GameBoardState = {
    currentMove: CurrentMove;
    config: GameConfig;
    boardRotation: number;
    boardRotateNext: boolean;
};

const initialState: GameBoardState = {
    currentMove: emptyCurrentMove(),
    config: emptyGameConfig(),
    boardRotation: 0,
    boardRotateNext: true,
};

@Injectable()
export class GameBoardStore extends signalStore(withState(initialState), withEntities<Node>()) {
    private gameService = inject(GameMockService);

    public onClickNode(id: string): void {
        const node = this.getNode(id);
        switch (node.type) {
            case NodeType.SELECTED:
                this.deselectSelected();
                this.deselectPossibleMoves();
                break;
            case NodeType.POSSIBLE_MOVE: // TODO not only listen on this type, you want to be able to disable suggestions
                // Calculate move type
                this.setMoveType(node);

                // Deselect old node
                this.deselectSelected();

                // Deselect suggestions
                this.deselectPossibleMoves();

                if (this.isEndOfTurn()) {
                    // Next turn
                    // TODO: rotate board if this.boardRotateNext === true && players.length > 1
                } else {
                    // Select new node
                    this.selectNode(node);

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
        patchState(this, {
            currentMove: setMoveType(
                this.currentMove(),
                this.getMoveType(this.currentMove.selectedNodeId() ?? '', node.id)
            ),
        });
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
                    changes: { type: NodeType.SELECTED },
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
        return node.color === this.currentMove.colorToMove() && node.type !== NodeType.SELECTED;
    }

    public rotateBoard(deg: number) {
        // TODO set next angle according the next player
        if (this.boardRotateNext()) {
            let rotation: number = 0;
            if (deg === 0) {
                rotation = 0;
            } else {
                rotation += rotation === 270 ? -270 : rotation === -270 ? 270 : deg;
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
