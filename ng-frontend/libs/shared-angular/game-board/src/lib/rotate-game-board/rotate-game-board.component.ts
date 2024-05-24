import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameBoardStore} from "../state/game-board.store";

@Component({
    selector: 'app-rotate-game-board',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rotate-game-board.component.html',
    styleUrl: './rotate-game-board.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RotateGameBoardComponent {
    readonly store = inject(GameBoardStore);
}
