import { GameTypeTS } from './game-type';

export interface GameConfig {
  playersId: string[];
  gameType: GameTypeTS;
  width: number;
  height: number;
  cornerSize: number;
  hasRotatingBoard: boolean;
}

export class GameConfigUtil {
  public static getInitialState(): GameConfig {
    return {
      gameType: GameTypeTS.CLAUDIO,
      cornerSize: 0,
      height: 0,
      width: 0,
      playersId: [],
      hasRotatingBoard: false,
    };
  }
}
