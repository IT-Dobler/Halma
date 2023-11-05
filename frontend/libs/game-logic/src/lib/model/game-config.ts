import { GameTypeTS } from './game-type';

export interface GameConfig {
  playersId: string[];
  gameType: GameTypeTS;
  width: number;
  height: number;
  cornerSize: number;
  hasRotatingBoard: boolean;
  showPossibleMoves: boolean
}

export class GameConfigUtil {
  public static getInitialState(): GameConfig {
    return {
      cornerSize: 2,
      height: 11,
      width: 11,
      gameType: GameTypeTS.CLAUDIO,
      playersId: ['1'],
      hasRotatingBoard: false,
      showPossibleMoves: true
    };
  }
}
