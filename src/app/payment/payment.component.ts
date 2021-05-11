import { Component, NgZone, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { PaymentsService } from '../services/payments.service';
import { iExperience } from '../models/experience';
import { iPayment } from '../models/payment';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { iJobBid } from '../models/job-bid';
import { iPostJob } from '../models/post-job';
import { iTransaction } from '../models/transaction';
import { iPushNotification } from '../models/push-notification';
import { iStrings } from '../models/enums';
import * as firebase from 'firebase';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  workshopDetails: iExperience;
  jobProposal: iJobBid;
  selectedJob: iPostJob;
  backPageUrl: string;

  paymentForBookingWorkshop: boolean;
  paymentForAcceptJobProposal: boolean;

  constructor(
    public zone: NgZone,
    public router: Router,
    public paymentService: PaymentsService,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }


  ngOnInit(): void {
    this.getPaymentDetails();
  }


  getPaymentDetails() {
    if (this.dataHelper.acceptJobProposalBid) {
      this.paymentForAcceptJobProposal = true;
      this.selectedJob = this.dataHelper.postedJobDetail;
      this.jobProposal = this.dataHelper.acceptJobProposalBid;
      this.backPageUrl = `/post-details/${this.selectedJob.key}`;
    } else {
      this.router.navigate(['/home']);
    }
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
    transaction.paymentForAcceptJobProposal = this.paymentForAcceptJobProposal;
    transaction.paymentForBookingWorkshop = null;
    transaction.transactionKey = firebase.database().ref().child('transactions').push().key;
    transaction.paymentFrom = localStorage.getItem('uid');
    transaction.workshopKey = null;
    transaction.hubId = null;
    transaction.jobKey = this.selectedJob.key;
    transaction.paymentRef = paymentRef;
    transaction.timestamp = Number(new Date());
    transaction.amount = this.getPaymentAmount();

    firebase.database().ref().child(`/allTransactions/${transaction.transactionKey}`).set(transaction);
    this.sendProposalAcceptanceNotification();
    this.updateJobHireList(transaction.transactionKey);
  }


  sendProposalAcceptanceNotification() {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = this.jobProposal.uid;
    notificationObj.title = 'Job Proposal Accepted';
    notificationObj.type = iStrings.ACCEPT_JOB_PROPOSAL;
    notificationObj.jobKey = this.selectedJob.key;
    this.dataHelper.sendNotification(this.jobProposal.uid, notificationObj);
  }


  updateJobHireList(transactionKey: string) {
    const self = this;
    const bid = self.jobProposal;
    bid.status = 'accepted';
    bid.transactionKey = transactionKey;
    if (bid.type === 'milestone') {
      bid.milestones[0].status = 'In Progress';
    }
    firebase.database().ref().child(`/bids/${bid.key}`).set(bid);
    firebase.database().ref().child(`/jobs/${self.selectedJob.key}/hired`)
      .once('value', (snapshot) => {
        const hired: string[] = snapshot.val() || [];
        if (!hired.includes(bid.uid)) {
          hired.push(bid.uid);
        }
        self.dataHelper.publishSomeData({ showSuccess: `Proposal accepted successfully!` });
        self.router.navigate(['/home']);
        self.dataHelper.displayLoading = false;
        firebase.database().ref().child(`/jobs/${self.selectedJob.key}/hired`).set(hired);
      });
  }


  getPaymentDescription(): string {
    let description: string;

    description = this.userAuth.currentUser.email + ' ' + this.userAuth.currentUser.fullName +
      ', hired ' + this.jobProposal.uid + ' expert for RM' + this.getJobPrice() + ' for the job'
      + ' ' + this.jobProposal.jobKey;

    return description;
  }


  getPaymentAmount(): number {
    let deductAmount: number;
    deductAmount = this.getJobPrice();
    return deductAmount;
  }


  getJobPrice(): number {
    if (this.jobProposal) {
      if (this.jobProposal.type === 'fixed') {
        return this.jobProposal.totalPrice;
      } else {
        return this.jobProposal.milestones[0].price;
      }
    }
  }

}
