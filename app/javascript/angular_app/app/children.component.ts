import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit} from '@angular/core';

@Component({
  selector: 'children-component',
  template: `
      <li class="{{parentType}}"  id="{{parentType}}-{{parent.id}}" *ngIf="parentType != 'Creative'">
        <span class="expand-children" id="{{parentType}}-expand-{{parent.id}}" (click)="expand(childType, children, parentType, parent)" *ngIf="children && children.length > 0"><i class="glyphicon glyphicon-plus" style="font-size: 13px;"></i></span>
        <span class="collapse-children" id="{{parentType}}-collapse-{{parent.id}}" (click)="collapse(childType, children, parentType, parent)" *ngIf="children && children.length > 0"><i class="glyphicon glyphicon-minus" style="font-size: 13px;"></i></span>
        <span class="no-children" *ngIf="!children || children.length == 0"></span>
        <span [popover]="tooltip" triggers="mouseenter:mouseleave" (mouseenter)="getNames(parentType, parent, campaignParent, packageParent, null)">
          <span class="parent-type" (click)="namestringSelected(parent, parentType, childType, campaignParent, packageParent, placementParent, adParent)">{{ parentType}}: </span><span class="namestring" id="{{parentType}}-{{parent.id}}"
          (click)="namestringSelected(parent, parentType, childType, campaignParent, packageParent, placementParent, adParent)">
          {{inputTag}}
          </span>
        </span>
        <span class="clipboard" id="{{parentType}}-{{parent.id}}-clip" ngxClipboard [cbContent]="inputTag" tooltip="Copy to clipboard"><i class="glyphicon glyphicon-copy"></i></span>
      </li>
      <li class="{{parentType}}" id="{{parentType}}-{{parent.id}}" *ngIf="parentType == 'Creative'">
        <span [popover]="tooltip" triggers="mouseenter:mouseleave" (mouseenter)="getNames(parentType, parent, campaignParent, null, adParent)">
          <span class="parent-type" (click)="namestringSelected(parent, parentType, null, campaignParent, packageParent, placementParent, adParent)">{{ parentType}}: </span><span class="namestring" id="{{parentType}}-{{parent.id}}" (click)="namestringSelected(parent, parentType, null, campaignParent, packageParent, placementParent, adParent)">{{inputTag}}</span>
        </span>
        <span class="clipboard" id="{{parentType}}-{{parent.id}}-clip" ngxClipboard [cbContent]="inputTag" tooltip="Copy to clipboard"><i class="glyphicon glyphicon-copy"></i></span>
      </li>
  `,
})

export class ChildrenComponent implements OnInit, AfterViewInit {

  @Input() parentType: any;
  @Input() parent: any = {};
  @Input() childType: any;
  @Input() children: any = [];
  @Input() currentCreated: any = {};
  @Input() campaignParent: any = {};
  @Input() packageParent: any = {};
  @Input() placementParent: any = {};
  @Input() adParent: any = {};
  @Input() action: any;
  @Input() clearSelected: boolean;
  @Output() selectedNamestring = new EventEmitter();

  inputTag: string;
  tooltip: string;

  ngOnInit() {
    this.inputTag = this.parent[this.parentType.toLowerCase() + '_input_tag'];
  }

  // Checks to make sure all of the data is rendered and then calls the function if currentCreated exists.
  ngAfterViewInit() {
    if(Object.keys(this.currentCreated).length != 0 && this.clearSelected == true) {
      setTimeout(() => {
          if(this.action == 'Edit' || this.currentCreated.parentType == 'Campaign') {
            if(localStorage.getItem('selected') != this.currentCreated.parentType + '-' + this.currentCreated.namestring.id ) {
              this.namestringSelected(this.currentCreated.namestring, this.currentCreated.parentType, this.currentCreated.childType, this.campaignParent, this.packageParent, this.placementParent, this.adParent);
            } else {
              this.namestringUpdated(this.currentCreated.namestring, this.currentCreated.parentType, this.currentCreated.childType, this.campaignParent, this.packageParent, this.placementParent, this.adParent);
            }
          } else if ( this.currentCreated.parentType + '-' + this.currentCreated.namestring.id != localStorage.getItem('selected') ){
            this.namestringSelected(this.currentCreated.namestring, this.currentCreated.parentType, this.currentCreated.childType, this.campaignParent, this.packageParent, this.placementParent, this.adParent);
          } else {}
          if(this.clearSelected) {
            this.expandTree(this.currentCreated.parentType);
          }
      });
    }

  }

