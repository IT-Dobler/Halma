import {
  GameConfig,
  GameInstanceState, gameStateAdapter,
  NodeEntity,
  PlayerEntity,
} from 'game-logic';
import { NodeTypeTS } from './node-type';
import { PositionTS, PositionUtil } from './position';
import { EntityId } from '@reduxjs/toolkit';

export function initBoard(config: GameConfig): Record<EntityId, NodeEntity> {
  // const nodes: NodeEntity[] = [];

  const nodes: Record<EntityId, NodeEntity> = {};

  for (let row = 0; row < config.height; row++) {
    for (let col = 0; col < config.width; col++) {
      const id = PositionUtil.toString({ row, col });
      nodes[id] = {
        id,
        type: NodeTypeTS.EMPTY,
        owningPlayerId: undefined,
      };
      // nodes.push({
      //   id: PositionUtil.toString({ row, col }),
      //   type: row % 2 === 0 ? NodeTypeTS.EMPTY : NodeTypeTS.BLOCKED,
      // });
    }
  }
  return nodes;
}

export function initBlockedPositions(
  nodes: Record<EntityId, NodeEntity>,
  config: GameConfig,
) {
  for (let i = config.cornerSize; 0 < i; i--) {
    for (let j = i; 0 < j; j--) {
      const zeroAdjustedRow = config.cornerSize - i;
      const zeroAdjustedCol = j - 1;
      const zeroAdjustedHeight = config.height - 1;
      const zeroAdjustedWidth = config.width - 1;

      const id1 = PositionUtil.toString({
        row: zeroAdjustedHeight - zeroAdjustedRow,
        col: zeroAdjustedWidth - zeroAdjustedCol,
      });
      nodes[id1].type = NodeTypeTS.BLOCKED;

      const id2 = PositionUtil.toString({
        row: zeroAdjustedHeight - zeroAdjustedRow,
        col: zeroAdjustedCol,
      });
      nodes[id2].type = NodeTypeTS.BLOCKED;

      const id3 = PositionUtil.toString({
        row: zeroAdjustedRow,
        col: zeroAdjustedWidth - zeroAdjustedCol,
      });
      nodes[id3].type = NodeTypeTS.BLOCKED;

      const id4 = PositionUtil.toString({
        row: zeroAdjustedRow,
        col: zeroAdjustedCol,
      });
      nodes[id4].type = NodeTypeTS.BLOCKED;

      // TODO Comment this
      // positions.push({row: zeroAdjustedHeight - zeroAdjustedRow, col: zeroAdjustedWidth - zeroAdjustedCol});
      // positions.push({row: zeroAdjustedHeight - zeroAdjustedRow, col: zeroAdjustedCol});
      // positions.push({row: zeroAdjustedRow, col: zeroAdjustedWidth - zeroAdjustedCol});
      // positions.push({row: zeroAdjustedRow, col: zeroAdjustedCol});
    }
  }
}

export function initPieces(
  nodes: Record<EntityId, NodeEntity>,
  players: PlayerEntity[],
  config: GameConfig,
): void {
  // const pieces: PieceTS[] = [];

  // Player 1 always starts at the "bottom"
  if (players.at(0)) {
    // Fill pieces for player 1
    for (
      let col = config.cornerSize;
      col < config.width - config.cornerSize;
      col++
    ) {
      const id1 = PositionUtil.toString({ row: 0, col });
      setPlayerNode(nodes[id1], players[0]);

      const id2 = PositionUtil.toString({ row: 1, col });
      setPlayerNode(nodes[id2], players[0]);

      // pieces.push({ position: { row: 0, col }, owningPlayerId: players[0].id });
      // pieces.push({ position: { row: 1, col }, owningPlayerId: players[0].id });
    }
  }

  // Player 2 is opposite of Player 1, at the "top"
  if (players.at(1)) {
    // Fill pieces for player 1
    const zeroAdjustedHeight = config.height - 1;
    for (
      let col = config.cornerSize;
      col < config.width - config.cornerSize;
      col++
    ) {
      const id1 = PositionUtil.toString({ row: zeroAdjustedHeight, col });
      setPlayerNode(nodes[id1], players[1]);

      const id2 = PositionUtil.toString({ row: zeroAdjustedHeight - 1, col });
      setPlayerNode(nodes[id2], players[1]);

      // pieces.push({
      //   position: { row: zeroAdjustedHeight, col },
      //   owningPlayerId: players[1].id,
      // });
      // pieces.push({
      //   position: { row: zeroAdjustedHeight - 1, col },
      //   owningPlayerId: players[1].id,
      // });
    }
  }

  // Player 3 is to the "right"
  if (players.at(2)) {
    for (
      let row = config.cornerSize;
      row < config.height - config.cornerSize;
      row++
    ) {
      const id1 = PositionUtil.toString({ row, col: config.width - 1 });
      setPlayerNode(nodes[id1], players[2]);

      const id2 = PositionUtil.toString({ row, col: config.width - 2 });
      setPlayerNode(nodes[id2], players[2]);

      // pieces.push({
      //   position: { row, col: boardLayout.width - 1 },
      //   owningPlayerId: players[2].id,
      // });
      // pieces.push({
      //   position: { row, col: boardLayout.width - 2 },
      //   owningPlayerId: players[2].id,
      // });
    }
  }

  // Player 4 is opposite of Player 3, to the "left"
  if (players.at(3)) {
    for (
      let row = config.cornerSize;
      row < config.height - config.cornerSize;
      row++
    ) {
      const id1 = PositionUtil.toString({ row, col: 0 });
      setPlayerNode(nodes[id1], players[3]);

      const id2 = PositionUtil.toString({ row, col: 1 });
      setPlayerNode(nodes[id2], players[3]);

      // pieces.push({ position: { row, col: 0 }, owningPlayerId: players[3].id });
      // pieces.push({ position: { row, col: 1 }, owningPlayerId: players[3].id });
    }
  }
}

