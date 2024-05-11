import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardStore } from '../state/game-board.store';
import { NodeComponent } from '../node/node.component';
import {
    FormControl,
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { colorWheelInitialization } from '../state/models/color';
import { Player } from '../state/models/player';
import { directionOfInit } from '../state/models/play-direction';

type GameSettings = FormGroup<{
    bounds: FormGroup<{
        width: FormControl<number>;
        height: FormControl<number>;
        cornerSize: FormControl<number>;
    }>;
    playerCount: FormControl<number>;
}>;

@Component({
    selector: 'app-game-board',
    standalone: true,
    imports: [CommonModule, NodeComponent, ReactiveFormsModule, FormsModule],
    providers: [GameBoardStore],
    templateUrl: './game-board.component.html',
    styleUrl: './game-board.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
    readonly store = inject(GameBoardStore);

    private formBuilder = inject(NonNullableFormBuilder);

    public form: GameSettings = this.formBuilder.group({
        bounds: this.formBuilder.group({
            width: [0, [Validators.required]],
            height: [0, [Validators.required]],
            cornerSize: [0, [Validators.required]],
        }),
        playerCount: [1, [Validators.required]],
    });

    public createEmptyGame() {
        const formValue = this.form.getRawValue();

        const players: Player[] = [];
        for (let i = 0; i < formValue.playerCount; i++) {
            players.push({
                id: 'player' + i,
                color: colorWheelInitialization[i],
                playDirection: directionOfInit[i],
                moveOrder: i,
            });
        }

        this.store.createGame({
            bounds: formValue.bounds,
            players,
        });
    }
}
