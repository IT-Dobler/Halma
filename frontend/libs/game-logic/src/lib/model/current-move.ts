import { PlayDirection } from './play-direction';

import { MoveType } from 'game-logic';

export interface CurrentMove {
  playerIdToMove: string;
  playDirection: PlayDirection;
  moveType?: MoveType;
  lastMovedNodeId?: string;
  initiallySelectedNodeId?: string;
}