export function getValidNodesId(nodeId: string, state: GameInstanceState) {
  // const selectedPiece = state.currentMove.selectedPiece;
  // const player = state.players.find(player => player.id === state.currentMove.playerIdToMove)!
  // if (!selectedPiece) {
  //   return [];
  // }
  
  const { row, col } = PositionUtil.toPosition(nodeId);

  // const row = selectedPiece.position.row;
  // const col = selectedPiece.position.col;

  // Get valid moves
  const allDestinations: PositionTS[] = [
    // Orthogonal moves
    {row: row, col: col - 1}, // left
    {row: row, col: col + 1}, // right
    {row: row + 1, col: col}, // up
    {row: row - 1, col: col}, // down

    // Orthogonal jumps
    {row: row, col: col - 2}, // left
    {row: row, col: col + 2}, // right
    {row: row + 2, col: col}, // up
    {row: row - 2, col: col}, // down

    // Diagonal jumps
    {row: row + 2, col: col - 2}, // left
    {row: row + 2, col: col + 2}, // right
    {row: row - 2, col: col - 2}, // up
    {row: row - 2, col: col + 2}, // down
  ];

  // let possibleDestinations: PositionTS[] = [];
  // switch (player.playDirection) {
  //   case PlayDirection.BOTTOM_TO_TOP: // No "down" moves allowed
  //     possibleDestinations = allDestinations.filter(p => p.row >= row);
  //     break;
  //   case PlayDirection.TOP_TO_BOTTOM: // No "up" moves allowed
  //     possibleDestinations = allDestinations.filter(p => p.row <= row);
  //     break;
  //   case PlayDirection.RIGHT_TO_LEFT: // No "right" moves allowed
  //     possibleDestinations = allDestinations.filter(p => p.col <= col);
  //     break;
  //   case PlayDirection.LEFT_TO_RIGHT: // No "left" moves allowed
  //     possibleDestinations = allDestinations.filter(p => p.col >= col);
  //     break;
  // }

  const validNodesId: string[] = [];
  for (const destination of allDestinations) {
    if (isMovePossible(state, nodeId, destination)) {
      validNodesId.push(PositionUtil.toString(destination));
    }
  }


  return validNodesId;
}

export function isMovePossible(state: GameInstanceState, nodeId: string, dest: PositionTS): boolean {

  function getNodeByPosition(position: PositionTS): NodeEntity | undefined {
    return state.gameState.entities[PositionUtil.toString(position)];
  }
  
  function isPiece(position: PositionTS): boolean {
    return getNodeByPosition(position)?.type === NodeTypeTS.PIECE;
  }
  
  function isWithinBounds(): boolean {
    const config = state.config;
    if (dest.row >= 0 && dest.col >= 0 && dest.row < config.height && dest.col < config.width) {
      return getNodeByPosition(dest)?.type !== NodeTypeTS.BLOCKED;
    }
    return false;
  }

  function manhattanDistance(p1: PositionTS, p2: PositionTS): number {
    const rowDiff = p1.row - p2.row;
    const colDiff = p1.col - p2.col;
    return Math.abs(rowDiff) + Math.abs(colDiff);
  }

  function getInBetweenPosition(p1: PositionTS, p2: PositionTS): PositionTS {
    const row = (p1.row + p2.row) / 2;
    const col = (p1.col + p2.col) / 2;
    return {row, col};
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
  const distance = manhattanDistance(PositionUtil.toPosition(nodeId), dest);

  // If it's a jumping move (manhattan distance > 1)
  if (distance > 1) {
    // Check if there is a piece "in between"
    const inBetweenPosition = getInBetweenPosition(
        PositionUtil.toPosition(nodeId),
        dest,
    );
    return isPiece(inBetweenPosition);
  }

  // Otherwise we did an unblocked orthogonal move (not jump!) within bounds, hence valid.
  return true;
}

function clearPossibleMoves(state: GameInstanceState) {
  gameStateAdapter.setMany(state.gameState, state.possibleMovesId.map((id)))
}

function setPlayerNode(node: NodeEntity, player: PlayerEntity) {
  node.type = NodeTypeTS.PIECE;
  node.owningPlayerId = player.id;
}