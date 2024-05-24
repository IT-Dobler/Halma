import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-game-board-vertical-index',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-board-vertical-index.component.html',
    styleUrl: './game-board-vertical-index.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardVerticalIndexComponent {
    @Input() verticalIndexNodes?: number[] = [];
}
