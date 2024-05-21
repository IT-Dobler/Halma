import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBounds } from '../state/models/game-bounds';

@Component({
    selector: 'app-board-index',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './board-index.component.html',
    styleUrl: './board-index.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardIndexComponent {
    public bounds = input.required({
        transform: (value: GameBounds) => value,
    });

    public files = computed(() => {
        const files: string[] = [];
        for (let i = 0; i < this.bounds().width; i++) {
            // TODO do we translate this? What is "C" in Chinese?
            files.push(String.fromCharCode(65 + +i));
        }

        return files;
    });

    public rows = computed(() => {
        const rows: string[] = [];
        for (let i = 1; i <= this.bounds().height; i++) {
            rows.push(String(i));
        }

        return rows;
    });
}