  expandTree(parentType) {
    if(parentType == 'Package') {
      this.expand('Package', [this.currentCreated.namestring], 'Campaign', this.campaignParent);
    }
    if(parentType == 'Placement') {
      this.expand('Placement', [this.currentCreated.namestring], 'Package', this.packageParent);
    }
    if(parentType == 'Ad') {
      this.expand('Ad', [this.currentCreated.namestring], 'Placement', this.placementParent);
    }
    if(parentType == 'Creative') {
      this.expand('Creative', [this.currentCreated.namestring], 'Ad', this.adParent);
    }
  }

  getNames(type, namestring, campaignParent, packageParent, adParent) {
    let spacer = '_';
    let campaignNames = campaignParent.network.name + spacer + campaignParent.program.name + spacer + campaignParent.season.name + spacer;
    if(type == 'Campaign') {
      this.tooltip = campaignNames + namestring.campaign_type.name;
    }
    if(type == 'Package') {
      this.tooltip = campaignNames +
                     namestring.agency.name + spacer + 
                     namestring.publisher.name + spacer + 
                     namestring.buy_method.name + spacer + 
                     namestring.inventory_type.name;
    }
    if(type == 'Placement') {
      this.tooltip = campaignNames + 
                     packageParent.agency.name + spacer + 
                     namestring.tactic.name + spacer + 
                     namestring.device.name + spacer +
                     packageParent.publisher.name + spacer +
                     packageParent.buy_method.name + spacer +
                     namestring.ad_type.name + spacer +
                     packageParent.inventory_type.name
    }
    if(type == 'Ad') {
      this.tooltip = campaignNames +
                     namestring.creative_group.name + spacer +
                     packageParent.publisher.name;
    }
    if(type == 'Creative') {
      this.tooltip = campaignNames +
                     adParent.creative_group.name + spacer +
                     namestring.creative_message.name + spacer +
                     namestring.abtest_label.name;
    }
  }

  namestringUpdated(namestring, parentType, childType, campaignParent, packageParent, placementParent, adParent) {
    localStorage.setItem('selected', parentType + '-' + namestring.id);
    localStorage.setItem('clip', parentType + '-' + namestring.id + '-clip' )
    var newElement = document.getElementById(parentType + '-' + namestring.id);
    if(newElement) {
      newElement.style.fontWeight = 'bold';
      newElement.style.backgroundColor = 'lightblue';
    }

    var clip = document.getElementById(parentType + '-' + namestring.id + '-clip');
    if(clip) {
      clip.style.visibility = 'visible';
    }

    var nameStringObject = {
      namestring: namestring,
      parent: parentType,
      child: childType,
      campaignParent: campaignParent,
      packageParent: packageParent,
      placementParent: placementParent,
      adParent: adParent
    }
    this.selectedNamestring.emit(nameStringObject);
  }

