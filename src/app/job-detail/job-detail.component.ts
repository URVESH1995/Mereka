import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iPostJob } from '../models/post-job';
import * as firebase from 'firebase';
import { iUser } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { iJobBid } from '../models/job-bid';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {

  loading: boolean;
  jobDetail: iPostJob;
  milestoneTypeBid: boolean;
  jobOwner: iUser = new iUser();
  myBidObject: iJobBid;
  imageFormats: string[] = ['PNG', 'png', 'jpg', 'JPG', 'jpeg', 'JPEG'];

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) {
  }


  ngOnInit(): void {
    this.jobDetail = this.dataHelper.postedJobDetail || new iPostJob();
    if (this.jobDetail.key) {
      this.jobOwner = this.dataHelper.allUsers[this.jobDetail.uid];
      this.getMyBidOnThisJob();
    } else if (!this.jobDetail.key && this.activeRoute.snapshot.params.key) {
      this.getPostedJobDetails(this.activeRoute.snapshot.params.key);
    } else if (!this.jobDetail.key && !this.activeRoute.snapshot.params.key) {
      this.router.navigate(['/home']);
    }
  }


  getPostedJobDetails(jobKey: string) {
    const self = this;
    self.loading = true;
    firebase.database().ref().child(`/jobs/${jobKey}`)
      .once('value', (snapshot) => {
        self.loading = false;
        self.jobDetail = snapshot.val();
        if (!self.jobDetail) {
          self.router.navigate(['/home']);
        } else {
          self.jobOwner = self.dataHelper.allUsers[self.jobDetail.uid];
          this.getMyBidOnThisJob();
        }
      });
  }


  getMyBidOnThisJob() {
    const self = this;
    firebase.database().ref().child(`/bids/`)
      .orderByChild('jobKey').equalTo(self.jobDetail.key)
      .once('value', (snapshot) => {
        const allBids = snapshot.val();
        if (allBids) {
          for (var key in allBids) {
            const bid: iJobBid = allBids[key];
            if (bid.uid === this.userAuth.currentUser.uid) {
              bid.key = key;
              bid.bidPerson = self.dataHelper.allUsers[bid.uid];
              bid.jobDetails = self.jobDetail;
              self.myBidObject = bid;
            }
          }
        }
      });
  }


  getJobImage(job: iPostJob): string {
    let imageUrl: string;
    if (job.fileUrls) {
      job.fileUrls.forEach(x => {
        if (this.imageFormats.includes(x.name.split('.').pop())) {
          imageUrl = x.url;
        }
      });
    }
    return imageUrl;
  }


  userDetails() {
    this.dataHelper.expertDetails = this.jobOwner;
    this.router.navigate(['/expert-profile/' + this.jobOwner.uid]);
  }


  alreadyBidSubmitted(): boolean {
    const uid = this.userAuth.currentUser.uid;
    return this.jobDetail.bids && this.jobDetail.bids.includes(uid);
  }


  imHired(): boolean {
    const uid = this.userAuth.currentUser.uid;
    return this.jobDetail.hired && this.jobDetail.hired.includes(uid);
  }


  iamPartOfHub(): boolean {
    if (this.userAuth.currentUser.myAgency || this.userAuth.currentUser.agencyId) {
      return true;
    }
    return false;
  }


  contractDetails() {
    if (this.myBidObject.type === 'milestone') {
      this.dataHelper.contractDetails = this.myBidObject;
      this.router.navigate(['/job-milestones']);
    } else {
      const activeTab = 'hire-me';
      this.router.navigate(['/my-orders/' + activeTab]);
    }
  }


  submitBid() {
    if (!this.userAuth.currentUser.isExpert) {
      this.dataHelper.publishSomeData({ showError: 'You need to complete your expert profile!' });
      return;
    }
    this.router.navigate(['/active-job-detail/' + this.jobDetail.key]);
  }


}
