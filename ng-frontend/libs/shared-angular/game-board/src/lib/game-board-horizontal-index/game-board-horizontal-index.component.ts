import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-game-board-horizontal-index',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-board-horizontal-index.component.html',
    styleUrl: './game-board-horizontal-index.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardHorizontalIndexComponent {
    @Input() horizontalIndexNodes?: string[] = [];
    @Input() boardHorizontalContainerGridTemplateColumns: string = '';
}
