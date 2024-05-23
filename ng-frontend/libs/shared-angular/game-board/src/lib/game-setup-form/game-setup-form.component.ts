import {ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GameBoardStore } from "../state/game-board.store";
import { GameBoardComponent } from "@ng-frontend/shared-angular/game-board";

@Component({
    selector: 'app-game-setup-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './game-setup-form.component.html',
    styleUrl: './game-setup-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupFormComponent {
    readonly store = inject(GameBoardStore);
    readonly gameboard: GameBoardComponent = inject(GameBoardComponent);
}
