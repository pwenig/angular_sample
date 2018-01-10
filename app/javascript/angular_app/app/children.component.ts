import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'children-component',
  template: `
    <li class="{{parentType}}" id="{{parentType}}-{{parent.id}}" *ngIf="parentType != 'creative'">
      <span class="expand-children" id="{{parentType}}-expand-{{parent.id}}" (click)="expand(childType, children, parentType, parent)">+</span>
      <span class="collapse-children" id="{{parentType}}-collapse-{{parent.id}}" (click)="collapse(childType, children, 'campaign', parent)">-</span>
      <span class="parent-type">{{ parentType}}: </span>{{inputTag}}
    </li>

    <li class="{{parentType}}" id="{{parentType}}-{{parent.id}}" *ngIf="parentType == 'creative'">
      <span class="parent-type">{{ parentType}}: </span>{{inputTag}}
    </li>
  `,
})

export class ChildrenComponent implements OnInit {

@Input() parentType: any;
@Input() parent: any = {};
@Input() childType: any;
@Input() children: any = [];

inputTag: any;

ngOnInit() {
  this.inputTag = this.parent[this.parentType + '_input_tag'];
}

expand(type, children, parentType, parent) {
  var expand = document.getElementById(parentType + '-expand-' + parent.id);
  expand.style.visibility = 'hidden';

  var collapse = document.getElementById(parentType + '-collapse-' + parent.id);
  collapse.style.visibility = 'visible';

  for(let child of children) {
    var namestrings = document.getElementById(type + '-' + child.id);
    namestrings.style.display = 'block';
  }
  
}

// Work on collapsing -- each parent collapses children. Campaign resets them all

collapse(type, children, parentType, parent) {
  // This will collapse the child.
  // Rest them all
  if(type == 'package') {
    this.resetExpansion(children);

  }
  var expand = document.getElementById(parentType + '-expand-' + parent.id);
  expand.style.visibility = 'visible';

  var collapse = document.getElementById(parentType + '-collapse-' + parent.id);
  collapse.style.visibility = 'hidden';

  for( let child of children) {
    var namestrings = document.getElementById(type + '-' + child.id);
    namestrings.style.display = 'none';

  }
}
resetExpansion(children) {
  // This will collapse all children
  

}

}
