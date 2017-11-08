import {Component, Injectable} from '@angular/core';
import {VIDEO_ONE, VIDEO_TWO} from '../constants/ad_type_constants';

@Injectable()
export class AdTypeService {

  videoAdType(placementObj) {
    return (placementObj['ad_type'] && placementObj['ad_type']['abbrev'] == VIDEO_ONE) || (placementObj['ad_type'] && placementObj['ad_type']['abbrev'] == VIDEO_TWO)
  }

}