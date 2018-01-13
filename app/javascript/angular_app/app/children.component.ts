import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'children-component',
  template: `
    <li class="{{parentType}}" id="{{parentType}}-{{parent.id}}" *ngIf="parentType != 'creative'">
      <span class="expand-children" id="{{parentType}}-expand-{{parent.id}}" (click)="expand(childType, children, parentType, parent)" *ngIf="children.length > 0">+</span>
      <span class="collapse-children" id="{{parentType}}-collapse-{{parent.id}}" (click)="collapse(childType, children, parentType, parent)" *ngIf="children.length > 0">-</span>
      <span class="no-children" *ngIf="children.length == 0"></span>
      <span class="parent-type">{{ parentType}}: </span><span class="namestring" id="{{parentType}}-{{parent.id}}" (click)="namestringSelected(parent, parentType, childType)">{{inputTag}}</span>
    </li>
    <li class="{{parentType}}" id="{{parentType}}-{{parent.id}}" *ngIf="parentType == 'creative'">
      <span class="parent-type">{{ parentType}}: </span><span class="namestring" id="{{parentType}}-{{parent.id}}" (click)="namestringSelected(parent, parentType, null)">{{inputTag}}</span>
    </li>
  `,
})

export class ChildrenComponent implements OnInit {

  @Input() parentType: any;
  @Input() parent: any = {};
  @Input() childType: any;
  @Input() children: any = [];
  @Output() selectedNamestring = new EventEmitter();

  inputTag: string;

  ngOnInit() {
    this.inputTag = this.parent[this.parentType + '_input_tag'];
    localStorage.removeItem('selected');
  }

  namestringSelected(namestring, parentType, childType) {
    // Change old one that was selected from bold to normal
    if(localStorage.getItem('selected')) {
      var oldElement = document.getElementById(localStorage.getItem('selected'));
      oldElement.style.fontWeight = 'normal';
    } 
      // Change current one that was selected from normal to bold
      localStorage.setItem('selected', parentType + '-' + namestring.id);
      var newElement = document.getElementById(parentType + '-' + namestring.id);
      newElement.style.fontWeight = 'bold';
      // Send the selected object back to the tree-component
      // Capitalize the childType so it looks nice for the button.
      if(childType) {
        var formattedChild = childType.charAt(0).toUpperCase() + childType.slice(1);
      }
      var nameStringObject = {
        nameString: namestring,
        parent: parentType,
        child: formattedChild
      }
      this.selectedNamestring.emit(nameStringObject);
  }

  expand(childType, children, parentType, parent) {
    var expand = document.getElementById(parentType + '-expand-' + parent.id);
    expand.style.display = 'none';

    var collapse = document.getElementById(parentType + '-collapse-' + parent.id);
    collapse.style.display = 'inline';

    for(let child of children) {
      var namestrings = document.getElementById(childType + '-' + child.id);
      namestrings.style.display = 'block';
    }
    
  }

  collapse(childType, children, parentType, parent) {
    if(parentType == 'ad') {
      this.changeCollapse(parentType, parent, childType, children);
    }
    if(parentType == 'placement') {
      this.changeCollapse(parentType, parent, childType, children);
      for(let child of children ) {
        if(child.creative_inputs.length > 0) {
          this.changeCollapse('ad', child, 'creative', child.creative_inputs);
        }
      }
    }
    if(parentType == 'package') {
      // Change package and placement
      this.changeCollapse(parentType, parent, childType, children);
      for(let child of children) {
        if(child.ad_inputs.length > 0) {
          // Change ad
          this.changeCollapse('placement', child, 'ad', child.ad_inputs);
          // Change creative
          for(let adChild of child.ad_inputs) {
            this.changeCollapse('ad', adChild, 'creative', adChild.creative_inputs);
          }
        }
      }
    }
    if(parentType == 'campaign') {
      // Change campaign and  package
      this.changeCollapse(parentType, parent, childType, children);
      for(let child of children) {
        if(child.placement_inputs.length > 0) {
          // Change placement
          this.changeCollapse('package', child, 'placement', child.placement_inputs);
          // Change ad
          for(let placementChild of child.placement_inputs) {
            this.changeCollapse('placement', placementChild, 'ad', placementChild.ad_inputs);
            // Change creative
            for(let adChild of placementChild.ad_inputs) {
              this.changeCollapse('ad', adChild, 'creative', adChild.creative_inputs);
            }
          }
        }
      }
    }
  }

  changeCollapse(parentType, parent, childType, children) {
    var expand = document.getElementById(parentType + '-expand-' + parent.id);
    if(expand) {
      expand.style.display = 'inline';
    }

    var collapse = document.getElementById(parentType + '-collapse-' + parent.id);
    if(collapse) {
      collapse.style.display = 'none';
    }

    for( let child of children) {
      var namestrings = document.getElementById(childType + '-' + child.id);
      if(namestrings) {
        namestrings.style.display = 'none';
      }
    }
  }

}
