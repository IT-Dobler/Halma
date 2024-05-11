import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { initGameBoard } from './game-init-functions';
import { GameConfig } from './models/game-config';
import { Node } from './models/node';

@Injectable({ providedIn: 'root' })
export class GameMockService {
    public loadGame(config: GameConfig): Observable<Array<Node>> {
        return of(initGameBoard(config));
    }
}
