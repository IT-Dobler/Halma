import {
  GameInstanceState,
  gameStateAdapter,
  MoveType,
  playersAdapter,
} from 'game-logic';
import { directionsOfPlay } from '../model/play-direction';
import { PayloadAction } from '@reduxjs/toolkit';
import { NodeTypeTS } from '../model/node-type';
import { NodeEntity } from '../model/node-entity';
import { getValidMoves } from '../move-logic.util';
import { PositionUtil } from '../position-util';
import { CurrentMoveUtil } from '../current-move-util';

/**
 * Like most functions, it assumes "honest" input.
 */
const nextTurn = (state: GameInstanceState) => {
  const player = playersAdapter
    .getSelectors()
    .selectById(state.players, state.currentMove.playerIdToMove)!;

  clearSelectionAndPossibleMoves(state);
  incrementStepCounter(state);

  const indexOf = directionsOfPlay.indexOf(player?.playDirection);
  for (let i = 1; i <= directionsOfPlay.length; i++) {
    const nextPlayDirection =
      directionsOfPlay[(indexOf + i) % directionsOfPlay.length];
    const nextPlayer = Object.values(state.players.entities).find(
      (player) => player!.playDirection === nextPlayDirection,
    );

    if (nextPlayer) {
      state.currentMove.playerIdToMove = nextPlayer.id;
      state.currentMove.playDirection = nextPlayer.playDirection; // TODO This is redundant I think, could remove..
      state.currentMove.moveType = undefined;
      state.currentMove.lastMovedNodeId = undefined;
      state.currentMove.initiallySelectedNodeId = undefined;
      break;
    }
  }
};

const clickPiece = (
  state: GameInstanceState,
  action: PayloadAction<string>,
) => {
  const node = state.gameState.entities[action.payload]!;

  // Check if the clicker owns this node
  if (state.currentMove.playerIdToMove !== node.owningPlayerId) {
    return;
  }

  // Check whether we are clicking on already selected node
  if (node.type === NodeTypeTS.SELECTED) {
    // Prevent de-select if there has been movement
    if (state.currentMove.initiallySelectedNodeId !== node.id) {
      return;
    }

    clearSelectionAndPossibleMoves(state);
    return;
  }

  // If we have moved in this turn and click on a different piece, end the turn
  if (CurrentMoveUtil.hasMoved(state.currentMove)) {
    // It is not allowed to end the turn in the starting positions of the perpendicular players
    if (isInParkingPosition(node, state)) {
      return;
    }

    // Check that we actually changed something in our position.
    if (CurrentMoveUtil.hasProgressed(state.currentMove)) {
      nextTurn(state);

      // If it's not our turn, exit out, otherwise select the clicked node
      if (state.currentMove.playerIdToMove !== node.owningPlayerId) {
        return;
      }
    }

    // No progress: Reset current move type
    state.currentMove.moveType = undefined;
    state.currentMove.lastMovedNodeId = undefined;
  }

  clearSelectionAndPossibleMoves(state);

  setNodeAsSelected(node.id, node.owningPlayerId, state);

  state.currentMove.initiallySelectedNodeId = node.id;

  getAndSetPossibleMoves(node.id, state);
};

const clickDestination = (
  state: GameInstanceState,
  action: PayloadAction<string>,
) => {
  const selectedNode = getSelectedNode(state);

  if (selectedNode === undefined) {
    throw Error("Can't move without a previous selection");
  }

  // Clear our previously selected piece
  resetNode(selectedNode, state);
  clearPossibleMoves(state);

  // Select new piece
  setNodeAsSelected(action.payload, selectedNode.owningPlayerId, state);

  setCurrentMove(selectedNode.id, action.payload, state);

  // If we returned to the initial starting position, consider it an "undone" move and allow all options again.
  if (state.currentMove.initiallySelectedNodeId === action.payload) {
    state.currentMove.moveType = undefined;
  }

  if (hasWon(selectedNode.owningPlayerId!, state)) {
    clearSelectionAndPossibleMoves(state);
    incrementStepCounter(state);
    state.isWon = true;
    return;
  }

  setPossibleMovesOrNextTurn(action.payload, state);
};

const instructionsShown = (state: GameInstanceState) => {
  state.showInstructions = false;
}

