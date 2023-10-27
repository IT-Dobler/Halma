export interface Position {
    row: number;
    col: number;
}

export class PositionUtil {
    public static areEqual(p1: Position, p2: Position) {
        return p1.row === p2.row && p1.col === p2.col;
    }
}