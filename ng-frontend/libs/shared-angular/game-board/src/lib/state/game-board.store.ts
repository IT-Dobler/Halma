import { patchState, signalStore, withState } from '@ngrx/signals';
import {
    setAllEntities,
    updateEntities,
    updateEntity,
    withEntities,
} from '@ngrx/signals/entities';
import { exhaustMap, pipe } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { GameMockService } from './game-mock.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
    emptyCurrentMove,
    setMoveType,
    setSelectedNodeId,
} from './current-move-functions';
import {
    filterShifts,
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
};

const initialState: GameBoardState = {
    currentMove: emptyCurrentMove(),
    config: emptyGameConfig(),
};

@Injectable()
export class GameBoardStore extends signalStore(
    withState(initialState),
    withEntities<Node>()
) {
    private gameService = inject(GameMockService);

    public onClickNode(id: string): void {
        const node = this.getNode(id);
        switch (node.type) {
            case NodeType.SELECTED:
                this.deselectNode(node);
                this.deselectPossibleMoves();
                break;
            case NodeType.POSSIBLE_MOVE: // TODO not only listen on this type, you want to be able to disable suggestions
                // Calculate move type
                this.setMoveType(node);

                // Deselect old node
                this.deselectNode(
                    this.getNode(this.currentMove.selectedNodeId() ?? '')
                );

                // Deselect suggestions
                this.deselectPossibleMoves();

                if (this.isEndOfTurn()) {
                    // Next turn
                } else {
                    // Select new node
                    this.selectNode(node);

                    // Highlight possible move nodes
                    this.highlightPossibleMoveNodes(node);
                }

                break;
            case NodeType.PIECE:
                this.selectNode(node);
                // Highlight possible move nodes
                this.highlightPossibleMoveNodes(node);
                break;
            default:
                break;
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
        let possiblePositions = possibleDestinations(
            node.id,
            this.currentMove.moveType()
        );

        possiblePositions = filterShifts(
            node.id,
            possiblePositions,
            this.currentMove.playDirection()
        );

        // TODO filterShiftsIntoStartZones

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

        const distance = manhattanDistance(
            toPosition(this.currentMove.selectedNodeId() ?? ''),
            position
        );

        if (this.isJump(distance)) {
            const betweenPosition = inBetweenPosition(
                toPosition(this.currentMove.selectedNodeId() ?? ''),
                position
            );
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

    private deselectNode(node: Node): void {
        if (this.canDeselectNode(node)) {
            patchState(
                this,
                updateEntity({
                    id: node.id,
                    changes: { type: NodeType.PIECE },
                })
            );
        }
    }

    private setMoveType(node: Node): void {
        patchState(this, {
            currentMove: setMoveType(
                this.currentMove(),
                this.getMoveType(
                    this.currentMove.selectedNodeId() ?? '',
                    node.id
                )
            ),
        });
    }

    private getMoveType(startId: string, endId: string): MoveType {
        const manhattenDistance = manhattanDistance(
            toPosition(startId),
            toPosition(endId)
        );
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
        return (
            node.color === this.currentMove.colorToMove() &&
            node.type !== NodeType.SELECTED
        );
    }

    private canDeselectNode(node: Node): boolean {
        return (
            node.color === this.currentMove.colorToMove() &&
            node.type === NodeType.SELECTED
        );
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
