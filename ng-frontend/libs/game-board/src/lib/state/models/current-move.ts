import {Color} from './color';

import {MoveType} from "./move-type";
import {PlayDirection} from "./play-direction";

export interface CurrentMove {
    colorToMove: Color;
    playDirection: PlayDirection;
    selectedNodeId: string | undefined;
    moveType: MoveType | undefined;
}
