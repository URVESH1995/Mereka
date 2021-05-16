import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { iAgency } from '../../models/agency';
import { Router } from '@angular/router';
import { DataHelperService } from '../../services/data-helper.service';
import * as firebase from 'firebase';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-about-hub',
  templateUrl: './about-hub.component.html',
  styleUrls: ['./about-hub.component.scss']
})
export class AboutHubComponent implements OnInit {

  myAgency: iAgency = new iAgency();
  @Output() updatedActiveTab = new EventEmitter<any>();


  allAminities: string[] = ['Free tee/coffee', 'Vending machine', 'Air conditioning',
    'Pet friendly', 'Free car/bicycle parking', 'Free snacks', 'WiFi',
    '24-hour access', 'Office equipment', 'Public transport access'];
  allFacilities: string[] = ['Lockers', 'Outdoor terrace', 'Lounge area', 'Swimming pool' , 'Nap room',
 'Onsite cafe' , 'Pantry/kitchen', 'Retail space', 'Showers', 'Library', 'Meditation room', 'Gym',
 'Childcare', 'Laundry service', 'Wheelchair accessibility' ];


  constructor( public userAuth:UserAuthService,
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

  nextTab(check) {
    if (this.allFieldsAreFilled()) {
      if(!check) {
        this.updatedActiveTab.emit('Confirmation');
      } else {
        const updates = {};
        updates[`/agencies/${this.myAgency.expertUid}/agencyDescription`] = this.myAgency.agencyDescription;
        updates[`/agencies/${this.myAgency.expertUid}/amenities`] = this.myAgency.amenities;
        updates[`/agencies/${this.myAgency.expertUid}/facilities`] = this.myAgency.facilities;
        updates[`/agencies/${this.myAgency.expertUid}/canLearnerSendJobRequests`] = this.myAgency.canLearnerSendJobRequests;
        updates[`/agencies/${this.myAgency.expertUid}/canLearnerRequestInstantQuotes`] = this.myAgency.canLearnerRequestInstantQuotes;
        updates[`/agencies/${this.myAgency.expertUid}/location`] = this.myAgency.location;
        updates[`/agencies/${this.myAgency.expertUid}/agencyName`] = this.myAgency.agencyName;
        updates[`/agencies/${this.myAgency.expertUid}/companyType`] = this.myAgency.companyType;
        updates[`/agencies/${this.myAgency.expertUid}/agencyLogo`] = this.myAgency.agencyLogo;
        updates[`/agencies/${this.myAgency.expertUid}/coverImage`] = this.myAgency.coverImage;
        firebase.database().ref().update(updates).then(() => {
          this.dataHelper.publishSomeData({ showSuccess: 'Hub data updated saved!' });
          this.dataHelper.myAgency = this.myAgency;
          this.router.navigate(['/hub-dashboard']);
        });
      }
    } else if(check) {
      this.router.navigate(['/hub-dashboard']);
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
