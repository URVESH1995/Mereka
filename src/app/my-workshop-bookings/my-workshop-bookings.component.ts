import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iBookExperience } from '../models/book-experience';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-workshop-bookings',
  templateUrl: './my-workshop-bookings.component.html',
  styleUrls: ['./my-workshop-bookings.component.scss']
})
export class MyWorkshopBookingsComponent implements OnInit {

  loading: boolean;
  activeTab: string = 'upcoming';
  myBookings: iBookExperience[] = [];
  todaysTimestamp: number;

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
  ) {
    if (!this.userAuth.currentUser.uid) {
      this.router.navigate(['/home']);
    }
  }


  ngOnInit(): void {
    this.todaysTimestamp = Number(new Date());
    if (!this.dataHelper.dataFetching.myWorkshopBookingsFetched) {
      this.loading = true;
    } else {
      this.filterMyBookings(this.activeTab);
    }

    this.dataHelper.getObservable().subscribe(data => {
      if (data.myWorkshopBookingsFetched) {
        this.loading = false;
        this.filterMyBookings(this.activeTab);
      }
    });
  }


  filterMyBookings(tab: string) {
    this.activeTab = tab;
    if (this.activeTab === 'upcoming') {
      this.myBookings = this.dataHelper.myWorkshopBookingsList.filter(x => !this.isWorkshopEndDatePassed(x))
    } else {
      this.myBookings = this.dataHelper.myWorkshopBookingsList.filter(x => this.isWorkshopEndDatePassed(x))
    }
  }


  isWorkshopEndDatePassed(bookingPayload: iBookExperience): boolean {
    let datePassed: boolean;
    datePassed = Number(new Date(bookingPayload.session.date)) < this.todaysTimestamp;
    return datePassed;
  }


}
