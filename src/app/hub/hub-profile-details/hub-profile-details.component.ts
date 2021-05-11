import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { iAgency } from '../../models/agency';
import { Router } from '@angular/router';

declare var google: any;


@Component({
  selector: 'app-hub-profile-details',
  templateUrl: './hub-profile-details.component.html',
  styleUrls: ['./hub-profile-details.component.scss']
})
export class HubProfileDetailsComponent implements OnInit {

  displayMap: boolean;
  userSettings: any = {};
  myAgency: iAgency = new iAgency();
  @Output() updatedActiveTab = new EventEmitter<any>();

  constructor(
    public router: Router,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.myAgency = this.dataHelper.createAgencyData;
    this.updateUserSettings();
  }

  navigateBack() {
    this.updatedActiveTab.emit('Your Hub');
  }

  updateUserSettings() {
    this.userSettings = {
      showSearchButton: false,
      inputPlaceholderText: 'Address',
      inputString: this.myAgency.location.location
    };
    this.updateMapDisplay();
  }

  updateMapDisplay() {
    this.displayMap = false;
    setTimeout(() => {
      this.displayMap = true;
    }, 200);
  }

  mapClicked(event) {
    var self = this;
    self.myAgency.location.lat = event.coords.lat;
    self.myAgency.location.lng = event.coords.lng;
    self.getLocationFromLatlng();
  }

  getLocationFromLatlng() {
    var self = this;
    let geocoder = new google.maps.Geocoder;
    let latlng = { lat: self.myAgency.location.lat, lng: self.myAgency.location.lng };
    geocoder.geocode({ 'location': latlng }, (results) => {
      if (results[0]) {
        self.myAgency.location.location = results[0].formatted_address;
        self.updateUserSettings();
      }
    });
  }

  autoCompleteCallback(selectedData: any) {
    const Data = selectedData.data;
    if (Data) {
      this.userSettings.inputString = Data.description;
      const geometry = Data.geometry;
      const Location = geometry.location;
      this.myAgency.location.lat = Location.lat;
      this.myAgency.location.lng = Location.lng;
      this.updateMapDisplay();
    }
  }

  nextTab() {
    if (this.allFieldsAreFilled()) {
      this.dataHelper.createAgencyData = this.myAgency;
      this.updatedActiveTab.emit('About Page');
    }
  }

  allFieldsAreFilled(): boolean {
    let dataFilled: boolean = true;
    if (!this.myAgency.location.city || !this.myAgency.location.country ||
      !this.myAgency.location.streetAddress || !this.myAgency.location.postcode ||
      !this.myAgency.location.state) {
      this.dataHelper.publishSomeData({ showError: 'Please fill out the location fields!' });
      dataFilled = false;
    } else if (this.myAgency.canLearnerRequestInstantQuotes === undefined ||
      this.myAgency.canLearnerSendJobRequests === undefined) {
      this.dataHelper.publishSomeData({ showError: 'Please choose all of the service options!' });
      dataFilled = false;
    }
    return dataFilled;
  }

}
