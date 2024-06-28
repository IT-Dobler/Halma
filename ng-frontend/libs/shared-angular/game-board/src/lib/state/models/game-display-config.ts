export interface GameDisplayConfig {
    boardRotateNext: boolean;
    displayBoardIndex: DisplayBoardIndex;
    boardIndexRegion: BoardIndexRegion;
}

export enum DisplayBoardIndex {
    INSIDE = 'INSIDE',
    OUTSIDE = 'OUTSIDE',
    NONE = 'NONE',
}

export enum BoardIndexRegion {
    ALL_AROUND = 'ALL_AROUND',
    RIGHT_BOTTOM = 'RIGHT_BOTTOM',
}
