import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'search',
  template: `
   <section class="input-tag" *ngIf="createNew">
        <input [ngModel]="selected" (ngModelChange)="tagSelected($event)"
        [typeahead]="inputTags"
        class="form-control" placeholder="{{searchDesc}}">
        <button class="new-tag" *ngIf="!selected"  type="submit" (click)="newInput()">New</button>
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

  newInput() {
    this.newTag.emit();
    this.createNew = false;
  }

  tagSelected(inputTag) {
    // Check to make sure the event is not fired twice.
    if(inputTag.length > 30 && this.selected != inputTag) {
      this.selected = inputTag
      this.tagChosen.emit(this.selected)
    }
    
  }

}
