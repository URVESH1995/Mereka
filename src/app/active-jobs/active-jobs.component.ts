import { Component, OnInit, Input, NgZone } from '@angular/core';
import { iPostJob } from '../models/post-job';
import { iJobBid } from '../models/job-bid';
import { DataHelperService } from '../services/data-helper.service';
import { PaymentsService } from '../services/payments.service';
import { UserAuthService } from '../services/user-auth.service';
import { iChatNode } from '../models/chat-node';
import { Router } from '@angular/router';
import { iPushNotification } from '../models/push-notification';
import { iStrings } from '../models/enums';
import { iPayment } from '../models/payment';
import { iTransaction } from '../models/transaction';
import * as firebase from 'firebase';


@Component({
  selector: 'app-active-jobs',
  templateUrl: './active-jobs.component.html',
  styleUrls: ['./active-jobs.component.scss']
})
export class ActiveJobsComponent implements OnInit {

  @Input() public jobDetails: iPostJob;
  @Input() public acceptedBids: iJobBid[];

  mainIndex: number;
  milestoneIndex: number;
  deductionAmount: number;


  constructor(
    public zone: NgZone,
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
    public paymentService: PaymentsService,
  ) { }


  ngOnInit(): void {
  }


  chatWithExpert(bid: iJobBid) {
    let chatNodeObj: iChatNode = new iChatNode();
    chatNodeObj.jobKey = bid.jobKey;
    chatNodeObj.expertId = bid.uid;
    chatNodeObj.clientId = this.userAuth.currentUser.uid
    chatNodeObj.agencyId = bid.bidPerson.agencyId || null;
    this.dataHelper.chatNodeObj = chatNodeObj;
    this.router.navigate(['/chats']);
  }


  milestoneDetails(contract: iJobBid) {
    this.dataHelper.contractDetails = contract;
    this.router.navigate(['/job-milestones']);
  }


  acceptDelivery(mainIndex: number, index: number) {
    this.mainIndex = mainIndex;
    this.milestoneIndex = index;
    if (this.acceptedBids[this.mainIndex].milestones[this.milestoneIndex + 1]) {
      this.deductionAmount = this.acceptedBids[this.mainIndex].milestones[this.milestoneIndex + 1].price;
      document.getElementById('openPaymentModal').click();
    } else {
      this.confirmAcceptDelivery();
    }
  }


  confirmPayment(paymentObj: iPayment) {
    this.paymentService.confirmPayment(paymentObj, this.deductionAmount, this.getPayDescription())
      .then(() => {
        this.createTransactionNode(this.paymentService.paymentRef);
        this.confirmAcceptDelivery();
      });
  }


  getPayDescription(): string {
    return this.userAuth.currentUser.email + ' ' + this.userAuth.currentUser.fullName +
      ', paid ' + this.acceptedBids[this.mainIndex].uid + ' RM' + this.deductionAmount +
      ' on milestone completion for the job ' + this.jobDetails.key;
  }


  createTransactionNode(paymentRef: any) {
    const transaction = new iTransaction();
    transaction.paymentForAcceptJobProposal = true;
    transaction.transactionKey = firebase.database().ref().child('transactions').push().key;
    transaction.paymentFrom = localStorage.getItem('uid');
    transaction.workshopKey = null;
    transaction.hubId = null;
    transaction.jobKey = this.jobDetails.key;
    transaction.paymentRef = paymentRef;
    transaction.timestamp = Number(new Date());
    transaction.amount = this.deductionAmount;
    firebase.database().ref().child(`/allTransactions/${transaction.transactionKey}`)
      .set(transaction).then(() => {
        document.getElementById('closePaymentModal').click();
        this.dataHelper.displayLoading = false;
      });
  }


  confirmAcceptDelivery() {
    this.acceptedBids[this.mainIndex].milestones[this.milestoneIndex].status = 'Paid';
    if (this.acceptedBids[this.mainIndex].milestones[this.milestoneIndex + 1]) {
      this.acceptedBids[this.mainIndex].milestones[this.milestoneIndex + 1].status = 'In Progress';
    } else {
      this.markOverallJobAsPaid(this.mainIndex);
    }
    this.saveOnFirebase(this.acceptedBids[this.mainIndex], 'accept');
  }


  rejectDelivery(mainIndex: number, index: number) {
    this.acceptedBids[mainIndex].milestones[index].status = 'In Progress';
    this.saveOnFirebase(this.acceptedBids[mainIndex], 'reject');
  }


  saveOnFirebase(bid: iJobBid, status: string) {
    firebase.database().ref().child(`/bids/${bid.key}/milestones`)
      .set(bid.milestones).then(() => {
        if (status === 'accept') {
          this.sendAcceptanceNotification(bid);
          this.dataHelper.publishSomeData({ showSuccess: 'Milestone paid!' });
        } else {
          this.sendRejectionNotification(bid);
          firebase.database().ref().child(`/bids/${bid.key}/completionDate`).set(null);
          this.dataHelper.publishSomeData({ showSuccess: 'Milestone status updated!' });
        }
      });
  }


  markOverallJobAsPaid(mainIndex: number) {
    this.acceptedBids[mainIndex].status = 'paid';
    this.acceptedBids[mainIndex].completionDate = Number(new Date());

    firebase.database().ref().child(`/bids/${this.acceptedBids[mainIndex].key}/completionDate`)
      .set(this.acceptedBids[mainIndex].completionDate);

    firebase.database().ref().child(`/bids/${this.acceptedBids[mainIndex].key}/status`)
      .set(this.acceptedBids[mainIndex].status)
      .then(() => {
        this.sendJobPaidNotification(this.acceptedBids[mainIndex]);
      });
  }


  rejectJob(mainIndex: number) {
    this.acceptedBids[mainIndex].status = 'accepted';
    this.acceptedBids[mainIndex].completionDate = null;
    firebase.database().ref().child(`/bids/${this.acceptedBids[mainIndex].key}/completionDate`).set(null);
    firebase.database().ref().child(`/bids/${this.acceptedBids[mainIndex].key}/status`)
      .set(this.acceptedBids[mainIndex].status)
      .then(() => {
        this.sendJobRejectionNotification(this.acceptedBids[mainIndex]);
      });
  }


  sendJobPaidNotification(bid: iJobBid) {
    const notificationObj = new iPushNotification();
    notificationObj.jobKey = bid.jobKey;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = bid.uid;
    notificationObj.title = 'Job Completed';
    notificationObj.type = iStrings.JOB_PAID;
    this.dataHelper.sendNotification(bid.uid, notificationObj);
  }


  sendJobRejectionNotification(bid: iJobBid) {
    const notificationObj = new iPushNotification();
    notificationObj.jobKey = bid.jobKey;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = bid.uid;
    notificationObj.title = 'Job Completion Rejected';
    notificationObj.type = iStrings.JOB_REJECTED;
    this.dataHelper.sendNotification(bid.uid, notificationObj);
  }


  sendAcceptanceNotification(bid: iJobBid) {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = bid.uid;
    notificationObj.title = 'Milestone Paid';
    notificationObj.type = iStrings.MILESTONE_PAID;
    notificationObj.jobKey = bid.jobKey;
    this.dataHelper.sendNotification(bid.uid, notificationObj);
  }


  sendRejectionNotification(bid: iJobBid) {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = bid.uid;
    notificationObj.title = 'Milestone Rejected';
    notificationObj.type = iStrings.MILESTONE_REVERTED;
    notificationObj.jobKey = bid.jobKey;
    this.dataHelper.sendNotification(bid.uid, notificationObj);
  }



}
