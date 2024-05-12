import {ChangeDetectionStrategy, Component, inject, input, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameBoardStore} from "../state/game-board.store";
import { Node } from '../state/models/node';

@Component({
    selector: 'app-node',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './node.component.html',
    styleUrl: './node.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent {
    @Input() node!: Node;

    readonly store = inject(GameBoardStore);
}