function isInParkingPosition(
  node: NodeEntity,
  state: GameInstanceState,
): boolean {
  return PositionUtil.getNoParkingNodeIds(
    state.config,
    state.currentMove.playDirection,
  ).includes(state.currentMove.lastMovedNodeId!);
}

function incrementStepCounter(state: GameInstanceState) {
  state.stepCounter++;
}

function hasWon(playerId: string, state: GameInstanceState): boolean {
  const player = playersAdapter
    .getSelectors()
    .selectById(state.players, playerId)!;

  const victoryPositions = PositionUtil.getVictoryNodeIds(
    state.config,
    player.playDirection,
  );

  for (const nodeId of victoryPositions) {
    const node = state.gameState.entities[nodeId]!;

    if (node.owningPlayerId === undefined) {
      return false;
    }

    if (node.owningPlayerId !== playerId) {
      return false;
    }

    if (node.type !== NodeTypeTS.PIECE && node.type !== NodeTypeTS.SELECTED) {
      return false;
    }
  }

  return true;
}

function clearSelectionAndPossibleMoves(state: GameInstanceState) {
  clearPossibleMoves(state);
  deselectAnyPiece(state);
}

function deselectAnyPiece(state: GameInstanceState) {
  const selectedNode = getSelectedNode(state);

  if (selectedNode) {
    deselectPiece(selectedNode, state);
  }
}

function setPossibleMovesOrNextTurn(startId: string, state: GameInstanceState) {
  const validNodesId = getValidMoves(startId, state);

  // If we have shifted -> next turn.
  if (
    state.currentMove.lastMovedNodeId !== undefined &&
    state.currentMove.moveType === MoveType.SHIFT
  ) {
    nextTurn(state);
  } else {
    setPossibleMoves(startId, validNodesId, state);
  }
}

function setNodeAsSelected(
  nodeId: string,
  owningPlayerId: string | undefined,
  state: GameInstanceState,
) {
  gameStateAdapter.updateOne(state.gameState, {
    id: nodeId,
    changes: {
      type: NodeTypeTS.SELECTED,
      owningPlayerId: owningPlayerId,
    },
  });
}

function clearPossibleMoves(state: GameInstanceState) {
  gameStateAdapter.updateMany(
    state.gameState,
    state.possibleMovesId.map((id) => ({
      id: id,
      changes: { type: NodeTypeTS.EMPTY },
    })),
  );
  // Shout out as to why one should never keep state in multiple locations :D
  // Reset possibleMovesId after clearing the actual data.
  state.possibleMovesId = [];
}

function setCurrentMove(
  startId: string,
  endId: string,
  state: GameInstanceState,
) {
  const distance = PositionUtil.manhattanDistance(
    PositionUtil.toPosition(startId),
    PositionUtil.toPosition(endId),
  );
  state.currentMove.moveType = distance > 1 ? MoveType.JUMP : MoveType.SHIFT;

  state.currentMove.lastMovedNodeId = endId;
}

function getSelectedNode(state: GameInstanceState) {
  return Object.values(state.gameState.entities).find(
    (value) => value?.type === NodeTypeTS.SELECTED,
  );
}

function deselectPiece(node: NodeEntity, state: GameInstanceState) {
  gameStateAdapter.updateOne(state.gameState, {
    id: node.id,
    changes: {
      type: NodeTypeTS.PIECE,
      owningPlayerId: node.owningPlayerId,
    },
  });
}

function resetNode(node: NodeEntity, state: GameInstanceState) {
  gameStateAdapter.updateOne(state.gameState, {
    id: node.id,
    changes: { type: NodeTypeTS.EMPTY, owningPlayerId: undefined },
  });
}

function getAndSetPossibleMoves(startId: string, state: GameInstanceState) {
  const validNodesId = getValidMoves(startId, state);
  setPossibleMoves(startId, validNodesId, state);
}

function setPossibleMoves(
  startId: string,
  validNodesId: string[],
  state: GameInstanceState,
) {
  state.possibleMovesId = validNodesId;

  gameStateAdapter.updateMany(
    state.gameState,
    validNodesId.map((id) => ({
      id: id,
      changes: { type: NodeTypeTS.POSSIBLE_MOVE },
    })),
  );
}

export const gameInstanceReducers = {
  nextTurn,
  clickPiece,
  clickDestination,
  instructionsShown,
};
