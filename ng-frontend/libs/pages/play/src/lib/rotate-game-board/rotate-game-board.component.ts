import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-rotate-game-board',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rotate-game-board.component.html',
    styleUrl: './rotate-game-board.component.scss',
})
export class RotateGameBoardComponent {
    @Output() gameBoardRotationAngle: EventEmitter<number> = new EventEmitter<number>();

    setGameBoardRotationAngle(deg: number) {
        this.gameBoardRotationAngle.emit(deg);
    }
}
