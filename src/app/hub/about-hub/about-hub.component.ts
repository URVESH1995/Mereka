import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { iAgency } from '../../models/agency';
import { Router } from '@angular/router';
import { DataHelperService } from '../../services/data-helper.service';

@Component({
  selector: 'app-about-hub',
  templateUrl: './about-hub.component.html',
  styleUrls: ['./about-hub.component.scss']
})
export class AboutHubComponent implements OnInit {

  myAgency: iAgency = new iAgency();
  @Output() updatedActiveTab = new EventEmitter<any>();

  constructor(
    public router: Router,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.myAgency = this.dataHelper.createAgencyData;
    if (!this.myAgency.amenities) {
      this.myAgency.amenities = [];
    } if (!this.myAgency.facilities) {
      this.myAgency.facilities = [];
    }
  }

  updateAmenities(amenity: string) {
    const index = this.myAgency.amenities.indexOf(amenity);
    if (index >= 0) {
      this.myAgency.amenities.splice(index, 1);
    } else {
      this.myAgency.amenities.push(amenity);
    }
  }

  updateFacilities(facility: string) {
    const index = this.myAgency.facilities.indexOf(facility);
    if (index >= 0) {
      this.myAgency.facilities.splice(index, 1);
    } else {
      this.myAgency.facilities.push(facility);
    }
  }

  isAmenityAdded(amenity: string) {
    return this.myAgency.amenities.includes(amenity);
  }

  isFacilityAdded(facility: string) {
    return this.myAgency.facilities.includes(facility);
  }

  navigateBack() {
    this.updatedActiveTab.emit('Your Details');
  }

  nextTab() {
    if (this.allFieldsAreFilled()) {
      this.updatedActiveTab.emit('Confirmation');
    }
  }

  allFieldsAreFilled(): boolean {
    let dataFilled: boolean = true;
    if (!this.myAgency.agencyDescription) {
      this.dataHelper.publishSomeData({ showError: 'Please fill out the description!' });
      dataFilled = false;
    } else if (!this.myAgency.amenities.length || !this.myAgency.facilities.length) {
      this.dataHelper.publishSomeData({ showError: 'Please add amenities and facilities!' });
      dataFilled = false;
    }
    return dataFilled;
  }

}
