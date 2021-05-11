import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iPostJob } from '../models/post-job';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { iJobBid } from '../models/job-bid';
import { iUser } from '../models/user';
import { iChatNode } from '../models/chat-node';
import { iPushNotification } from '../models/push-notification';
import { iStrings } from '../models/enums';
import * as firebase from 'firebase';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  public activeUserRole: string = 'Learner';
  myPostedJobs: iPostJob[] = [];
  displayPostedJobs: iPostJob[] = [];
  activeIndex: number;
  loading: boolean;

  statusFilter: string = 'All Postings';
  contractStatus: string = 'All Contracts';
  contractFilters: string[] = ['All Contracts', 'Ongoing Contracts', 'Completed Contracts']
  suggestedFilters: string[] = ['All Postings', 'Still Open', 'Closed'];
  imageFormats: string[] = ['PNG', 'png', 'jpg', 'JPG', 'jpeg', 'JPEG'];

  myContracts: iJobBid[] = [];
  displayContracts: iJobBid[] = [];
  searchContractQuery: string;
  myInvitaions: iPostJob[] = [];
  searchInvitesQuery: string = '';
  searchFields: any = ['jobTitle', 'jobType'];
  activeTab: string;

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public zone: NgZone,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) {
    if (!this.userAuth.currentUser.uid) {
      this.router.navigate(['/home']);
    } else {
      this.dataHelper.postedJobDetail = null;
      this.getJobsIamHiredIn();
      this.getMyInvitations();
      this.applyFilter();
    }
  }


  ngOnInit(): void {
    if (!this.dataHelper.dataFetching.postedJobsFetched) {
      this.loading = true;
    }

    if (this.activeRoute.snapshot.params.tab) {
      this.activeTab = 'hireme';
    }

    this.dataHelper.getObservable().subscribe((data) => {
      if (data.myPostedJobsFetched) {
        this.applyFilter();
      } else if (data.allJobsFectchedInService) {
        this.getJobsIamHiredIn();
        this.getMyInvitations();
      }
    });
  }


  getJobsIamHiredIn() {
    const self = this;
    self.loading = true;
    const uid = self.userAuth.currentUser.uid;
    firebase.database().ref().child(`/bids/`)
      .orderByChild('uid').equalTo(uid)
      .once('value', (snapshot) => {
        const myAllBids = snapshot.val();
        if (myAllBids) {
          self.zone.run(() => {
            self.displayContracts = [];
            self.myContracts = [];
            for (var key in myAllBids) {
              const bid: iJobBid = myAllBids[key];
              if (bid.status === 'accepted' || bid.status === 'completed' || bid.status === 'paid') {
                bid.key = key;
                bid.ownerProfile = self.dataHelper.allUsers[bid.jobOwner];
                bid.bidPerson = self.userAuth.currentUser;
                bid.jobDetails = self.dataHelper.allJobs.filter(x => x.key === bid.jobKey)[0];
                self.displayContracts.push(bid);
                self.myContracts.push(bid);
              }
            }
            self.loading = false;
          });
        } else {
          self.loading = false;
        }
      });
  }


  getMyInvitations() {
    const uid = this.userAuth.currentUser.uid;
    this.myInvitaions = this.dataHelper.allJobs.filter(x => x.invites && x.invites.includes(uid));
  }


  updateJobStatus(status: string, job: iPostJob) {
    const index = this.displayPostedJobs.findIndex(x => x.key === job.key);
    if (status === 'Open') {
      job.status = null;
      this.displayPostedJobs[index].status = null;
    } else {
      job.status = 'Closed';
      this.displayPostedJobs[index].status = 'Closed';
    }
    firebase.database().ref().child(`/jobs/${job.key}/status`).set(job.status);
  }


  completeJob(bid: iJobBid) {
    bid.status = 'completed';
    bid.completionDate = Number(new Date());
    firebase.database().ref().child(`/bids/${bid.key}/completionDate`).set(bid.completionDate);
    firebase.database().ref().child(`/bids/${bid.key}/status`)
      .set(bid.status).then(() => {
        this.sendNotification(bid);
        this.dataHelper.publishSomeData({ showSuccess: 'Job completed successfully!' });
      });
  }


  sendNotification(bid: iJobBid) {
    const notificationObj = new iPushNotification();
    notificationObj.jobKey = bid.jobKey;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = bid.jobOwner;
    notificationObj.title = 'Request for Job Completion';
    notificationObj.type = iStrings.JOB_COMPLETED;
    this.dataHelper.sendNotification(bid.jobOwner, notificationObj);
  }


  getJobImage(job: iPostJob): string {
    let imageUrl: string = '/assets/imgs/notify-img.PNG';
    if (job.fileUrls) {
      job.fileUrls.forEach(x => {
        if (this.imageFormats.includes(x.name.split('.').pop())) {
          imageUrl = x.url;
        }
      });
    }
    return imageUrl;
  }


  applyFilter() {
    this.zone.run(() => {
      this.myPostedJobs = this.dataHelper.myPostedJobs;

      if (this.statusFilter === 'Still Open') {
        this.displayPostedJobs = this.myPostedJobs.filter(x => !x.status);
      } else if (this.statusFilter === 'Closed') {
        this.displayPostedJobs = this.myPostedJobs.filter(x => x.status === 'Closed');
      } else {
        this.displayPostedJobs = this.myPostedJobs;
      }

      this.loading = false;
      this.displayPostedJobs.sort((a, b) => b.timestamp - a.timestamp);
    });
  }


  applyContractsFilter() {
    this.zone.run(() => {
      if (this.contractStatus === 'Ongoing Contracts') {
        this.displayContracts = this.myContracts.filter(x => x.status === 'accepted');
      } else if (this.contractStatus === 'Completed Contracts') {
        this.displayContracts = this.myContracts.filter(x => x.status === 'completed' || x.status === 'paid');
      } else {
        this.displayContracts = this.myContracts;
      }
      this.loading = false;
      this.displayContracts.sort((a, b) => b.timestamp - a.timestamp);
    });
  }


  contractMilestones(contract: iJobBid) {
    this.dataHelper.contractDetails = contract;
    this.router.navigate(['/job-milestones']);
  }


  jobDetails(job: iPostJob) {
    this.dataHelper.postedJobDetail = job;
    this.router.navigate(['/post-details/' + job.key]);
  }


  othersJobDetails(job: iPostJob) {
    this.dataHelper.postedJobDetail = job;
    this.router.navigate(['/job-detail/' + job.key]);
  }


  removeJob(job: iPostJob) {
    this.activeIndex = this.displayPostedJobs.findIndex(x => x.key === job.key);
  }


  alreadyBidSubmitted(jobDetail: iPostJob): boolean {
    const uid = this.userAuth.currentUser.uid;
    return jobDetail.bids && jobDetail.bids.includes(uid);
  }


  removePostedJob() {
    const self = this;
    const job = self.displayPostedJobs[self.activeIndex];
    firebase.database().ref().child(`/jobs/${job.key}`)
      .remove().then(() => {
        self.dataHelper.publishSomeData({ showSuccess: 'Job removed successfully!' });
      });
  }


  chatWithClient(jobContract: iJobBid) {
    let chatNodeObj: iChatNode = new iChatNode();
    chatNodeObj.jobKey = jobContract.jobKey;
    chatNodeObj.expertId = this.userAuth.currentUser.uid;
    chatNodeObj.clientId = jobContract.jobOwner;
    chatNodeObj.agencyId = this.userAuth.currentUser.agencyId || null;
    this.dataHelper.chatNodeObj = chatNodeObj;
    this.router.navigate(['/chats']);
  }


  postNewJob() {
    this.dataHelper.isEditJob = false;
    this.dataHelper.postJobObj = new iPostJob();
    this.router.navigate(['/post-job']);
  }


  editJob(job: iPostJob) {
    this.dataHelper.isEditJob = true;
    this.dataHelper.postJobObj = job;
    this.router.navigate(['/post-job']);
  }


  jobOwnerDetails(jobOwner: iUser) {
    this.dataHelper.expertDetails = jobOwner;
    this.router.navigate(['/expert-profile/' + jobOwner.uid]);
  }


  searchContracts() {
    this.displayContracts = this.myContracts.filter(x =>
      x.jobDetails.jobTitle.toLowerCase().match(this.searchContractQuery.toLowerCase())
    );
  }


}
