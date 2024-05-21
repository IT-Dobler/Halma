import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
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
import { Color, colorWheelInitialization } from '../state/models/color';
import { Player } from '../state/models/player';
import { directionOfInit } from '../state/models/play-direction';
import { Observable } from 'rxjs';
import { Move } from '@ng-frontend/generated-api-client';
import { Router } from '@angular/router';

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
    styleUrl: './game-board.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
    readonly store = inject(GameBoardStore);
    readonly router = inject(Router);

    public inputSocket = input(undefined, {
        transform: (value: Observable<Move> | undefined) => value,
    });

    public initialHFEN = input(undefined, {
        transform: (value: string | undefined) => value,
    });

    public ownColor = input(undefined, {
        transform: (value: Color | undefined) => value,
    });

    @Output() onMove = new EventEmitter<Move>();

    private formBuilder = inject(NonNullableFormBuilder);

    public form: GameSettings = this.formBuilder.group({
        bounds: this.formBuilder.group({
            width: [10, [Validators.required]],
            height: [10, [Validators.required]],
            cornerSize: [2, [Validators.required]],
        }),
        playerCount: [2, [Validators.required]],
    });

    constructor() {
        /**
         * The idea is to have a "smart" component that can correctly display possible moves and rotate board depending
         * on state, but at the same time there might be external sources pushing moves:
         * - The live-play page
         * - (Future) Spectator boards
         *
         * This technique here allows a stream of inputs, which then gets forwarded to the store
         */

        /**
         * Here the initial value, as a FEN string
         */
        effect(
            () => {
                if (this.initialHFEN()) {
                    this.store.createGameFromHFEN(this.initialHFEN() ?? '');
                }
            },
            { allowSignalWrites: true }
        );

        /**
         * And here the stream of input moves
         */
        effect(() => {
            if (this.inputSocket()) {
                this.inputSocket()?.subscribe({
                    next: (value) => this.store.onMove(value),
                });
            }
        });

        /**
         * Similarly, outside components might be interested in the moves that are happening, hence we forward it to
         * a component level output
         */
        effect(() => {
            if (this.store.lastCompletedMove()) {
                this.onMove.emit(this.store.lastCompletedMove());
            }
        });

        /**
         * Set owning color for this board, determines what pieces he may move.
         * // TODO maybe this comes per Move from the server in the future?
         */
        effect(
            () => {
                this.store.setOwnColor(this.ownColor());
                this.store.rotateBoard(0);
            },
            { allowSignalWrites: true }
        );
    }

    // TODO Should move out of this component with time!
    public createLocalGame() {
        const formValue = this.form.getRawValue();

        const players: Player[] = this.initPlayers(formValue.playerCount);

        this.store.createGame({
            bounds: formValue.bounds,
            players,
        });
    }

    private initPlayers(playerCount: number) {
        const players: Player[] = [];
        for (let i = 0; i < playerCount; i++) {
            players.push({
                id: 'player' + i,
                color: colorWheelInitialization[i],
                playDirection: directionOfInit[i],
                moveOrder: i,
            });
        }
        return players;
    }
}
