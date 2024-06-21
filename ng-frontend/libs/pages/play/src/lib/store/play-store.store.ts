import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, Observable, pipe } from 'rxjs';
import { GameService, Move } from '@ng-frontend/generated-api-client';
import { tapResponse } from '@ngrx/operators';
import { LiveGameService } from '../../../../playground/src/lib/live-game.service';
import { Color, colorMap } from '../../../../../shared-angular/game-board/src/lib/state/models/color';
import { GameConfig } from '../../../../../shared-angular/game-board/src/lib/state/models/game-config';
import { GameDisplayConfig } from '../../../../../shared-angular/game-board/src/lib/state/models/game-display-config';

type PlayPageState = {
    hfenNotation: string | undefined;
    moves$: Observable<Move> | undefined;
    localColor: Color | undefined;
    gameConfig: GameConfig;
    gameDisplayConfig: GameDisplayConfig;
    gameBoardRotationAngle: number;
};

const initialState: PlayPageState = {
    hfenNotation: undefined,
    moves$: undefined,
    localColor: undefined,
    gameConfig: { bounds: { width: 0, height: 0, cornerSize: 0 }, players: [] },
    gameDisplayConfig: { boardRotateNext: false, displayBoardIndex: 'inside', boardIndexRegion: 'rightbottom' },
    gameBoardRotationAngle: 0,
};

@Injectable()
export class PlayPageStore extends signalStore(withState(initialState)) {
    private readonly gameService = inject(GameService);
    private readonly liveGameService = inject(LiveGameService);

    public sendMove($event: Move) {
        this.liveGameService.sendMove($event);
    }

    initGameFromCode = rxMethod<string>(
        pipe(
            exhaustMap((code) =>
                this.gameService.joinGame(code).pipe(
                    tapResponse({
                        next: (response) => {
                            // TODO get the HFEN notation from the payload
                            patchState(this, {
                                hfenNotation: 'xxrxx/x1r1x/5/x1y1x/xxyxx ' + response.color.toLowerCase(),
                            });
                            patchState(this, { localColor: colorMap[response.color] });
                            this.connect(code);
                        },
                        error: console.error, // TODO Error handling when the game is already full
                    })
                )
            )
        )
    );

    private connect(code: string) {
        this.liveGameService.joinGame(code);
        patchState(this, { moves$: this.liveGameService.moves$() });
    }

    public setHFEN(hfen: string) {
        patchState(this, { hfenNotation: hfen });
    }

    public setLocalColor(color: Color) {
        patchState(this, { localColor: color });
    }

    public setGameDisplayConfig(gameDisplayConfig: GameDisplayConfig) {
        patchState(this, { gameDisplayConfig: { ...gameDisplayConfig } });
    }

    public setGameBoardRotationAngle(deg: number) {
        patchState(this, { gameBoardRotationAngle: deg });
    }
}
