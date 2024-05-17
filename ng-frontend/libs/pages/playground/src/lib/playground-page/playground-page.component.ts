import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-playground-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink],
    templateUrl: './playground-page.component.html',
    styleUrl: './playground-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundPageComponent {
    readonly translateService = inject(TranslateService);

    public getTranslatedValueHelloWorld(): string {
        return this.translateService.instant('hello-world');
    }
}
