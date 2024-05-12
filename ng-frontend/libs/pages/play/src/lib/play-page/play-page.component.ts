import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from '@ng-frontend/shared-angular/game-board';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-play',
    standalone: true,
    imports: [CommonModule, GameBoardComponent, RouterLink],
    templateUrl: './play-page.component.html',
    styleUrl: './play-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayPageComponent {}
