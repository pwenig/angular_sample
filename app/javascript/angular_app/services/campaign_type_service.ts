import {Component, Injectable} from '@angular/core';
import {TENTPOLE} from '../constants/season_constants';

@Injectable()
export class CampaignTypeService {

  tentpole(campaignObj) {
    return campaignObj['season']['abbrev'] == TENTPOLE;
  }
}