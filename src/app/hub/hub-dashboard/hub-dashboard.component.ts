import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iAgency } from '../../models/agency';
import { iExperience } from '../../models/experience';
import { Router } from '@angular/router';
import { iExperienceReview } from '../../models/workshop-review';
import { iExpertProfile } from '../../models/user';
import * as firebase from 'firebase';


@Component({
  selector: 'app-hub-dashboard',
  templateUrl: './hub-dashboard.component.html',
  styleUrls: ['./hub-dashboard.component.scss']
})
export class HubDashboardComponent implements OnInit {

  loading: boolean;
  myAgency: iAgency = new iAgency();
  myWorkshops: iExperience[] = [];
  selectedTab: string = 'Experiences';
  allWorkshopsReviews: iExperienceReview[] = [];

  activeMenu2: string = 'My Dashboard';
  userSubMenu: boolean = false;
  serviceSubMenu: boolean = false;
  activeMenu: string = 'Dashboard';
  sideMenuItems: string[] = [
    `Hub Profile`, `Users`, `Analytics`, `Messages`, `Manage Services`, `Payment and Billings`, `Security Center`
  ];

  hubTotalSales: number = 0;
  avgRatingOfAllWorkshops: number = 0;

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) {
    if (!this.userAuth.currentUser.uid || !dataHelper.myAgency) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.getMyAgencyData();
    this.getAllWorkshopReviews();

    if (!this.dataHelper.dataFetching.myWorkshopBookingsFetched) {
      this.loading = true;
    }

    this.dataHelper.getObservable().subscribe(data => {
      if (data.myWorkshopBookingsFetched) {
        this.getMyAgencyData();
        this.loading = false;
      }
    });
  }

  getAllWorkshopReviews() {
    const self = this;
    firebase.database().ref().child(`/workshopReviews/`)
      .orderByChild('workshopOwner').equalTo(self.userAuth.currentUser.uid)
      .once('value', (snapshot) => {
        const allReviews = snapshot.val();
        self.allWorkshopsReviews = [];
        for (var key in allReviews) {
          const review: iExperienceReview = allReviews[key];
          review.ratingUser = self.dataHelper.allUsers[review.uid];
          self.allWorkshopsReviews.push(review);
        }
        self.calculateWorkshopAvgRating();
        self.allWorkshopsReviews.sort((a, b) => b.timestamp - a.timestamp);
      });
  }

  calculateWorkshopAvgRating() {
    let totalRating = 0;
    if (this.allWorkshopsReviews.length) {
      this.allWorkshopsReviews.forEach(x => {
        totalRating += x.rating;
      });
      this.avgRatingOfAllWorkshops = totalRating / this.allWorkshopsReviews.length;
    }
  }

  getMyAgencyData() {
    this.getMyWorkshops();

    this.myAgency = this.dataHelper.myAgency || new iAgency();
    console.log(this.myAgency);
    this.getTotalSales();
  }

  getMyWorkshops() {
    this.myWorkshops = this.dataHelper.allWorkshopList || [];
    this.myWorkshops = this.myWorkshops.filter(x => x.uid === this.userAuth.currentUser.uid);
  }

  getTotalSales() {
    this.hubTotalSales = 0;
    const allBookings = this.dataHelper.allWorkshopBookingsList || [];
    const bookingAgainstMyWorkshops = allBookings.filter(x => x.owner === this.userAuth.currentUser.uid);
    bookingAgainstMyWorkshops.forEach(x => {
      this.hubTotalSales += x.price;
    });
  }

  editWorkshop(workshop: iExperience) {
    this.dataHelper.isEditWorkshop = true;
    this.dataHelper.createExperienceObj = workshop;
    this.router.navigate(['/create-workshop']);
  }

  navigateToHubprofile(menu: string) {
    if (menu === `Hub Profile`) {
      this.activeMenu = menu;
    }
  }

  becomeAnExpert() {
    if (this.userAuth.currentUser.expertProfile) {
      this.dataHelper.expertProfile = this.userAuth.currentUser.expertProfile;
    } else {
      this.dataHelper.expertProfile = new iExpertProfile();
    }
    this.router.navigate(['/expertise-details']);
  }

  agencyProfile() {
    this.router.navigate(['/agency-profile/' + this.dataHelper.myAgency.expertUid]);
  }
}
