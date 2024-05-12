import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
    // TODO move this to the global settings & translation service
    constructor(private translateService: TranslateService) {
        this.translateService.use('en');
    }
}
