import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardStore } from '../state/game-board.store';
import { NodeComponent } from '../node/node.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Color } from '../state/models/color';
import { Observable } from 'rxjs';
import { Move } from '@ng-frontend/generated-api-client';
import { Router } from '@angular/router';
import { BoardIndexComponent } from '../board-index/board-index.component';
import { RotateGameBoardComponent } from '../../../../../pages/play/src/lib/rotate-game-board/rotate-game-board.component';
import { GameSetupFormComponent } from '../../../../../pages/play/src/lib/game-setup-form/game-setup-form.component';
import { DisplayBoardIndex, GameDisplayConfig } from '../state';

@Component({
    selector: 'app-game-board',
    standalone: true,
    imports: [
        CommonModule,
        NodeComponent,
        ReactiveFormsModule,
        GameSetupFormComponent,
        FormsModule,
        BoardIndexComponent,
        RotateGameBoardComponent,
    ],
    providers: [GameBoardStore],
    templateUrl: './game-board.component.html',
    styleUrl: './game-board.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
    protected readonly DisplayBoardIndex = DisplayBoardIndex;
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

    public gameDisplayConfig = input.required({
        transform: (value: GameDisplayConfig) => value,
    });

    @Output() onMove = new EventEmitter<Move>();

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
            },
            { allowSignalWrites: true }
        );

        effect(
            () => {
                const gameDisplayConfig = this.gameDisplayConfig();
                this.store.setGameDisplayConfig(gameDisplayConfig);
            },
            { allowSignalWrites: true }
        );
    }

    setGameBoardRotationAngle(deg: number) {
        this.store.setGameBoardRotationAngle(deg);
    }
}
