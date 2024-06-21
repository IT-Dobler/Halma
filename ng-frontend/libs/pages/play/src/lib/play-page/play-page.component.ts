import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from '@ng-frontend/shared-angular/game-board';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayPageStore } from '../store/play-store.store';
import { Move } from '@ng-frontend/generated-api-client';
import { GameSetupFormComponent } from '../game-setup-form/game-setup-form.component';
import { GameBoardStore } from '../../../../../shared-angular/game-board/src/lib/state/game-board.store';
import { GameDisplayConfig } from '../../../../../shared-angular/game-board/src/lib/state/models/game-display-config';
import { RotateGameBoardComponent } from '../rotate-game-board/rotate-game-board.component';
import { colorMap } from '../../../../../shared-angular/game-board/src/lib/state/models/color';
import { getColorFromHfen } from '../../../../../shared-angular/game-board/src/lib/state/halma-fen';

@Component({
    selector: 'app-play',
    standalone: true,
    imports: [CommonModule, GameBoardComponent, RouterLink, GameSetupFormComponent, RotateGameBoardComponent],
    providers: [PlayPageStore, GameBoardStore],
    templateUrl: './play-page.component.html',
    styleUrl: './play-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayPageComponent {
    readonly store = inject(PlayPageStore);
    readonly activatedRoute = inject(ActivatedRoute);

    constructor() {
        // TODO: define const for 'gameCode'
        const code = this.activatedRoute.snapshot.paramMap.get('gameCode');

        if (code && code !== 'local') {
            this.store.initGameFromCode(code);
        }
    }

    public onMove($event: Move) {
        this.store.sendMove($event);
    }

    public setHFENFromGameSetupForm(hfen: string) {
        this.store.setHFEN(hfen);
        const color = getColorFromHfen(hfen).toUpperCase();
        this.store.setLocalColor(colorMap[color]);
    }

    public setGameDisplayConfig(gameDisplayConfig: GameDisplayConfig) {
        this.store.setGameDisplayConfig(gameDisplayConfig);
    }
}
