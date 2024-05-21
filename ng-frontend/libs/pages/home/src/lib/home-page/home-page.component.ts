import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
    FormControl,
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { HomePageStore } from '../store/home-page.store';
import { GameType } from '../store/game-type';

type GameSetupFormType = FormGroup<{
    gameType: FormControl<GameType>;
    playerCount: FormControl<number>;
}>;

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
    providers: [HomePageStore],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    private readonly store = inject(HomePageStore);
    private readonly formBuilder = inject(NonNullableFormBuilder);

    public gameTypes = Object.values(GameType);
    form: GameSetupFormType = this.formBuilder.group({
        gameType: [GameType.TWO_PIECES],
        playerCount: [1, [Validators.required]],
    });

    public createGame(): void {
        const value = this.form.getRawValue();

        // Create a new game
        this.store.createGame(value);
    }
}
