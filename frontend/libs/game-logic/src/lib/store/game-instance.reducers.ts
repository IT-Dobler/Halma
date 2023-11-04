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

/**
 * Like most functions, it assumes "honest" input.
 */
const nextTurn = (state: GameInstanceState) => {
  const player = playersAdapter
    .getSelectors()
    .selectById(state.players, state.currentMove.playerIdToMove)!;

  deselectAnyPiece(state);
  clearPossibleMoves(state);
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

  // Check whether we are clicking on already selected node, deselect
  if (node.type === NodeTypeTS.SELECTED) {
    deselectPiece(node, state);
    clearPossibleMoves(state);
  } else {
    // If we have moved in this turn and click on a different piece, end the turn
    if (
      state.currentMove.lastMovedNodeId !== undefined &&
      state.currentMove.lastMovedNodeId !== node.id
    ) {
      // It is not allowed to end ones turn in the starting positions of the perpendicular players
      if (isInParkingPosition(node, state)) {
        return;
      }

      clearPossibleMoves(state);
      // Deselect potentially previously selected piece
      deselectAnyPiece(state);

      // TODO Also check that we actually changed something in our position.
      if (state.currentMove.lastMovedNodeId !== state.currentMove.initiallySelectedNodeId) {
        nextTurn(state);

        // If it's not our turn, exit out, otherwise select the clicked node
        if (state.currentMove.playerIdToMove !== node.owningPlayerId) {
          return;
        }
      }

      // We moved back to where we started, reset current move.
      state.currentMove.moveType = undefined;
      state.currentMove.lastMovedNodeId = undefined;

    }

    clearPossibleMoves(state);
    // Deselect potentially previously selected piece
    deselectAnyPiece(state);

    // Select the clicked node
    setNodeAsSelected(node.id, node.owningPlayerId, state);

    state.currentMove.initiallySelectedNodeId = node.id;

    getAndSetPossibleMoves(node.id, state);
  }
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

  // TODO Refactor this...
  if (hasWon(selectedNode.owningPlayerId!, state)) {
    deselectAnyPiece(state);
    clearPossibleMoves(state);
    state.isWon = true;
    incrementStepCounter(state);
    return;
  }

  setPossibleMovesOrNextTurn(action.payload, state);
};

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

function deselectAnyPiece(state: GameInstanceState) {
  const selectedNode = getSelectedNode(state);

  if (selectedNode) {
    deselectPiece(selectedNode, state);
  }
}

function setPossibleMovesOrNextTurn(startId: string, state: GameInstanceState) {
  const validNodesId = getValidMoves(startId, state);

  // We've moved with a piece and ran out of possible moves -> Next turn
  if (
    state.currentMove.lastMovedNodeId !== undefined &&
    validNodesId.length === 0
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
};
