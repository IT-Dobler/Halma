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
    styleUrl: './game-board.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
    readonly store = inject(GameBoardStore);

    private formBuilder = inject(NonNullableFormBuilder);

    horizontalIndexNodes: string[] = [];
    verticalIndexNodes: number[] = [];
	boardCenterContainerGridTemplateColumns: string = '';
	boardHorizontalContainerGridTemplateColumns: string = '';
    middleContainerGridTemplateColumnsWidths: string = '';

    public form: GameSettings = this.formBuilder.group({
        bounds: this.formBuilder.group({
            width: [10, [Validators.required]],
            height: [10, [Validators.required]],
            cornerSize: [2, [Validators.required]],
        }),
        playerCount: [2, [Validators.required]],
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

        this.createGameBoard();
    }

    private createGameBoard(): void {

        const formValue = this.form.getRawValue();
        const horizontalIndex: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        //const cols = formValue.bounds.width;
        //const rows = formValue.bounds.height; // TODO: set vertical heights
		const countNodes = formValue.bounds.width*formValue.bounds.height;
		const countHorizontalIndex = formValue.bounds.width+2;
		this.middleContainerGridTemplateColumnsWidths = (100/countHorizontalIndex)+'%'+' auto ' + (100/countHorizontalIndex)+'%';

        this.boardCenterContainerGridTemplateColumns = '';
        this.boardHorizontalContainerGridTemplateColumns = '';

		for(let i = 0; i < countNodes; i++){
			if(i < countHorizontalIndex){
				if(i>0 && i<countHorizontalIndex-1){
                    this.horizontalIndexNodes[i] = horizontalIndex[i-1];
					this.boardCenterContainerGridTemplateColumns += 'auto ';
				}else{
                    this.horizontalIndexNodes[i] = '';
				}
				this.boardHorizontalContainerGridTemplateColumns += 'auto ';
			}
		}
        for(let i = 0; i < formValue.bounds.height; i++){
            this.verticalIndexNodes[i] = (i+1);
        }
        console.log(this.store.currentMove());
        //console.log(this.verticalIndexNodes);
    }

}
