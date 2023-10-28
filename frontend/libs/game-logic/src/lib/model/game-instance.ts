import { EntityId } from '@reduxjs/toolkit';
import { NodeEntity } from './node-entity';
import { PlayerEntity } from './player-entity';
import { GameConfig } from './game-config';
import { CurrentMove } from './current-move';

export interface GameInstanceTS {
  nodes: Record<EntityId, NodeEntity>;
  players: PlayerEntity[];
  config: GameConfig;
  currentMove: CurrentMove;
}