  namestringSelected(namestring, parentType, childType, campaignParent, packageParent, placementParent, adParent) {
    if(parentType + '-' + namestring.id == localStorage.getItem('selected')) {
      var oldClip = document.getElementById(localStorage.getItem('clip'));
      var oldElement = document.getElementById(localStorage.getItem('selected'));
      if(oldElement) {
        oldElement.style.fontWeight = 'normal';
        oldElement.style.backgroundColor = 'white';
        localStorage.removeItem('selected');
        this.selectedNamestring.emit(null);
      }
      if(oldClip) {
        oldClip.style.visibility = 'hidden';
      }
      
    } else {
        // Change old one that was selected from bold to normal
        if(localStorage.getItem('selected')) {

          var oldClip = document.getElementById(localStorage.getItem('clip'));
          var oldElement = document.getElementById(localStorage.getItem('selected'));
          if(oldElement) {
            oldElement.style.fontWeight = 'normal';
            oldElement.style.backgroundColor = 'white';
          }
          if(oldClip) {
            oldClip.style.visibility = 'hidden'
          }
         
        } 
        // Change current one that was selected from normal to bold
        localStorage.setItem('clip', parentType + '-' + namestring.id + '-clip' )
        localStorage.setItem('selected', parentType + '-' + namestring.id);
        var clip = document.getElementById(parentType + '-' + namestring.id + '-clip');
        if(clip) {
          clip.style.visibility = 'visible';
        }
        var newElement = document.getElementById(parentType + '-' + namestring.id);
        newElement.style.fontWeight = 'bold';
        newElement.style.backgroundColor = 'lightblue';
        var nameStringObject = {
          namestring: namestring,
          parent: parentType,
          child: childType,
          campaignParent: campaignParent,
          packageParent: packageParent,
          placementParent: placementParent,
          adParent: adParent
        }
        this.selectedNamestring.emit(nameStringObject);
      }
  }

  expand(childType, children, parentType, parent) {
    // The problem is in here. Why is it going into this twice?

    var expand = document.getElementById(parentType + '-expand-' + parent.id);
    if(expand) {
      expand.style.display = 'none';
    }

    var collapse = document.getElementById(parentType + '-collapse-' + parent.id);
    if(collapse) {
      collapse.style.display = 'inline';
    }

    if(children.length > 0) {
      for(let child of children) {
        var namestrings = document.getElementById(childType + '-' + child.id);
        if(namestrings) {
          namestrings.style.display = 'block';
        }
      }
    }
    
  }

  collapse(childType, children, parentType, parent) {
    if(parentType == 'Ad') {
      this.changeCollapse(parentType, parent, childType, children);
    }
    if(parentType == 'Placement') {
      this.changeCollapse(parentType, parent, childType, children);
      for(let child of children ) {
        if(child.creative_inputs && child.creative_inputs.length > 0) {
          this.changeCollapse('Ad', child, 'Creative', child.creative_inputs);
        }
      }
    }
    if(parentType == 'Package') {
      // Change package and placement
      this.changeCollapse(parentType, parent, childType, children);
      for(let child of children) {
        if(child.ad_inputs && child.ad_inputs.length > 0) {
          // Change ad
          this.changeCollapse('Placement', child, 'Ad', child.ad_inputs);
          // Change creative
          for(let adChild of child.ad_inputs) {
            this.changeCollapse('Ad', adChild, 'Creative', adChild.creative_inputs);
          }
        }
      }
    }
    if(parentType == 'Campaign') {
      // Change campaign and  package
      this.changeCollapse(parentType, parent, childType, children);
      for(let child of children) {
        if(child.placement_inputs && child.placement_inputs.length > 0) {
          // Change placement
          this.changeCollapse('Package', child, 'Placement', child.placement_inputs);
          // Change ad
          for(let placementChild of child.placement_inputs) {
            this.changeCollapse('Placement', placementChild, 'Ad', placementChild.ad_inputs);
            // Change creative
            for(let adChild of placementChild.ad_inputs) {
              if(adChild.creative_inputs && adChild.creative_inputs.length > 0) {
                this.changeCollapse('Ad', adChild, 'Creative', adChild.creative_inputs);
              } else {
                this.changeCollapse('Ad', adChild, 'Creative', []);
              }
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
        namestrings.style.backgroundColor = 'white';
        namestrings.style.fontWeight = 'normal';
      }
    }
  }

}
