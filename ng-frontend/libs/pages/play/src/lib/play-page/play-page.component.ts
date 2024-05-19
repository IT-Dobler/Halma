import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from '@ng-frontend/shared-angular/game-board';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayPageStore } from '../store/play-store.store';
import { Move } from '@ng-frontend/generated-api-client';

@Component({
    selector: 'app-play',
    standalone: true,
    imports: [CommonModule, GameBoardComponent, RouterLink],
    providers: [PlayPageStore],
    templateUrl: './play-page.component.html',
    styleUrl: './play-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayPageComponent {
    readonly store = inject(PlayPageStore);
    readonly activatedRoute = inject(ActivatedRoute);

    constructor() {
        const code = this.activatedRoute.snapshot.paramMap.get('gameCode');

        if (code && code !== 'local') {
            this.store.initGameFromCode(code);
        }
    }

    public onMove($event: Move) {
        this.store.sendMove($event);
    }
}
