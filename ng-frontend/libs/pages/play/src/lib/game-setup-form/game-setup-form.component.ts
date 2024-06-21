import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Player } from '../../../../../shared-angular/game-board/src/lib/state/models/player';
import { colorWheelInitialization } from '../../../../../shared-angular/game-board/src/lib/state/models/color';
import { directionOfInit } from '../../../../../shared-angular/game-board/src/lib/state/models/play-direction';
import { HFENFromGameConfig } from '../../../../../shared-angular/game-board/src/lib/state/halma-fen';
import { GameDisplayConfig } from '../../../../../shared-angular/game-board/src/lib/state/models/game-display-config';

type GameSettingsFormType = FormGroup<{
    bounds: FormGroup<{
        width: FormControl<number>;
        height: FormControl<number>;
        cornerSize: FormControl<number>;
    }>;
    playerCount: FormControl<number>;
}>;

@Component({
    selector: 'app-game-setup-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './game-setup-form.component.html',
    styleUrl: './game-setup-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [],
})
export class GameSetupFormComponent {
    private formBuilder = inject(NonNullableFormBuilder);
    @Output() hfen: EventEmitter<string> = new EventEmitter<string>();
    @Output() gameDisplayConfig: EventEmitter<GameDisplayConfig> = new EventEmitter<GameDisplayConfig>();
    initialHFEN: string = '';

    public form: GameSettingsFormType = this.formBuilder.group({
        bounds: this.formBuilder.group({
            width: [10, [Validators.required]],
            height: [10, [Validators.required]],
            cornerSize: [2, [Validators.required]],
        }),
        playerCount: [2, [Validators.required]],
    });

    public gameDisplayConfigForm = this.formBuilder.group({
        boardRotateNext: [true],
        displayBoardIndex: this.formBuilder.group({
            displayBoardIndex: ['inside', Validators.required],
        }),
        boardIndexRegion: this.formBuilder.group({
            boardIndexRegion: ['rightbottom', Validators.required],
        }),
    });

    public createLocalGame() {
        const formValue = this.form.getRawValue();
        const players: Player[] = this.initPlayers(formValue.playerCount);
        this.initialHFEN = HFENFromGameConfig({
            bounds: formValue.bounds,
            players,
        });
        this.hfen.emit(this.initialHFEN);
        this.onChangeGameDisplayForm();
    }

    public onChangeGameDisplayForm() {
        const gameDisplayFormValue = this.gameDisplayConfigForm.getRawValue();
        this.gameDisplayConfig.emit({
            boardRotateNext: gameDisplayFormValue.boardRotateNext,
            displayBoardIndex: gameDisplayFormValue.displayBoardIndex.displayBoardIndex,
            boardIndexRegion: gameDisplayFormValue.boardIndexRegion.boardIndexRegion,
        });
    }

    public stopLocalGame() {
        this.initialHFEN = '';
        this.hfen.emit(this.initialHFEN);
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
