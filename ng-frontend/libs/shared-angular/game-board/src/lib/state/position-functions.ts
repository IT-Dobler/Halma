import { Position } from './models/position';
import { MoveType } from './models/move-type';
import { GameBounds } from './models/game-bounds';

export function toId(position: Position) {
    // It says it's impossible, but its javascript so it's not impossible!
    if (typeof position.col !== 'number' || typeof position.row !== 'number') {
        throw new TypeError('Position includes a not number!');
    }
    return `${String.fromCharCode(65 + position.col)}:${position.row + 1}`;
}

export function toPosition(id: string): Position {
    const [colString, rowString] = id.split(':');

    return { row: Number(rowString) - 1, col: colString.charCodeAt(0) - 65 };
}

export function inBetweenPosition(p1: Position, p2: Position): Position {
    const row = (p1.row + p2.row) / 2;
    const col = (p1.col + p2.col) / 2;
    return { row, col };
}

export function manhattanDistance(p1: Position, p2: Position): number {
    const rowDiff = p1.row - p2.row;
    const colDiff = p1.col - p2.col;
    return Math.abs(rowDiff) + Math.abs(colDiff);
}

export function isWithinBounds(
    position: Position,
    bounds: GameBounds
): boolean {
    const { row, col } = position;
    return row >= 0 && col >= 0 && row < bounds.height && col < bounds.width;
}

// TODO: redo filter shifts by color
export function possibleDestinations(
    nodeId: string,
    moveType: MoveType | undefined
): Position[] {
    const { row, col } = toPosition(nodeId);

    // Valid jumps
    const JUMP_DESTINATIONS: Position[] = [
        // Orthogonal jumps
        { row: row, col: col - 2 }, // left
        { row: row, col: col + 2 }, // right
        { row: row + 2, col: col }, // up
        { row: row - 2, col: col }, // down

        // Diagonal jumps
        { row: row + 2, col: col - 2 }, // left
        { row: row + 2, col: col + 2 }, // right
        { row: row - 2, col: col - 2 }, // up
        { row: row - 2, col: col + 2 }, // down
    ];

    // Valid shifts
    const SHIFT_DESTINATIONS: Position[] = [
        // Orthogonal moves
        { row: row, col: col - 1 }, // left
        { row: row, col: col + 1 }, // right
        { row: row + 1, col: col }, // up
        { row: row - 1, col: col }, // down
    ];

    if (moveType === undefined) {
        return [...JUMP_DESTINATIONS, ...SHIFT_DESTINATIONS];
    } else if (moveType === MoveType.JUMP) {
        return [...JUMP_DESTINATIONS];
    } else {
        return [...SHIFT_DESTINATIONS];
    }
}
