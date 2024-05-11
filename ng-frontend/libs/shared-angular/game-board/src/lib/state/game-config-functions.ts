import { GameConfig } from './models/game-config';
import { GameBounds } from './models/game-bounds';

export function emptyGameConfig(): GameConfig {
    return {
        bounds: emptyGameBounds(),
        players: [],
    };
}

export function emptyGameBounds(): GameBounds {
    return {
        width: 0,
        height: 0,
        cornerSize: 0,
    };
}
