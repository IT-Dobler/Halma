import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardStore } from '../state/game-board.store';

@Component({
    selector: 'app-node',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './node.component.html',
    styleUrl: './node.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent {
    @Input() nodeId!: string;

    readonly store = inject(GameBoardStore);
}
