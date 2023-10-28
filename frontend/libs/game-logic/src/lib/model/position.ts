export interface PositionTS {
  row: number;
  col: number;
}

export class PositionUtil {
  static toString(position: PositionTS) {
    return `${String.fromCharCode(65 + position.col)}${position.row + 1}`;
  }

  static toPosition(id: string): PositionTS {
    const [colString, rowString] = id.split('');

    return { row: Number(rowString) - 1, col: colString.charCodeAt(0) - 65 };
  }

  public static manhattanDistance(p1: PositionTS, p2: PositionTS): number {
    const rowDiff = p1.row - p2.row;
    const colDiff = p1.col - p2.col;
    return Math.abs(rowDiff) + Math.abs(colDiff);
  }
}
