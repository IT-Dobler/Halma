import { Color } from './color';

import { MoveType } from './move-type';

export interface CurrentMove {
    colorToMove: Color;
    selectedNodeId: string | undefined;
    moveType: MoveType | undefined;
}
