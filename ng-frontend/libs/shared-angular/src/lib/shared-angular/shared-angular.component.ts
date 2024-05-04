import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-angular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-angular.component.html',
  styleUrl: './shared-angular.component.css',
})
export class SharedAngularComponent {}
