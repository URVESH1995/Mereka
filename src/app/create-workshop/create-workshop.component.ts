import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import { iExperience, iExperienceLocation } from '../models/experience';

declare var google: any;

@Component({
  selector: 'app-create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.scss']
})
export class CreateWorkshopComponent implements OnInit {

  newTag: string;
  userSettings: any = {};

  myWorkshopObj: iExperience = new iExperience();
  activeTab: string = 'Your Experience';
  expandTypeofExperience: boolean = true;
  expandCategoryofExperience: boolean = true;
  expandLocation: boolean = true;
  displayMap: boolean;

  allCategories: string[] = ['workshop', 'talk', 'class', 'program', 'course'];

  tabButtons: any[] = [
    { title: 'Your Experience', navigatePage: 'create-workshop' },
    { title: 'Your Audience', navigatePage: 'workshop-audience' },
    { title: 'Additional Information', navigatePage: 'workshop-additional-info' },
    { title: 'Your Page', navigatePage: 'workshop-basic-details' },
    { title: 'Confirmation', navigatePage: 'workshop-preview' },
  ];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    if (!this.dataHelper.createExperienceObj) {
      this.router.navigate(['/add-service']);
    } else {
      this.myWorkshopObj = this.dataHelper.createExperienceObj;
      if (!this.myWorkshopObj.location) {
        this.myWorkshopObj.location = new iExperienceLocation();
      }
      if (!this.myWorkshopObj.tags) {
        this.myWorkshopObj.tags = [];
      }
      this.updateUserSettings();
    }
  }

  updateUserSettings() {
    this.userSettings = {
      showSearchButton: false,
      inputPlaceholderText: 'Address',
      inputString: this.myWorkshopObj.location.location
    };
    this.updateMapDisplay();
  }

  updateMapDisplay() {
    this.displayMap = false;
    setTimeout(() => {
      this.displayMap = true;
    }, 200);
  }

  updateLocation() {
    if (this.myWorkshopObj.isLocationFromHub && this.dataHelper.myAgency.location) {
      this.myWorkshopObj.location = this.dataHelper.myAgency.location;
    } else {
      this.myWorkshopObj.location = new iExperienceLocation();
    }
    this.updateUserSettings();
  }

  mapClicked(event) {
    var self = this;
    self.myWorkshopObj.location.lat = event.coords.lat;
    self.myWorkshopObj.location.lng = event.coords.lng;
    self.getLocationFromLatlng();
  }

  getLocationFromLatlng() {
    var self = this;
    let geocoder = new google.maps.Geocoder;
    let latlng = { lat: self.myWorkshopObj.location.lat, lng: self.myWorkshopObj.location.lng };
    geocoder.geocode({ 'location': latlng }, (results) => {
      if (results[0]) {
        self.myWorkshopObj.location.location = results[0].formatted_address;
        self.updateUserSettings();
      }
    });
  }

  saveAndNext() {
    if (this.allFieldsAreFilled()) {
      this.dataHelper.createExperienceObj = this.myWorkshopObj;
      this.router.navigate(['/workshop-audience']);
    }
  }

  allFieldsAreFilled(): boolean {
    let filedsAreFilled = true;
    if (!this.myWorkshopObj.theme) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Experience theme missing!' });
    } else if (!this.myWorkshopObj.tags.length) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Add at least one tag!' });
    } else if (!this.myWorkshopObj.location.city || !this.myWorkshopObj.location.country ||
      !this.myWorkshopObj.location.state || !this.myWorkshopObj.location.streetAddress ||
      !this.myWorkshopObj.location.location || !this.myWorkshopObj.location.postcode ||
      !this.myWorkshopObj.location.lat || !this.myWorkshopObj.location.lng) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Fill out all location fields!' });
    }
    return filedsAreFilled;
  }

  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

  autoCompleteCallback(selectedData: any) {
    const Data = selectedData.data;
    if (Data) {
      this.userSettings.inputString = Data.description;
      this.myWorkshopObj.location.location = Data.formatted_address;
      const geometry = Data.geometry;
      const Location = geometry.location;
      this.myWorkshopObj.location.lat = Location.lat;
      this.myWorkshopObj.location.lng = Location.lng;
      this.updateMapDisplay();
    }
  }

  addNewTag() {
    if (this.newTag) {
      this.myWorkshopObj.tags.push(this.newTag);
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.myWorkshopObj.tags.splice(index, 1);
  }

}
