import { exhaustMap, Observable, pipe } from 'rxjs';
import { CreateGameRequest, GameService, Move } from '@ng-frontend/generated-api-client';
import { Color } from '../../../../../shared-angular/game-board/src/lib/state/models/color';
import { inject, Injectable } from '@angular/core';
import { signalStore, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import { GameType } from './game-type';
import { GameBounds } from '../../../../../shared-angular/game-board/src/lib/state/models/game-bounds';

type HomePageState = {
    hfenNotation: string | undefined;
    moves$: Observable<Move> | undefined;
    localColor: Color | undefined;
};

const initialState: HomePageState = {
    hfenNotation: undefined,
    moves$: undefined,
    localColor: undefined,
};

@Injectable()
export class HomePageStore extends signalStore(withState(initialState)) {
    private readonly gameService = inject(GameService);
    private readonly router = inject(Router);

    createGame = rxMethod<{ gameType: GameType; playerCount: number }>(
        pipe(
            exhaustMap((input) => {
                // TODO unsure where to do this type of mapping
                const bounds = this.gameTypeToBounds(input.gameType);

                const request: CreateGameRequest = {
                    ...bounds,
                    corner_size: bounds.cornerSize,
                    max_players: input.playerCount,
                };

                return this.gameService.create(request).pipe(
                    tapResponse({
                        next: (response) => {
                            this.router.navigate([response.code]);
                        },
                        error: console.error,
                    })
                );
            })
        )
    );

    private gameTypeToBounds(gameType: GameType): GameBounds {
        switch (gameType) {
            case GameType.TWO_PIECES:
                return { width: 5, height: 5, cornerSize: 2 };
            case GameType.EIGHT_PIECES:
                return { width: 8, height: 8, cornerSize: 2 };
            case GameType.TEN_PIECES:
                return { width: 9, height: 9, cornerSize: 2 };
            case GameType.FOURTEEN_PIECES:
                return { width: 11, height: 11, cornerSize: 2 };
        }
    }
}
