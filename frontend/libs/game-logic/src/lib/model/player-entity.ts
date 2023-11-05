import { PlayDirection } from './play-direction';

export interface PlayerEntity {
  id: string;
  color: string;
  playDirection: PlayDirection;
  displayName: string;
}
