import {
  GameInstanceState,
  gameStateAdapter,
  MoveType,
  playersAdapter,
} from 'game-logic';
import { PositionTS } from './model/position';
import { PlayDirection } from './model/play-direction';
import { NodeEntity } from './model/node-entity';
import { NodeTypeTS } from './model/node-type';
import { PositionUtil } from './position-util';

export function getValidMoves(nodeId: string, state: GameInstanceState) {
  const { row, col } = PositionUtil.toPosition(nodeId);

  // Valid jumps
  const JUMP_DESTINATIONS: PositionTS[] = [
    // Orthogonal jumps
    { row: row, col: col - 2 }, // left
    { row: row, col: col + 2 }, // right
    { row: row + 2, col: col }, // up
    { row: row - 2, col: col }, // down

    // Diagonal jumps
    { row: row + 2, col: col - 2 }, // left
    { row: row + 2, col: col + 2 }, // right
    { row: row - 2, col: col - 2 }, // up
    { row: row - 2, col: col + 2 }, // down
  ];

  // Valid shifts
  const SHIFT_DESTINATIONS: PositionTS[] = [
    // Orthogonal moves
    { row: row, col: col - 1 }, // left
    { row: row, col: col + 1 }, // right
    { row: row + 1, col: col }, // up
    { row: row - 1, col: col }, // down
  ];

  let possibleDestinations: PositionTS[] = [];

  // If this node has previously moved, only allow further movement with this node
  if (state.currentMove.moveType === MoveType.JUMP) {
    possibleDestinations.push(...JUMP_DESTINATIONS);
  } else if (state.currentMove.moveType === MoveType.SHIFT) {
    possibleDestinations.push(...SHIFT_DESTINATIONS);
  } else if (state.currentMove.moveType === undefined) {
    // No move made yet, all options available
    possibleDestinations.push(...JUMP_DESTINATIONS, ...SHIFT_DESTINATIONS);
  }

  const node = gameStateAdapter
    .getSelectors()
    .selectById(state.gameState, nodeId)!;
  const player = playersAdapter
    .getSelectors()
    .selectById(state.players, node.owningPlayerId!)!;
  const config = state.config;
  switch (player.playDirection) {
    case PlayDirection.BOTTOM_TO_TOP:
      // No "down shift" allowed
      possibleDestinations = possibleDestinations.filter(
        (p) => p.row !== row - 1,
      );
      break;
    case PlayDirection.TOP_TO_BOTTOM: // No "up shift" moves allowed
      possibleDestinations = possibleDestinations.filter(
        (p) => p.row !== row + 1,
      );
      break;
    case PlayDirection.RIGHT_TO_LEFT: // No "right shift" allowed
      possibleDestinations = possibleDestinations.filter(
        (p) => p.col !== col + 1,
      );
      break;
    case PlayDirection.LEFT_TO_RIGHT: // No "left shift" allowed
      possibleDestinations = possibleDestinations.filter(
        (p) => p.col !== col - 1,
      );
      break;
  }

  // For the bigger game modes, filters out moves that would shift the node into no parking zones.
  if (config.width > 5) {
    /**
     * Filters out moves that would shift the node into no parking zones. Note Jumping into a parking zone is still
     * allowed temporarily, so only filter out shift possibleDestinations.
     */

    possibleDestinations = possibleDestinations.filter(
      (p) =>
        (Math.abs(p.col - col) > 1 || Math.abs(p.row - row) > 1) ||
        !PositionUtil.getNoParkingNodeIds(
          config,
          player.playDirection,
        ).includes(PositionUtil.toString(p)),
    );
  }

  const validNodesId: string[] = [];
  for (const destination of possibleDestinations) {
    if (isMovePossible(state, nodeId, destination)) {
      validNodesId.push(PositionUtil.toString(destination));
    }
  }

  return validNodesId;
}

export function isMovePossible(
  state: GameInstanceState,
  nodeId: string,
  dest: PositionTS,
): boolean {
  function getNodeByPosition(position: PositionTS): NodeEntity | undefined {
    return state.gameState.entities[PositionUtil.toString(position)];
  }

  function isPiece(position: PositionTS): boolean {
    return getNodeByPosition(position)?.type === NodeTypeTS.PIECE;
  }

  function isWithinBounds(): boolean {
    const config = state.config;
    if (
      dest.row >= 0 &&
      dest.col >= 0 &&
      dest.row < config.height &&
      dest.col < config.width
    ) {
      return getNodeByPosition(dest)?.type !== NodeTypeTS.BLOCKED;
    }
    return false;
  }

  function getInBetweenPosition(p1: PositionTS, p2: PositionTS): PositionTS {
    const row = (p1.row + p2.row) / 2;
    const col = (p1.col + p2.col) / 2;
    return { row, col };
  }

  // Check if the destination is within board bounds
  if (!isWithinBounds()) {
    return false;
  }

  // Check if the destination is occupied already
  if (isPiece(dest)) {
    return false;
  }

  // Find the distance between piece and destination
  const distance = PositionUtil.manhattanDistance(
    PositionUtil.toPosition(nodeId),
    dest,
  );

  // If it's a jumping move (manhattan distance > 1)
  if (distance > 1) {
    // Check if there is a piece "in between"
    const inBetweenPosition = getInBetweenPosition(
      PositionUtil.toPosition(nodeId),
      dest,
    );

    if (isPiece(inBetweenPosition)) {
      if (state.config.width === 5) {
        return true; // Exit early for the smallest map
      }

      // It is not allowed to jump across the "safe" corners. Since the positions in the corners of the starting positions
      // are still reachable from different angles, we cannot filter the target node straight away, but need to do it here
      // where we know that it's a jumping move, across a piece in the "safe" corner.

      // So, if it's a jump over a safe corner, deny it. Otherwise, ok.
      return PositionUtil.isCornerPosition(state.config, inBetweenPosition);
    }
    return false;
  }

  // Otherwise we did an unblocked orthogonal shift (not jump!) within bounds, hence valid.
  return true;
}
