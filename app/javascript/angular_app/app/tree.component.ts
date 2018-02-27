import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'tree',
  template: `
    <div class="tree-container flexbox-item-grow flexbox-parent">
    <div class="search">
      <input type="text" [(ngModel)]="queryString" id="search" placeholder="Search Network/Program Name/Abbrev">
     </div>
        <section class="tree flexbox-item-grow">
        <div *ngIf="loading"style="float:left; font-size: 18px;">
          Loading Namestrings...  <span><i class="fa fa-spinner fa-spin" ></i> </span>
        </div>
          <div *ngIf="!loading && all_inputs && all_inputs.length > 0">
            <ul *ngFor="let input of all_inputs | FilterPipe: queryString">
              <children-component [campaignParent]="input" [currentCreated]="current_created_input" [parentType]="'Campaign'" [childType]="'Package'" [children]=input.package_inputs [parent]=input (selectedNamestring)="selectedString($event)"></children-component>

              <span *ngIf="input.package_inputs && input.package_inputs.length > 0">
                <span *ngFor="let package_input of input.package_inputs">
                  <children-component [action]="action" [campaignParent]="input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Package'" [childType]="'Placement'" [children]=package_input.placement_inputs [parent]=package_input (selectedNamestring)="selectedString($event)"></children-component>

                  <span *ngIf="package_input.placement_inputs && package_input.placement_inputs.length > 0">
                    <span *ngFor="let placement_input of package_input.placement_inputs">
                      <children-component [action]="action" [campaignParent]="input" [packageParent]="package_input" [placementParent]="placement_input" [currentCreated]="current_created_input" [parentType]="'Placement'" [childType]="'Ad'" [children]=placement_input.ad_inputs [parent]=placement_input (selectedNamestring)="selectedString($event)"></children-component>

                      <span *ngIf="placement_input.ad_inputs && placement_input.ad_inputs.length > 0">
                        <span *ngFor="let ad_input of placement_input.ad_inputs">
                           <children-component [action]="action" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Ad'" [childType]="'Creative'" [children]=ad_input.creative_inputs [parent]=ad_input (selectedNamestring)="selectedString($event)"></children-component>

                           <span *ngIf="ad_input.creative_inputs && ad_input.creative_inputs.length > 0">
                            <span *ngFor="let creative_input of ad_input.creative_inputs">
                             <children-component [action]="action" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Creative'" [childType]=null [parent]=creative_input (selectedNamestring)="selectedString($event)"></children-component>

                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </ul>
          </div>


        </section>
    </div>
  `
})

export class TreeComponent implements OnInit {
  @Input() current_created_input: any = {};
  @Input() all_inputs: any[];
  @Input() action: any;
  @Input() loading: boolean;
  @Output() selectedNamestring = new EventEmitter();

  parentType: any;
  childType: any;
  parent: any = {};
  children: any = [];

  ngOnInit() {
    console.log('LOADING', this.loading);
  }

  selectedString(nameStringObject) {
    // Send the selected namestring to app-component
    this.selectedNamestring.emit(nameStringObject);
  };

}
