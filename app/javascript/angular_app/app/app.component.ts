import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'angular-app',
  template: `<h1>Project: {{name}}</h1>`
})
export class AppComponent implements OnInit {
  
  name: string;

  constructor() {}

  ngOnInit() {

    this.name = 'Viacom Tagging Project';

  };
}
