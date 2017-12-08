import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'search',
  template: `
   <section class="input-tag" *ngIf="createNew && inputTags">
        <input [ngModel]="selected" (ngModelChange)="tagSelected($event)"
        [typeahead]="inputTags"
        class="form-control" placeholder="{{searchDesc}}">
        <button class="new-tag" type="submit" (click)="newInput()">New Campaign String</button>
      </section>
  `
})

export class SearchComponent {
  @Input() inputTags: any;
  @Input() searchDesc: any;
  @Output() newTag= new EventEmitter();
  @Output() tagChosen = new EventEmitter();

  private selected: any;
  private createNew: boolean = true;
  inputTag: any;

  newInput() {
    this.newTag.emit();
    this.createNew = false;
  }

  tagSelected(inputTag) {
    if(inputTag.length > 20 && this.inputTag != inputTag) {
      this.inputTag = inputTag;
      this.tagChosen.emit(inputTag);
    }
    
  }

}
