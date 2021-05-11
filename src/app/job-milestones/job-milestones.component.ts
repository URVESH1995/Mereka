import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { PaymentsService } from '../services/payments.service';
import { iJobBid } from '../models/job-bid';
import { Router } from '@angular/router';
import { iUser } from '../models/user';
import { iStrings } from '../models/enums';
import { iPushNotification } from '../models/push-notification';
import { iChatNode } from '../models/chat-node';
import { iPayment } from '../models/payment';
import { iTransaction } from '../models/transaction';
import * as firebase from 'firebase';


@Component({
  selector: 'app-job-milestones',
  templateUrl: './job-milestones.component.html',
  styleUrls: ['./job-milestones.component.scss']
})
export class JobMilestonesComponent implements OnInit {

  myJob: boolean;
  jobOwner: iUser = new iUser();
  myBidObject: iJobBid;
  deductionAmount: number;
  milestoneIndex: number;


  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
    public paymentService: PaymentsService,
  ) { }


  ngOnInit(): void {
    this.myBidObject = this.dataHelper.contractDetails || new iJobBid();
    if (!this.myBidObject.key) {
      this.router.navigate(['/my-orders']);
    } else {
      if (this.myBidObject.uid === this.userAuth.currentUser.uid) {
        this.myJob = false;
        this.jobOwner = this.dataHelper.allUsers[this.myBidObject.jobOwner];
      } else {
        this.myJob = true;
      }
    }
  }


  markMilestoneAsCompleted(index: number) {
    this.myBidObject.milestones[index].status = 'Completed';
    firebase.database().ref().child(`/bids/${this.myBidObject.key}/milestones`)
      .set(this.myBidObject.milestones).then(() => {
        this.sendMilestoneCompletionNotification();
        this.dataHelper.publishSomeData({ showSuccess: 'Request for milestone completion submitted!' });
      });
  }


  sendMilestoneCompletionNotification() {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = this.myBidObject.jobOwner;
    notificationObj.title = 'Milestone Complete Request';
    notificationObj.type = iStrings.MILESTONE_COMPLETED;
    notificationObj.jobKey = this.myBidObject.jobKey;
    this.dataHelper.sendNotification(this.myBidObject.jobOwner, notificationObj);
  }


  paidMilestones(): number {
    let paidPrice: number = 0;
    this.myBidObject.milestones.forEach(x => {
      paidPrice += (x.status === 'Paid') ? x.price : 0;
    });
    return paidPrice;
  }

  unpaidMilestones(): number {
    let unpaidPrice: number = 0;
    this.myBidObject.milestones.forEach(x => {
      unpaidPrice += (x.status === 'In Progress' || !x.status) ? x.price : 0;
    });
    return unpaidPrice;
  }

  navigateJobDetail() {
    this.dataHelper.postedJobDetail = this.myBidObject.jobDetails;
    this.router.navigate(['/job-detail/' + this.myBidObject.jobDetails.key]);
  }

  navigateMyJobDetail() {
    this.dataHelper.postedJobDetail = this.myBidObject.jobDetails;
    this.router.navigate(['/post-details/' + this.myBidObject.jobDetails.key]);
  }


  acceptDelivery(milestoneIndex: number) {
    this.milestoneIndex = milestoneIndex;
    if (this.myBidObject.milestones[milestoneIndex + 1]) {
      document.getElementById('openPaymentModal').click();
      this.deductionAmount = this.myBidObject.milestones[milestoneIndex + 1].price;
    } else {
      this.updateMilestoneStatus('accept', milestoneIndex);
    }
  }


  getPayDescription(): string {
    return this.userAuth.currentUser.email + ' ' + this.userAuth.currentUser.fullName +
      ', paid ' + this.myBidObject.uid + ' RM' + this.deductionAmount +
      ' on milestone completion for the job ' + this.myBidObject.jobKey;
  }


  confirmPayment(paymentObj: iPayment) {
    this.paymentService.confirmPayment(paymentObj, this.deductionAmount, this.getPayDescription())
      .then(() => {
        this.createTransactionNode(this.paymentService.paymentRef);
        this.updateMilestoneStatus('accept', this.milestoneIndex);
      });
  }


  updateMilestoneStatus(status: string, index: number) {
    if (status === 'accept') {
      this.confirmAcceptDelivery(index, status);
    } else {
      this.myBidObject.milestones[index].status = 'In Progress';
      this.saveOnFirebase(this.myBidObject, status);
    }
  }


  confirmAcceptDelivery(index: number, status: string) {
    this.myBidObject.milestones[index].status = 'Paid';
    if (this.myBidObject.milestones[index + 1]) {
      this.myBidObject.milestones[index + 1].status = 'In Progress';
    } else {
      this.markOverallJobAsPaid();
    }
    this.saveOnFirebase(this.myBidObject, status);
  }


  createTransactionNode(paymentRef: any) {
    const transaction = new iTransaction();
    transaction.paymentForAcceptJobProposal = true;
    transaction.transactionKey = firebase.database().ref().child('transactions').push().key;
    transaction.paymentFrom = localStorage.getItem('uid');
    transaction.workshopKey = null;
    transaction.hubId = null;
    transaction.jobKey = this.myBidObject.jobKey;
    transaction.paymentRef = paymentRef;
    transaction.timestamp = Number(new Date());
    transaction.amount = this.deductionAmount;
    firebase.database().ref().child(`/allTransactions/${transaction.transactionKey}`)
      .set(transaction).then(() => {
        document.getElementById('closePaymentModal').click();
        this.dataHelper.displayLoading = false;
      });
  }



  saveOnFirebase(bid: iJobBid, status: string) {
    firebase.database().ref().child(`/bids/${bid.key}/milestones`)
      .set(bid.milestones).then(() => {
        if (status === 'accept') {
          this.sendAcceptanceNotification(bid);
          this.dataHelper.publishSomeData({ showSuccess: 'Milestone paid!' });
        } else {
          this.sendRejectionNotification(bid);
          this.dataHelper.publishSomeData({ showSuccess: 'Milestone status updated!' });
        }
      });
  }


  markOverallJobAsPaid() {
    this.myBidObject.status = 'paid';
    this.myBidObject.completionDate = Number(new Date());

    firebase.database().ref().child(`/bids/${this.myBidObject.key}/completionDate`)
      .set(this.myBidObject.completionDate);

    firebase.database().ref().child(`/bids/${this.myBidObject.key}/status`)
      .set(this.myBidObject.status)
      .then(() => {
        this.sendJobPaidNotification();
      });
  }


  sendJobPaidNotification() {
    const notificationObj = new iPushNotification();
    notificationObj.jobKey = this.myBidObject.jobKey;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = this.myBidObject.uid;
    notificationObj.title = 'Job Completed';
    notificationObj.type = iStrings.JOB_PAID;
    this.dataHelper.sendNotification(this.myBidObject.uid, notificationObj);
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


  goToChat() {
    let chatNodeObj: iChatNode = new iChatNode();
    chatNodeObj.jobKey = this.myBidObject.jobKey;
    chatNodeObj.expertId = this.myBidObject.uid;
    chatNodeObj.clientId = this.myBidObject.jobOwner;
    chatNodeObj.agencyId = this.myBidObject.bidPerson.agencyId || null;
    this.dataHelper.chatNodeObj = chatNodeObj;
    this.router.navigate(['/chats']);
  }


}
