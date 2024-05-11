import { Player } from './player';
import { GameBounds } from './game-bounds';

export interface GameConfig {
    bounds: GameBounds;
    players: Player[];
}
