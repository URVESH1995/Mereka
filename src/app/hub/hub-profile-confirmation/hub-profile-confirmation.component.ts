import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { iAgency } from '../../models/agency';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-hub-profile-confirmation',
  templateUrl: './hub-profile-confirmation.component.html',
  styleUrls: ['./hub-profile-confirmation.component.scss']
})
export class HubProfileConfirmationComponent implements OnInit {

  myAgency: iAgency = new iAgency();
  @Output() updatedActiveTab = new EventEmitter<any>();

  constructor(
    public router: Router,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.myAgency = this.dataHelper.createAgencyData;
    this.fillEmptyFields();
  }

  fillEmptyFields() {
    if (!this.myAgency.totalReviews) {
      this.myAgency.totalReviews = 0;
    } if (!this.myAgency.avgRating) {
      this.myAgency.avgRating = 0;
    } if (!this.myAgency.timestamp) {
      this.myAgency.timestamp = Number(new Date());
    }
    this.myAgency.expertUid = localStorage.getItem('uid');
  }

  navigateBack() {
    this.updatedActiveTab.emit('About Page');
  }

  updateMyAgencyOnFirebase() {
    const updates = {};
    updates[`/users/${this.myAgency.expertUid}/location`] = this.myAgency.location;
    updates[`/users/${this.myAgency.expertUid}/myAgency`] = this.myAgency.agencyName;
    updates[`/agencies/${this.myAgency.expertUid}`] = this.myAgency;

    firebase.database().ref().update(updates).then(() => {
      this.dataHelper.publishSomeData({ showSuccess: 'Hub saved!' });
      this.dataHelper.myAgency = this.myAgency;
      this.router.navigate(['/hub-dashboard']);
    });
  }

}
