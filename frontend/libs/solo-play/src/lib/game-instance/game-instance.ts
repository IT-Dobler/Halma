import assert from "assert";


export class GameEngine {

    public isValidMove(piece: BoardPiece, gameState: GameState): boolean {
        if (piece.owningPlayerId !== gameState.idToPlay) {
            return false;
        }

        return true;
    }
}

export class BoardDimensions {
    readonly width: number;
    readonly height: number;
    readonly cornerSize: number;
    readonly blockedPositions: Position[];

    constructor(width: number, height: number, cornerSize: number) {
        this.width = width;
        this.height = height;
        this.cornerSize = cornerSize;
        this.blockedPositions = this.getBlockedPositions();
    }

    public getStartingArea(): Record<number, number> {
        return this.width - (2 * this.cornerSize);
    }

    /**
     * Gives back the blocked coordinates for a given board width and the cornerSize
     * cornerSize can be zero when there should be no blocked squares:
     * <br>
     * o|o|o<br>
     * o|o|o<br>
     * o|o|o<br>
     * <br>
     * with a cornerSize of one, a single coordinate will be blocked in each corner:
     * <br>
     * x|o|x<br>
     * o|o|o<br>
     * x|o|x
     */
    private getBlockedPositions(): Position[] {
        // cornerSize must be strictly smaller than half the width and height.
        assert(this.cornerSize < this.width / 2);
        assert(this.cornerSize < this.height / 2);

        const positions: Position[] = [];
        for (let i = this.cornerSize; 0 < i; i--) {
            for (let j = i; 0 < j; j--) {
                const zeroAdjustedRow = this.cornerSize - i;
                const zeroAdjustedCol = j - 1;

                positions.push(new Position(this.height - zeroAdjustedRow, this.width - zeroAdjustedCol));
                positions.push(new Position(this.height - zeroAdjustedRow, zeroAdjustedCol));
                positions.push(new Position(zeroAdjustedRow, this.width - zeroAdjustedCol));
                positions.push(new Position(zeroAdjustedRow, zeroAdjustedCol));
            }
        }

        return positions;
    }
}

export class GameInstance {
    readonly numberOfPlayers: number;
    gameState: GameState;
    boardDimensions: BoardDimensions;

    public static claudioHalma(numberOfPlayers: number): GameInstance {
        const boardDimensions = new BoardDimensions(8, 8, 3);

        return new GameInstance(numberOfPlayers, boardDimensions);
    }

    constructor(numberOfPlayers: number, boardDimensions: BoardDimensions) {
        this.numberOfPlayers = numberOfPlayers;
        this.boardDimensions = boardDimensions;
    }
}

export class GameState {
    idToPlay = 0;
    pieces: BoardPiece[];

    constructor(pieces: BoardPiece[]) {
        this.pieces = pieces;
    }


}

export class GameStateUtil {
    public static initClaudioHalmaBoard(players: string[], boardDimensions: BoardDimensions): GameState {
        assert(players.length <= 4);

        if (players.at(0)) {
            // Fill pieces for player 1
        }


    }
}

export class BoardPiece {
    position: Position;
    readonly owningPlayerId: number;

    constructor(position: Position, owningPlayerId: number) {
        this.position = position;
        this.owningPlayerId = owningPlayerId;
    }
}

export class Position {
    row: number;
    col: number;

    public static fromString(coordinate: string): Position {
        assert(coordinate.length === 2);

        const [rowString, colString] = coordinate.split('');

        return new Position(rowString.charCodeAt(0) - 64, Number(colString));
    }

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    public toString(): string {
        return `${String.fromCharCode(64 + this.row)}${this.col}`;
    }
}