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
import {BoardIndexComponent} from "../board-index/board-index.component";
import { GameSetupFormComponent } from "../game-setup-form/game-setup-form.component";
import {RotateGameBoardComponent} from "../rotate-game-board/rotate-game-board.component";

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
    imports: [CommonModule, NodeComponent, ReactiveFormsModule, FormsModule, BoardIndexComponent],
    imports: [
        CommonModule,
        NodeComponent,
        ReactiveFormsModule,
        FormsModule,
        GameSetupFormComponent,
        RotateGameBoardComponent,
    ],
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

    horizontalIndexNodes: string[] = [];
    verticalIndexNodes: number[] = [];
    boardCenterContainerGridTemplateColumns: string = '';
    boardHorizontalContainerGridTemplateColumns: string = '';
    middleContainerGridTemplateColumnsWidths: string = '';

    public gameSetupForm = FormGroup<{
        bounds: FormGroup<{
            width: FormControl<number>,
            height: FormControl<number>,
            cornerSize: FormControl<number>,
        }>,
        playerCount: FormControl<number>,
    }>;

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

        this.createGameBoard();
    }

    public stopLocalGame(){
        const players: Player[] = [];
        const emptyGame = {
            "bounds": {
                "width": 0,
                "height": 0,
                "cornerSize": 0,
            }
        };
        this.store.createGame({
            bounds: emptyGame.bounds,
            players,
        });

        this.store.stopGame();
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

    private createGameBoard(): void {
        const formValue = this.form.getRawValue();
        const horizontalIndex: string[] = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
        ];
        //const cols = formValue.bounds.width;
        //const rows = formValue.bounds.height; // TODO: set vertical heights
        const countNodes: number = formValue.bounds.width * formValue.bounds.height;
        const countHorizontalIndex = formValue.bounds.width + 2;
        const countVerticalIndex = formValue.bounds.height;
        const indexWidth: number = 5; // 0: width of the gameboardnode, else board width in %
        const hasIndexWidth: boolean = indexWidth === 0;
        const indexWidthPercentage: number = hasIndexWidth ? 100 / countHorizontalIndex : indexWidth;
        this.middleContainerGridTemplateColumnsWidths =
            indexWidthPercentage + '%' + ' auto ' + indexWidthPercentage + '%';
        this.boardHorizontalContainerGridTemplateColumns = hasIndexWidth ? '' : indexWidthPercentage + '% ';
        this.boardCenterContainerGridTemplateColumns = '';

        for (let i = 0; i < countNodes; i++) {
            if (i < countHorizontalIndex) {
                if (i > 0 && i < countHorizontalIndex - 1) {
                    this.horizontalIndexNodes[i] = horizontalIndex[i - 1];
                    this.boardCenterContainerGridTemplateColumns += 'auto ';
                    if (!hasIndexWidth) {
                        this.boardHorizontalContainerGridTemplateColumns += 'auto ';
                    }
                } else {
                    this.horizontalIndexNodes[i] = '';
                }
                if (hasIndexWidth) {
                    this.boardHorizontalContainerGridTemplateColumns += 'auto ';
                }
            }
        }
        if (!hasIndexWidth) {
            this.boardHorizontalContainerGridTemplateColumns += indexWidthPercentage + '%';
        }
        for (let i = 0; i < countVerticalIndex; i++) {
            this.verticalIndexNodes[i] = i + 1;
        }
        //console.log(this.store.currentMove());
        //console.log(countVerticalIndex);
        //console.log(formValue.bounds.height);
        //console.log(this.verticalIndexNodes);
    }
}
