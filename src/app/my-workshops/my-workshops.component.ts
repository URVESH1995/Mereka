import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { Router } from '@angular/router';
import { iExperience } from '../models/experience';
import { UserAuthService } from '../services/user-auth.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-my-workshops',
  templateUrl: './my-workshops.component.html',
  styleUrls: ['./my-workshops.component.scss']
})
export class MyWorkshopsComponent implements OnInit {

  loading: boolean;
  myWorkshops: iExperience[] = [];
  activeIndex: number;
  activeTab: string = 'upcoming';
  todaysTimestamp: number;

  constructor(
    public userAuth: UserAuthService,
    public router: Router,
    public zone: NgZone,
    public dataHelper: DataHelperService
  ) {
    this.dataHelper.workshopDetail = null;
    if (!this.userAuth.currentUser.uid || !this.dataHelper.myAgency) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.getMyWorkshops();

    if (!this.dataHelper.dataFetching.allWorkshopsFetched) {
      this.loading = true;
    } else {
      this.filterMyBookings(this.activeTab);
    }

    this.dataHelper.getObservable().subscribe((data) => {
      if (data.allWorkshopsFetched) {
        this.getMyWorkshops();
        this.loading = false;
        this.filterMyBookings(this.activeTab);
      }
    });
  }

  filterMyBookings(tab: string) {
    this.activeTab = tab;
    if (this.activeTab === 'upcoming') {
      this.myWorkshops = this.dataHelper.allWorkshopList.filter(x =>
        !this.isWorkshopEndDatePassed(x) && x.uid === this.userAuth.currentUser.uid)
    } else {
      this.myWorkshops = this.dataHelper.allWorkshopList.filter(x =>
        this.isWorkshopEndDatePassed(x) && x.uid === this.userAuth.currentUser.uid)
    }
  }

  getMyWorkshops() {
    this.myWorkshops = this.dataHelper.allWorkshopList || [];
    this.myWorkshops = this.myWorkshops.filter(x => x.uid === this.userAuth.currentUser.uid);
  }

  addNewWorkshop() {
    this.dataHelper.isEditWorkshop = false;
    this.dataHelper.createExperienceObj = new iExperience();
    this.router.navigate(['/create-workshop']);
  }

  editWorkshop(workshop: iExperience) {
    this.dataHelper.isEditWorkshop = true;
    this.dataHelper.createExperienceObj = workshop;
    this.router.navigate(['/create-workshop']);
  }

  workshopDetails(workshop: iExperience) {
    this.dataHelper.workshopDetail = workshop;
    this.router.navigate(['/workshop-details/' + workshop.workshopKey]);
  }

  removeWorkshop(workshop: iExperience) {
    this.activeIndex = this.myWorkshops.findIndex(x => x.workshopKey === workshop.workshopKey);
  }

  removeWorkshopFromFirebase() {
    const self = this;
    const workshop = self.myWorkshops[self.activeIndex];
    firebase.database().ref().child(`/workshops/${workshop.workshopKey}`)
      .remove().then(() => {
        self.updateLocalData(workshop.workshopKey);
        self.dataHelper.publishSomeData({ showSuccess: 'Workshop removed successfully!' });
      });
  }

  updateLocalData(workshopKey: string) {
    this.myWorkshops.splice(this.activeIndex, 1);
    const index = this.dataHelper.allWorkshopList.findIndex(x => x.workshopKey === workshopKey);
    if (index >= 0) {
      this.dataHelper.allWorkshopList.splice(index, 1);
    }
  }

  isWorkshopEndDatePassed(workshop: iExperience): boolean {
    let datePassed: boolean;
    datePassed = Number(new Date(workshop.experienceDuration.endDate)) < this.todaysTimestamp;
    return datePassed;
  }

}
