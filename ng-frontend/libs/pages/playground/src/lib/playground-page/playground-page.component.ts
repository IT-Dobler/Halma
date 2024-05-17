import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LiveGameService } from '../live-game.service';
import { Observable } from 'rxjs';
import { GameBoardComponent } from '@ng-frontend/shared-angular/game-board';
import { Move } from '@ng-frontend/generated-api-client';

@Component({
    selector: 'app-playground-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, ReactiveFormsModule, GameBoardComponent],
    templateUrl: './playground-page.component.html',
    styleUrl: './playground-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundPageComponent {
    readonly translateService = inject(TranslateService);
    readonly liveGameService = inject(LiveGameService);
    private formBuilder = inject(NonNullableFormBuilder);

    public form: FormGroup<{ message: FormControl<string> }> = this.formBuilder.group({
        message: [''],
    });

    public moves: Move[] = [];

    public foo$: Observable<Move> | undefined;

    public getTranslatedValueHelloWorld(): string {
        return this.translateService.instant('hello-world');
    }

    public connect() {
        this.liveGameService.joinGame('xyz');
        this.foo$ = this.liveGameService.moves$();
    }

    public disconnect() {
        this.liveGameService.leaveGame();
    }

    public onMove($event: Move) {
        if (this.liveGameService) {
            this.liveGameService.sendMove($event);
            this.moves.push($event);
        }
    }
}
