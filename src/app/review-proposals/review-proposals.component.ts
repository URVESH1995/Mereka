import { Component, OnInit, Input, NgZone } from '@angular/core';
import { iPostJob } from '../models/post-job';
import { iJobBid } from '../models/job-bid';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import *  as firebase from 'firebase';
import { iUser } from '../models/user';
import { Router } from '@angular/router';
import { iPushNotification } from '../models/push-notification';
import { iStrings } from '../models/enums';

@Component({
  selector: 'app-review-proposals',
  templateUrl: './review-proposals.component.html',
  styleUrls: ['./review-proposals.component.scss']
})
export class ReviewProposalsComponent implements OnInit {

  @Input() public jobDetails: iPostJob;
  @Input() public jobBidsList: iJobBid[];
  bidDetails: iJobBid;


  constructor(
    public zone: NgZone,
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }


  ngOnInit(): void {
  }


  getExpertSkills(expert: iUser) {
    let skills = [];
    if (expert.expertProfile) {
      skills = expert.expertProfile.expertise.skills;
    }
    return skills;
  }


  proposalDetails(bid: iJobBid) {
    this.bidDetails = bid;
  }


  expertDetails() {
    this.dataHelper.expertDetails = this.bidDetails.bidPerson;
    this.router.navigate(['/expert-profile/' + this.bidDetails.uid]);
  }


  acceptRejectProposal(bid: iJobBid, status: string) {
    const self = this;
    if (status === 'rejected') {
      bid.status = status;
      firebase.database().ref().child(`/bids/${bid.key}/status`)
        .set(status).then(() => {
          self.sendProposalRejectionNotification(bid);
          self.dataHelper.publishSomeData({ showSuccess: `Proposal ${status} successfully!` });
          if (document.getElementById('closeModalBtn')) {
            document.getElementById('closeModalBtn').click();
          }
        });
    } else {
      if (document.getElementById('closeModalBtn')) {
        document.getElementById('closeModalBtn').click();
      }
      if (self.jobDetails.teamSize === 'One Expert/Agency') {
        if (self.jobDetails.hired && self.jobDetails.hired.length) {
          self.dataHelper.publishSomeData({ showError: 'You cannot hire more than one hub!' });
        } else {
          self.goToPayment(bid);
        }
      } else {
        self.goToPayment(bid);
      }
    }
  }


  sendProposalRejectionNotification(bid: iJobBid) {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = bid.uid;
    notificationObj.title = 'Job Proposal Rejected';
    notificationObj.type = iStrings.REJECT_JOB_PROPOSAL;
    notificationObj.jobKey = this.jobDetails.key;
    this.dataHelper.sendNotification(bid.uid, notificationObj);
  }


  goToPayment(bid: iJobBid) {
    this.dataHelper.acceptJobProposalBid = bid;
    this.dataHelper.payableMilestoneIndex = 0;
    this.dataHelper.bookWorkshopQty = 0;
    this.dataHelper.workshopDetail = null;
    this.router.navigate(['/payment']);
  }


}
