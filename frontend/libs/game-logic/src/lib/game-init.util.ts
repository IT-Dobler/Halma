import { NodeTypeTS } from './model/node-type';
import { EntityId } from '@reduxjs/toolkit';
import { GameConfig } from './model/game-config';
import { NodeEntity } from './model/node-entity';
import { PlayerEntity } from './model/player-entity';
import {PositionUtil} from "./position-util";

export class GameInitUtil {
  public static initBoard(config: GameConfig): Record<EntityId, NodeEntity> {
    // const nodes: NodeEntity[] = [];

    const nodes: Record<EntityId, NodeEntity> = {};

    for (let row = config.height - 1; row > -1; row--) {
      for (let col = 0; col < config.width; col++) {
        const id = PositionUtil.toString({ row, col });
        nodes[id] = {
          id,
          type: NodeTypeTS.EMPTY,
          owningPlayerId: undefined,
        };
      }
    }
    return nodes;
  }

  public static initBlockedPositions(
    nodes: Record<EntityId, NodeEntity>,
    config: GameConfig,
  ) {
    for (let i = config.cornerSize; 0 < i; i--) {
      for (let j = i; 0 < j; j--) {
        const zeroAdjustedRow = config.cornerSize - i;
        const zeroAdjustedCol = j - 1;
        const zeroAdjustedHeight = config.height - 1;
        const zeroAdjustedWidth = config.width - 1;

        // Top right corner
        const id1 = PositionUtil.toString({
          row: zeroAdjustedHeight - zeroAdjustedRow,
          col: zeroAdjustedWidth - zeroAdjustedCol,
        });
        nodes[id1].type = NodeTypeTS.BLOCKED;

        // Top left corner
        const id2 = PositionUtil.toString({
          row: zeroAdjustedHeight - zeroAdjustedRow,
          col: zeroAdjustedCol,
        });
        nodes[id2].type = NodeTypeTS.BLOCKED;

        // Bottom right corner
        const id3 = PositionUtil.toString({
          row: zeroAdjustedRow,
          col: zeroAdjustedWidth - zeroAdjustedCol,
        });
        nodes[id3].type = NodeTypeTS.BLOCKED;

        // Bottom left corner
        const id4 = PositionUtil.toString({
          row: zeroAdjustedRow,
          col: zeroAdjustedCol,
        });
        nodes[id4].type = NodeTypeTS.BLOCKED;
      }
    }
  }

  public static initPieces(
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
      }
    }
  }
}

function setPlayerNode(node: NodeEntity, player: PlayerEntity) {
  node.type = NodeTypeTS.PIECE;
  node.owningPlayerId = player.id;
}
