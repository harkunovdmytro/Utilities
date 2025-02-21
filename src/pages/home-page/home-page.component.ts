import { Component }  from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink
  ],
  templateUrl: 'home-page.component.html',
  styleUrl: 'home-page.component.scss'
})
export class HomePageComponent {
  public readonly routes = [
    { path: [ '/json-difference' ], title: 'JSON Difference', disabled: true },
    { path: [ '/scss-sorting' ], title: 'SCSS Sorting', disabled: true },
  ]
}
