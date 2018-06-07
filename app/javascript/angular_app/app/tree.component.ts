import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {SearchService} from '../services/search_service';

@Component({
  selector: 'tree',
  template: `
    <div class="tree-container flexbox-item-grow flexbox-parent">
    <div class="search">
      <input type="text" [(ngModel)]="queryString" id="search" (input)="searchChange(queryString)" placeholder="Search">
     </div>
        <section class="tree flexbox-item-grow">
        <div *ngIf="loading"style="float:left; font-size: 18px;">
          Loading Namestrings...  <span><i class="fa fa-spinner fa-spin" ></i> </span>
        </div>

          <div *ngIf="!loading && all_inputs && all_inputs.length > 0 && filtered_inputs.length == 0 && !noInputs">
            <ul *ngFor="let input of all_inputs">
              <children-component [campaignParent]="input" [clearSelected]="clearSelected" [currentCreated]="current_created_input" [parentType]="'Campaign'" [childType]="'Package'" [children]=input.package_inputs [parent]=input (selectedNamestring)="selectedString($event)"></children-component>

              <span *ngIf="input.package_inputs && input.package_inputs.length > 0">
                <span *ngFor="let package_input of input.package_inputs">
                  <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Package'" [childType]="'Placement'" [children]=package_input.placement_inputs [parent]=package_input (selectedNamestring)="selectedString($event)"></children-component>

                  <span *ngIf="package_input.placement_inputs && package_input.placement_inputs.length > 0">
                    <span *ngFor="let placement_input of package_input.placement_inputs">
                      <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [placementParent]="placement_input" [currentCreated]="current_created_input" [parentType]="'Placement'" [childType]="'Ad'" [children]=placement_input.ad_inputs [parent]=placement_input (selectedNamestring)="selectedString($event)"></children-component>

                      <span *ngIf="placement_input.ad_inputs && placement_input.ad_inputs.length > 0">
                        <span *ngFor="let ad_input of placement_input.ad_inputs">
                           <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Ad'" [childType]="'Creative'" [children]=ad_input.creative_inputs [parent]=ad_input (selectedNamestring)="selectedString($event)"></children-component>

                           <span *ngIf="ad_input.creative_inputs && ad_input.creative_inputs.length > 0">
                            <span *ngFor="let creative_input of ad_input.creative_inputs">
                             <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Creative'" [childType]=null [parent]=creative_input (selectedNamestring)="selectedString($event)"></children-component>

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

          <div *ngIf="filtered_inputs.length >= 0">
            <ul *ngFor="let input of filtered_inputs">
              <children-component [campaignParent]="input" [clearSelected]="clearSelected" [currentCreated]="current_created_input" [parentType]="'Campaign'" [childType]="'Package'" [children]=input.package_inputs [parent]=input (selectedNamestring)="selectedString($event)"></children-component>

              <span *ngIf="input.filtered_package_inputs && input.filtered_package_inputs.length > 0">
                <span *ngFor="let package_input of input.filtered_package_inputs">
                  <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Package'" [childType]="'Placement'" [children]=package_input.placement_inputs [parent]=package_input (selectedNamestring)="selectedString($event)"></children-component>

                  <span *ngIf="package_input.filtered_placement_inputs && package_input.filtered_placement_inputs.length > 0">
                    <span *ngFor="let placement_input of package_input.filtered_placement_inputs">
                      <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [placementParent]="placement_input" [currentCreated]="current_created_input" [parentType]="'Placement'" [childType]="'Ad'" [children]=placement_input.ad_inputs [parent]=placement_input (selectedNamestring)="selectedString($event)"></children-component>

                      <span *ngIf="placement_input.filtered_ad_inputs && placement_input.filtered_ad_inputs.length > 0">
                        <span *ngFor="let ad_input of placement_input.filtered_ad_inputs">
                           <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Ad'" [childType]="'Creative'" [children]=ad_input.creative_inputs [parent]=ad_input (selectedNamestring)="selectedString($event)"></children-component>

                           <span *ngIf="ad_input.filtered_creative_inputs && ad_input.filtered_creative_inputs.length > 0">
                            <span *ngFor="let creative_input of ad_input.filtered_creative_inputs">
                             <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Creative'" [childType]=null [parent]=creative_input (selectedNamestring)="selectedString($event)"></children-component>

                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>

              <span *ngIf="input.package_inputs.length > 0 && input.filtered_package_inputs.length == 0">
                <span *ngFor="let package_input of input.package_inputs">
                  <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Package'" [childType]="'Placement'" [children]=package_input.placement_inputs [parent]=package_input (selectedNamestring)="selectedString($event)"></children-component>

                  <span *ngIf="package_input.placement_inputs && package_input.placement_inputs.length > 0">
                    <span *ngFor="let placement_input of package_input.placement_inputs">
                      <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [placementParent]="placement_input" [currentCreated]="current_created_input" [parentType]="'Placement'" [childType]="'Ad'" [children]=placement_input.ad_inputs [parent]=placement_input (selectedNamestring)="selectedString($event)"></children-component>

                      <span *ngIf="placement_input.ad_inputs && placement_input.ad_inputs.length > 0">
                        <span *ngFor="let ad_input of placement_input.ad_inputs">
                           <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Ad'" [childType]="'Creative'" [children]=ad_input.creative_inputs [parent]=ad_input (selectedNamestring)="selectedString($event)"></children-component>

                           <span *ngIf="ad_input.creative_inputs && ad_input.creative_inputs.length > 0">
                            <span *ngFor="let creative_input of ad_input.creative_inputs">
                             <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Creative'" [childType]=null [parent]=creative_input (selectedNamestring)="selectedString($event)"></children-component>

                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>

              <span *ngIf="input.filtered_package_inputs && input.filtered_package_inputs.length > 0">
                <span *ngFor="let package_input of input.filtered_package_inputs">
                  <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Package'" [childType]="'Placement'" [children]=package_input.placement_inputs [parent]=package_input (selectedNamestring)="selectedString($event)"></children-component>

                  <span *ngIf="package_input.placement_inputs.length > 0 && (!package_input.filtered_placement_inputs || package_input.filtered_placement_inputs.length == 0)">
                    <span *ngFor="let placement_input of package_input.placement_inputs">
                      <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [placementParent]="placement_input" [currentCreated]="current_created_input" [parentType]="'Placement'" [childType]="'Ad'" [children]=placement_input.ad_inputs [parent]=placement_input (selectedNamestring)="selectedString($event)"></children-component>

                      <span *ngIf="placement_input.ad_inputs && placement_input.ad_inputs.length > 0">
                        <span *ngFor="let ad_input of placement_input.ad_inputs">
                           <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Ad'" [childType]="'Creative'" [children]=ad_input.creative_inputs [parent]=ad_input (selectedNamestring)="selectedString($event)"></children-component>

                           <span *ngIf="ad_input.creative_inputs && ad_input.creative_inputs.length > 0">
                            <span *ngFor="let creative_input of ad_input.creative_inputs">
                             <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Creative'" [childType]=null [parent]=creative_input (selectedNamestring)="selectedString($event)"></children-component>

                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>

              <span *ngIf="input.filtered_package_inputs && input.filtered_package_inputs.length > 0">
                <span *ngFor="let package_input of input.filtered_package_inputs">
                  <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Package'" [childType]="'Placement'" [children]=package_input.placement_inputs [parent]=package_input (selectedNamestring)="selectedString($event)"></children-component>

                  <span *ngIf="package_input.filtered_placement_inputs && package_input.filtered_placement_inputs.length > 0">
                    <span *ngFor="let placement_input of package_input.filtered_placement_inputs">
                      <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [placementParent]="placement_input" [currentCreated]="current_created_input" [parentType]="'Placement'" [childType]="'Ad'" [children]=placement_input.ad_inputs [parent]=placement_input (selectedNamestring)="selectedString($event)"></children-component>

                      <span *ngIf="placement_input.ad_inputs.length > 0 && (!placement_input.filtered_ad_inputs || placement_input.filtered_ad_inputs.length == 0)">
                        <span *ngFor="let ad_input of placement_input.ad_inputs">
                           <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Ad'" [childType]="'Creative'" [children]=ad_input.creative_inputs [parent]=ad_input (selectedNamestring)="selectedString($event)"></children-component>

                           <span *ngIf="ad_input.creative_inputs && ad_input.creative_inputs.length > 0">
                            <span *ngFor="let creative_input of ad_input.creative_inputs">
                             <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Creative'" [childType]=null [parent]=creative_input (selectedNamestring)="selectedString($event)"></children-component>

                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>

              <span *ngIf="input.filtered_package_inputs && input.filtered_package_inputs.length > 0">
              <span *ngFor="let package_input of input.filtered_package_inputs">
                <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Package'" [childType]="'Placement'" [children]=package_input.placement_inputs [parent]=package_input (selectedNamestring)="selectedString($event)"></children-component>

                <span *ngIf="package_input.filtered_placement_inputs && package_input.filtered_placement_inputs.length > 0">
                  <span *ngFor="let placement_input of package_input.filtered_placement_inputs">
                    <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [packageParent]="package_input" [placementParent]="placement_input" [currentCreated]="current_created_input" [parentType]="'Placement'" [childType]="'Ad'" [children]=placement_input.ad_inputs [parent]=placement_input (selectedNamestring)="selectedString($event)"></children-component>

                    <span *ngIf="placement_input.filtered_ad_inputs && placement_input.filtered_ad_inputs.length > 0">
                      <span *ngFor="let ad_input of placement_input.ad_inputs">
                         <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Ad'" [childType]="'Creative'" [children]=ad_input.creative_inputs [parent]=ad_input (selectedNamestring)="selectedString($event)"></children-component>

                         <span *ngIf="ad_input.creative_inputs && ad_input.creative_inputs.length > 0">
                          <span *ngFor="let creative_input of ad_input.creative_inputs">
                           <children-component [action]="action" [clearSelected]="clearSelected" [campaignParent]="input" [adParent]="ad_input" [placementParent]="placement_input" [packageParent]="package_input" [currentCreated]="current_created_input" [parentType]="'Creative'" [childType]=null [parent]=creative_input (selectedNamestring)="selectedString($event)"></children-component>

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
          <div *ngIf="noInputs"></div>
        </section>
    </div>
  `
})

export class TreeComponent implements OnChanges {

  constructor(private _search: SearchService) {}
  @Input() current_created_input: any = {};
  @Input() all_inputs: any[];
  @Input() action: any;
  @Input() loading: boolean;
  @Output() selectedNamestring = new EventEmitter();

  parentType: any;
  childType: any;
  parent: any = {};
  children: any = [];
  clearSelected: boolean;
  filtered_inputs: any = [];
  noInputs: boolean;
  queryString: any;

  ngOnChanges(changes: SimpleChanges) {
    if(changes['current_created_input'] && changes['current_created_input']['previousValue']) {
      this.clearSelected = true;
    }
  }

  selectedString(nameStringObject) {
    // Send the selected namestring to app-component
    this.selectedNamestring.emit(nameStringObject);
  };

  searchChange(queryString) {
    this.selectedNamestring.emit(null);
    if(queryString && queryString.length > 1) {
      this.filtered_inputs = this._search.searchCampaigns(queryString, this.all_inputs);
      if(this.filtered_inputs.length == 0){
        this.noInputs = true;
      }
    } 

    if(!queryString) {
      this.clearSelected = false;
      this.filtered_inputs = [];
      this.noInputs = false;
    }
  }

}
