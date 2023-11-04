import { GameConfig } from './model/game-config';
import { PositionTS } from './model/position';
import { directionsOfPlay, PlayDirection } from './model/play-direction';
import { Simulate } from 'react-dom/test-utils';

export class PositionUtil {
  static toString(position: PositionTS) {
    return `${String.fromCharCode(65 + position.col)}:${position.row + 1}`;
  }

  static toPosition(id: string): PositionTS {
    const [colString, rowString] = id.split(':');

    return { row: Number(rowString) - 1, col: colString.charCodeAt(0) - 65 };
  }

  public static manhattanDistance(p1: PositionTS, p2: PositionTS): number {
    const rowDiff = p1.row - p2.row;
    const colDiff = p1.col - p2.col;
    return Math.abs(rowDiff) + Math.abs(colDiff);
  }

  public static isCornerPosition(
    config: GameConfig,
    position: PositionTS,
  ): boolean {
    const zeroAdjustedCornerSize = config.cornerSize - 1;
    const zeroAdjustedWidth = config.width - 1;
    const zeroAdjustedHeight = config.height - 1;

    const CORNER_POSITIONS: PositionTS[] = [
      { row: zeroAdjustedCornerSize, col: zeroAdjustedCornerSize },
      {
        row: zeroAdjustedCornerSize,
        col: zeroAdjustedWidth - zeroAdjustedCornerSize,
      },
      {
        row: zeroAdjustedHeight - zeroAdjustedCornerSize,
        col: zeroAdjustedCornerSize,
      },
      {
        row: zeroAdjustedHeight - zeroAdjustedCornerSize,
        col: zeroAdjustedWidth - zeroAdjustedCornerSize,
      },
    ];

    return !CORNER_POSITIONS.find(
      (p) => p.row === position.row && p.col === position.col,
    );
  }

  public static getStartingNodeIds(
    config: GameConfig,
    playDirection: PlayDirection,
  ): string[] {
    const positions = [];
    switch (playDirection) {
      case PlayDirection.BOTTOM_TO_TOP:
        for (
          let col = config.cornerSize;
          col < config.width - config.cornerSize;
          col++
        ) {
          const id1 = PositionUtil.toString({ row: 0, col });
          positions.push(id1);

          const id2 = PositionUtil.toString({ row: 1, col });
          positions.push(id2);
        }
        return positions;
      case PlayDirection.TOP_TO_BOTTOM:
        const zeroAdjustedHeight = config.height - 1;
        for (
          let col = config.cornerSize;
          col < config.width - config.cornerSize;
          col++
        ) {
          const id1 = PositionUtil.toString({ row: zeroAdjustedHeight, col });
          positions.push(id1);

          const id2 = PositionUtil.toString({
            row: zeroAdjustedHeight - 1,
            col,
          });
          positions.push(id2);
        }
        return positions;
      case PlayDirection.RIGHT_TO_LEFT:
        for (
          let row = config.cornerSize;
          row < config.height - config.cornerSize;
          row++
        ) {
          const id1 = PositionUtil.toString({ row, col: config.width - 1 });
          positions.push(id1);

          const id2 = PositionUtil.toString({ row, col: config.width - 2 });
          positions.push(id2);
        }
        return positions;
      case PlayDirection.LEFT_TO_RIGHT:
        for (
          let row = config.cornerSize;
          row < config.height - config.cornerSize;
          row++
        ) {
          const id1 = PositionUtil.toString({ row, col: 0 });
          positions.push(id1);

          const id2 = PositionUtil.toString({ row, col: 1 });
          positions.push(id2);
        }
        return positions;
    }
  }

  public static getVictoryNodeIds(
    config: GameConfig,
    playDirection: PlayDirection,
  ): string[] {
    const indexOf = directionsOfPlay.indexOf(playDirection);
    return PositionUtil.getStartingNodeIds(
      config,
      directionsOfPlay[(indexOf + 2) % directionsOfPlay.length],
    );
  }

  public static getNoParkingNodeIds(
    config: GameConfig,
    playDirection: PlayDirection,
  ): string[] {
    const indexOf = directionsOfPlay.indexOf(playDirection);

    return [
      ...PositionUtil.getStartingNodeIds(
        config,
        directionsOfPlay[(indexOf + 1) % directionsOfPlay.length],
      ),
      ...PositionUtil.getStartingNodeIds(
        config,
        directionsOfPlay[(indexOf + 3) % directionsOfPlay.length],
      ),
    ];
  }
}
