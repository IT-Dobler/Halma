import { PlayDirection } from './models/play-direction';
import { Color } from './models/color';

import { CurrentMove } from './models/current-move';
import { MoveType } from './models/move-type';

export function emptyCurrentMove(): CurrentMove {
    return {
        colorToMove: Color.YELLOW,
        playDirection: PlayDirection.BOTTOM_TO_TOP,
        selectedNodeId: undefined,
        moveType: undefined,
    };
}

export function setMoveType(
    currentMove: CurrentMove,
    moveType: MoveType
): CurrentMove {
    return {
        ...currentMove,
        moveType,
    };
}

export function setSelectedNodeId(
    currentMove: CurrentMove,
    selectedNodeId: string | undefined
): CurrentMove {
    return {
        ...currentMove,
        selectedNodeId,
    };
}
