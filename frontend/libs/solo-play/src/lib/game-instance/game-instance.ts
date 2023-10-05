import assert from "assert";

export class GameEngine {
    readonly gameInstance: GameInstance;

    constructor(gameInstance: GameInstance) {
        this.gameInstance = gameInstance;
    }

    public getValidMoves(piece: BoardPiece) {
        const row = piece.position.row;
        const col = piece.position.col;
        // Go over all 12 possible destinations and check whether they are valid moves
        const possibleDestinations = [
            // Orthogonal Moves
            new Position(row, col - 1), // left
            new Position(row, col + 1), // right
            new Position(row + 1, col), // up
            new Position(row - 1, col), // down

            // Orthogonal Jumps
            new Position(row, col - 2), // left
            new Position(row, col + 2), // right
            new Position(row + 2, col), // up
            new Position(row - 2, col), // down

            // Diagonal Jumps
            new Position(row + 2, col - 2), // top left
            new Position(row + 2, col + 2), // top right
            new Position(row - 2, col - 2), // bottom left
            new Position(row - 2, col + 2), // bottom right
        ];

        const validMoves = [];
        for (const destination of possibleDestinations) {
            if (this.isMovePossible(piece, destination)) {
                validMoves.push(destination);
            }
        }

        return validMoves;

    }

    /**
     * This method assumes "honest" input. It does not invalidate an arbitrary move.
     * Validating arbitrary moves for validity client side would be a waste of code.
     * @param piece
     * @param destination
     * @private
     */
    private isMovePossible(piece: BoardPiece, destination: Position): boolean {
        // Check if the destination is within board bounds
        if (!this.gameInstance.boardDimensions.isWithinBoardBounds(destination)) {
            return false;
        }

        // Check if the destination is occupied already
        if (this.gameInstance.gameState.hasBoardPiece(destination)) {
            return false;
        }

        // Find the distance between piece and destination
        const distance = this.manhattanDistance(piece.position, destination);

        // If it's a jumping move (manhattan distance > 1)
        if (distance > 1) {
            // Check if there is a piece "in between"
            const inBetweenPosition = this.getInBetweenPosition(piece.position, destination);
            return this.gameInstance.gameState.hasBoardPiece(inBetweenPosition);
        }

        // Otherwise we did an unblocked orthogonal move (not jump!) within bounds, hence valid.
        return true;
    }

    private manhattanDistance(p1: Position, p2: Position): number {
        const rowDiff = p1.row - p2.row;
        const colDiff = p1.col - p2.col;
        return Math.abs(rowDiff) + Math.abs(colDiff);
    }

    private getInBetweenPosition(p1: Position, p2: Position) {
        const row = (p1.row + p2.row) / 2;
        const col = (p1.col + p2.col) / 2;
        return new Position(row, col);
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

    public isBlockedPosition(p: Position): boolean {
        return !!this.blockedPositions.find(value => value.row === p.row && value.col === p.col);
    }

    public isWithinBoardBounds(p: Position) {
        if (p.row >= 0 && p.col >= 0 && p.row < this.height && p.col < this.width) {
            // Check if the position is blocked
            return !this.isBlockedPosition(p);
        }

        return false;
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
    readonly players: string[];
    gameState: GameState;
    boardDimensions: BoardDimensions;

    public static claudioHalma(players: string[]): GameInstance {
        const boardDimensions = new BoardDimensions(8, 8, 3);
        const gameState = GameStateUtil.initClaudioHalmaBoard(players, boardDimensions);
        return new GameInstance(players, boardDimensions, gameState);
    }

    constructor(players: string[], boardDimensions: BoardDimensions, gameState: GameState) {
        this.players = players;
        this.boardDimensions = boardDimensions;
        this.gameState = gameState;
    }
}

export class GameState {
    idToPlay: string;
    pieces: BoardPiece[];

    constructor(pieces: BoardPiece[], idToPlay: string) {
        this.pieces = pieces;
        this.idToPlay = idToPlay;
    }

    public hasBoardPiece(position: Position): boolean {
        return !!this.pieces.find(
            piece => piece.position.row === position.row && piece.position.col === position.col);
    }


}

export class GameStateUtil {


    public static initClaudioHalmaBoard(players: string[], boardDimensions: BoardDimensions): GameState {
        assert(players.length <= 4);

        const pieces: BoardPiece[] = [];

        // Player 1 always starts at the "bottom"
        if (players.at(0)) {
            // Fill pieces for player 1
            for (let col = boardDimensions.cornerSize; col < boardDimensions.width - boardDimensions.cornerSize; col++) {
                pieces.push(new BoardPiece(new Position(0, col), players[0]));
                pieces.push(new BoardPiece(new Position(1, col), players[0]));
            }
        }

        // Player 2 is opposite of Player 1, at the "top"
        if (players.at(1)) {
            // Fill pieces for player 1
            const zeroAdjustedHeight = boardDimensions.height - 1;
            for (let col = boardDimensions.cornerSize; col < boardDimensions.width - boardDimensions.cornerSize; col++) {
                pieces.push(new BoardPiece(new Position(zeroAdjustedHeight, col), players[1]));
                pieces.push(new BoardPiece(new Position(zeroAdjustedHeight - 1, col), players[1]));
            }
        }

        // Player 3 is to the "left"
        if (players.at(2)) {
            // Fill pieces for player 1
            for (let row = boardDimensions.cornerSize; row < boardDimensions.height - boardDimensions.cornerSize; row++) {
                pieces.push(new BoardPiece(new Position(row, 0), players[2]));
                pieces.push(new BoardPiece(new Position(row, 1), players[2]));
            }
        }

        // Player 4 is opposite of Player 3, to the "right"
        if (players.at(3)) {
            // Fill pieces for player 1
            for (let row = boardDimensions.cornerSize; row < boardDimensions.height - boardDimensions.cornerSize; row++) {
                pieces.push(new BoardPiece(new Position(row, boardDimensions.width), players[3]));
                pieces.push(new BoardPiece(new Position(row, boardDimensions.width - 1), players[3]));
            }
        }

        return new GameState(pieces, players[0]);

    }
}

export class BoardPiece {
    position: Position;
    readonly owningPlayerId: String;

    constructor(position: Position, owningPlayerId: String) {
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