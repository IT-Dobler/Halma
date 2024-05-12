import { Color } from './color';
import { PlayDirection } from './play-direction';

export interface Player {
    id: string;
    color: Color;
    playDirection: PlayDirection;
    moveOrder: number;
}
