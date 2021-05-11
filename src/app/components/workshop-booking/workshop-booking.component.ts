import { Component, OnInit, Input } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iBookExperience } from '../../models/book-experience';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-workshop-booking',
  templateUrl: './workshop-booking.component.html',
  styleUrls: ['./workshop-booking.component.scss']
})
export class WorkshopBookingComponent implements OnInit {

  activeWorkshopBooking: iBookExperience;
  @Input() workshopBookings: iBookExperience[] = [];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit(): void {
  }

  getHostName(hostUid: string): string {
    if (this.dataHelper.allUsers[hostUid]) {
      return this.dataHelper.allUsers[hostUid].fullName;
    }
  }

  isUpcomingBooking(booking: iBookExperience): boolean {
    const todaysTimestamp = Number(new Date());
    const workshopSessionDate = Number(new Date(booking.session.date))
    return workshopSessionDate > todaysTimestamp;
  }

  cancelBooking() {
    this.dataHelper.displayLoading = true;
    firebase.database().ref().child(`/workshopBookings/${this.activeWorkshopBooking.key}`)
      .remove().then(() => {
        firebase.database().ref().child(`/workshops/${this.activeWorkshopBooking.workshopKey}/bookedBy`)
          .once('value', (snapshot) => {
            const allBooked = snapshot.val() || [];
            const index = allBooked.indexOf(this.userAuth.currentUser.uid);
            allBooked.splice(index, 1);
            firebase.database().ref()
              .child(`/workshops/${this.activeWorkshopBooking.workshopKey}/bookedBy`)
              .set(allBooked).then(() => {
                this.dataHelper.displayLoading = false;
                this.dataHelper.publishSomeData({ showSuccess: 'Booking cancelled successfully!' });
                this.dataHelper.getAllWorkshops();
              });
          });
      });
  }

  workshopDetail(booking: iBookExperience) {
    this.dataHelper.workshopDetail = booking.workshopDetails;
    this.router.navigate(['/workshop-details/' + booking.workshopKey]);
  }


}
