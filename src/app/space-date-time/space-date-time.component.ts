import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
// import { iExperience } from '../models/workshop';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { iAgency } from '../models/agency';


@Component({
  selector: 'app-space-date-time',
  templateUrl: './space-date-time.component.html',
  styleUrls: ['./space-date-time.component.scss']
})
export class SpaceDateTimeComponent implements OnInit {

  //   workshopDetails: iExperience;
  //   loading: boolean;
  //   iAmMemberOfWorkshopAgency: boolean;
  //   myWorkshop: boolean;
  //   selectedQty: number = 1;

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService
  ) { }


  ngOnInit() {

  }

  //   ngOnInit(): void {
  //     this.workshopDetails = this.dataHelper.workshopDetail || new iExperience();
  //     if (this.workshopDetails.key) {
  //       this.getWorkshopAgency();
  //     } else if (!this.workshopDetails.key && this.activeRoute.snapshot.params.key) {
  //       this.getWorkshopDetails(this.activeRoute.snapshot.params.key);
  //     } else if (!this.workshopDetails.key && !this.activeRoute.snapshot.params.key) {
  //       this.router.navigate(['/home']);
  //     }
  //   }


  //   getWorkshopDetails(workshopKey: string) {
  //     const self = this;
  //     self.loading = true;
  //     firebase.database().ref().child(`/workshops/${workshopKey}`)
  //       .once('value', (snapshot) => {
  //         self.workshopDetails = snapshot.val();
  //         self.loading = false;
  //         if (!self.workshopDetails) {
  //           self.router.navigate(['/home']);
  //         } else {
  //           self.getWorkshopAgency();
  //           self.dataHelper.workshopDetail = self.workshopDetails;
  //         }
  //       });
  //   }


  //   getWorkshopAgency() {
  //     const self = this;
  //     const uid = localStorage.getItem('uid');
  //     firebase.database().ref().child(`/agencies/${self.workshopDetails.uid}`)
  //       .once('value', (snapshot) => {
  //         const agency: iAgency = snapshot.val();
  //         if (self.workshopDetails.uid === uid) {
  //           self.myWorkshop = true;
  //         }
  //         if (agency) {
  //           if (!agency.experts) {
  //             self.iAmMemberOfWorkshopAgency = false;
  //           } else {
  //             agency.experts.forEach(x => {
  //               if (x.uid === uid) {
  //                 self.iAmMemberOfWorkshopAgency = true;
  //               }
  //             });
  //           }
  //         }
  //       });
  //   }


  //   confirmPayment() {
  //     if (this.checkWorkshopStats()) {
  //       this.dataHelper.bookWorkshopQty = this.selectedQty;
  //       this.router.navigate(['/payment']);
  //     }
  //   }


  //   checkWorkshopStats(): boolean {
  //     let workshopAvailble = false;

  //     if (this.workshopDetails.workshopAccessibility === 'Public + Private') {
  //       workshopAvailble = true;
  //       if (this.iAmMemberOfWorkshopAgency) {
  //         this.dataHelper.workshopBookedAs = 'Private';
  //       } else {
  //         this.dataHelper.workshopBookedAs = 'Public';
  //       }
  //     }

  //     else if (this.workshopDetails.workshopAccessibility === 'Public') {
  //       this.dataHelper.workshopBookedAs = 'Public';
  //       workshopAvailble = true;
  //     }

  //     else if (this.workshopDetails.workshopAccessibility === 'Private') {
  //       this.dataHelper.workshopBookedAs = 'Private';
  //       workshopAvailble = this.iAmMemberOfWorkshopAgency;
  //       if (!workshopAvailble) {
  //         this.dataHelper.publishSomeData({ showError: 'You must be a member of this workshop agency!' });
  //       }
  //     }

  //     const uid = localStorage.getItem('uid');
  //     if (this.workshopDetails.bookedBy && this.workshopDetails.bookedBy.includes(uid)) {
  //       this.dataHelper.publishSomeData({ showError: 'You have already booked this workshop!' });
  //       workshopAvailble = false;
  //     }

  //     return workshopAvailble;
  //   }


  //   decreaseQty() {
  //     if (this.selectedQty > 1) {
  //       this.selectedQty--;
  //     }
  //   }

  //   increaseQty() {
  //     this.selectedQty++;
  //   }


}
