import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { AppComponent } from './app.component';
import {SelectComponent} from './select.component';
import {YearSelectComponent} from './yearselect.component';
import {MonthSelectComponent} from './monthselect.component';
import {DaySelectComponent} from './dayselect.component';


import { MetadataService } from '../services/metadata_service';
import { CampaignInputService } from '../services/campaign_input_service';

import {RangePipe} from '../shared/range.pipe'


@NgModule({
  declarations: [
    AppComponent,
    SelectComponent,
    YearSelectComponent,
    MonthSelectComponent,
    DaySelectComponent,
    RangePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TimepickerModule.forRoot()
  ],
  providers: [MetadataService, CampaignInputService],
  bootstrap: [AppComponent]
})
export class AppModule { }
