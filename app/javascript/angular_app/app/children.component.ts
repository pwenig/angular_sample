import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'children-component',
  template: `
    <li class="{{parentType}}" id="{{parentType}}-{{parent.id}}" *ngIf="parentType != 'creative'">
      <span class="expand-children" id="{{parentType}}-expand-{{parent.id}}" (click)="expand(childType, children, parentType, parent)" *ngIf="children.length > 0">+</span>
      <span class="collapse-children" id="{{parentType}}-collapse-{{parent.id}}" (click)="collapse(childType, children, parentType, parent)" *ngIf="children.length > 0">-</span>
      <span class="no-children" *ngIf="children.length == 0"></span>
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
