import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { PaymentsService } from '../services/payments.service';
import { iExperience } from '../models/experience';
import { iBookExperience } from '../models/book-experience';
import { iPayment } from '../models/payment';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { iTransaction } from '../models/transaction';
import { Options } from "@angular-slider/ngx-slider";
import { iStrings } from '../models/enums';
import { iPushNotification } from '../models/push-notification';
import { iAgency } from '../models/agency';
import * as firebase from 'firebase';


@Component({
  selector: 'app-workshop-payment',
  templateUrl: './workshop-payment.component.html',
  styleUrls: ['./workshop-payment.component.scss']
})
export class WorkshopPaymentComponent implements OnInit {

  loading: boolean;
  rangeBarOptions: Options = {
    floor: 1,
    ceil: 1,
  };

  workshopDetails: iExperience = new iExperience();
  bookWorkshopPayload: iBookExperience = new iBookExperience();

  constructor(
    public router: Router,
    public paymentService: PaymentsService,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }


  ngOnInit(): void {
    if (!this.dataHelper.bookWorkshopPayload) {
      this.router.navigate(['/home']);
    } else {
      this.bookWorkshopPayload = this.dataHelper.bookWorkshopPayload;
      this.workshopDetails = this.dataHelper.workshopDetail;
      this.rangeBarOptions = {
        floor: 1,
        ceil: this.workshopDetails.guestLearners,
        step: 1,
        showTicks: true,
        showSelectionBar: true
      }
      this.pushEmptyLearners(this.bookWorkshopPayload.learners);
      if (!this.workshopDetails.bookedBy) {
        this.workshopDetails.bookedBy = [];
      }
    }
  }


  updateSelectedLearners(selectedLearners: number) {
    if (selectedLearners > this.bookWorkshopPayload.learners) {
      const diff = selectedLearners - this.bookWorkshopPayload.learners;
      this.pushEmptyLearners(diff);
    } else {
      this.bookWorkshopPayload.learnersDetails.splice(selectedLearners);
    }
    this.bookWorkshopPayload.learners = selectedLearners;
    this.bookWorkshopPayload.price = selectedLearners *
      (this.iAmMemberOfHostAgency() ?
        this.workshopDetails.ratePerMember ? this.workshopDetails.ratePerMember : this.workshopDetails.ratePerLearner
        : this.workshopDetails.ratePerLearner);
  }


  pushEmptyLearners(numberOfEmptyObjects: number) {
    for (let i = 0; i < numberOfEmptyObjects; i++) {
      this.bookWorkshopPayload.learnersDetails.push({
        name: '',
        email: ''
      });
    }
  }

  iAmMemberOfHostAgency(): boolean {
    const hostAgency: iAgency = this.dataHelper.allAgencies[this.workshopDetails.uid];
    let iamMemberOfHostAgency: boolean;
    if (hostAgency && hostAgency.experts) {
      hostAgency.experts.forEach(x => {
        if (x.uid === this.userAuth.currentUser.uid) {
          iamMemberOfHostAgency = true;
        }
      });
    }
    return iamMemberOfHostAgency;
  }


  confirmPayment(paymentObj: iPayment) {
    const amount = this.getPaymentAmount();
    const description = this.getPaymentDescription();
    this.paymentService.confirmPayment(paymentObj, amount, description).then(() => {
      this.createTransactionNode(this.paymentService.paymentRef);
    });
  }


  createTransactionNode(paymentRef: any) {
    const transaction = new iTransaction();
    transaction.paymentForAcceptJobProposal = null;
    transaction.paymentForBookingWorkshop = true;
    transaction.transactionKey = firebase.database().ref().child('transactions').push().key;
    transaction.paymentFrom = localStorage.getItem('uid');
    transaction.workshopKey = this.workshopDetails.workshopKey;
    transaction.jobKey = null;
    transaction.hubId = null;
    transaction.paymentRef = paymentRef;
    transaction.timestamp = Number(new Date());
    transaction.amount = this.getPaymentAmount();

    firebase.database().ref().child(`/allTransactions/${transaction.transactionKey}`).set(transaction);
    this.sendWorkshopBookNotification();
    this.bookWorkshop(transaction.transactionKey);
  }


  sendWorkshopBookNotification() {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = this.workshopDetails.uid;
    notificationObj.title = 'Workshop Booked';
    notificationObj.type = iStrings.WORKSHOP_BOOKED;
    notificationObj.workshopKey = this.workshopDetails.workshopKey;
    this.dataHelper.sendNotification(this.workshopDetails.uid, notificationObj);
  }


  bookWorkshop(transactionKey: string) {
    const self = this;
    self.bookWorkshopPayload.learnersDetails = this.bookWorkshopPayload.learnersDetails.filter(x => x.name && x.email);
    self.bookWorkshopPayload.key = firebase.database().ref().child(`workshopBookings`).push().key;
    self.bookWorkshopPayload.transactionKey = transactionKey;
    self.bookWorkshopPayload.timestamp = Number(new Date());
    firebase.database().ref().child(`/workshopBookings/${self.bookWorkshopPayload.key}`)
      .set(self.bookWorkshopPayload).then(() => {
        self.workshopDetails.bookedBy.push(self.userAuth.currentUser.uid);
        firebase.database().ref().child(`/workshops/${self.workshopDetails.workshopKey}/bookedBy`)
          .set(self.workshopDetails.bookedBy).then(() => {
            self.updateLocalDataInService();
            self.router.navigate(['/home']);
            self.dataHelper.publishSomeData({ showSuccess: 'Workshop booked successfully!' });
          })
          .catch(e => {
            self.dataHelper.publishSomeData({ showError: 'Workshop booking data is not saved, Kindly try again!' });
            self.dataHelper.displayLoading = false;
          });
      });
  }


  updateLocalDataInService() {
    this.dataHelper.displayLoading = false;
    this.dataHelper.bookWorkshopQty = 0;
    this.dataHelper.acceptJobProposalBid = null;
    const ind = this.dataHelper.allWorkshopList.findIndex(x => x.workshopKey === this.workshopDetails.workshopKey);
    this.dataHelper.allWorkshopList[ind] = this.workshopDetails;
    this.bookWorkshopPayload.workshopDetails = this.workshopDetails;
    this.dataHelper.myWorkshopBookingsList.unshift(this.bookWorkshopPayload);
    this.dataHelper.workshopDetail = null;
    this.dataHelper.bookWorkshopPayload = null;
  }


  getPaymentDescription(): string {
    let description: string;
    description = this.userAuth.currentUser.email + ' ' + this.userAuth.currentUser.fullName +
      ', booked ' + this.workshopDetails.workshopKey + ' workshop for RM' + this.getPaymentAmount();
    return description;
  }


  getPaymentAmount(): number {
    return this.bookWorkshopPayload.price;
  }

  backPage() {
    this.router.navigate(['/workshop-details/' + this.workshopDetails.workshopKey]);
  }


}
