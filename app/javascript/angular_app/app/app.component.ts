import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'angular-app',
  template: `
    <h1>Project: {{name}}</h1>
    <timepicker [(ngModel)]="time"></timepicker>
    <pre>Selected time: {{time | json}}</pre>
  `
})

export class AppComponent implements OnInit {

  name: string;
  time: Date = new Date();
  constructor() {
  }

  ngOnInit() {
    this.name = 'Viacom Tagging Project';
  };
}
