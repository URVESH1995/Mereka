import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iPostJob } from '../models/post-job';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { iJobBid } from '../models/job-bid';
import { iUser } from '../models/user';
import { iExpertise } from '../models/user';
import { UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  jobDetails: iPostJob;
  loading: boolean;
  pendingBids: iJobBid[] = [];
  acceptedBids: iJobBid[] = [];
  completedBids: iJobBid[] = [];
  bidsFetched: boolean;
  bestMatchExperts: iUser[] = [];

  constructor(
    public router: Router,
    public zone: NgZone,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) {
    if (!userAuth.currentUser.uid) {
      router.navigate(['/home']);
    }
  }


  ngOnInit(): void {
    this.jobDetails = this.dataHelper.postedJobDetail || new iPostJob();
    if (this.jobDetails.key) {
      this.getBidsOnThisJob();
    } else if (!this.jobDetails.key && this.activeRoute.snapshot.params.key) {
      this.getPostedJobDetails(this.activeRoute.snapshot.params.key);
    } else if (!this.jobDetails.key && !this.activeRoute.snapshot.params.key) {
      this.router.navigate(['/my-orders']);
    }
  }


  getPostedJobDetails(jobKey: string) {
    const self = this;
    self.loading = true;
    firebase.database().ref().child(`/jobs/${jobKey}`)
      .once('value', (snapshot) => {
        self.jobDetails = snapshot.val();
        if (!self.jobDetails) {
          self.loading = false;
          self.router.navigate(['/my-orders']);
        } else {
          this.dataHelper.postedJobDetail = this.jobDetails;
          self.getBidsOnThisJob();
        }
      });
  }


  getBidsOnThisJob() {
    const self = this;
    self.loading = true;
    firebase.database().ref().child(`/bids/`)
      .orderByChild('jobKey').equalTo(self.jobDetails.key)
      .once('value', (snapshot) => {
        const allBids = snapshot.val();
        if (allBids) {
          self.zone.run(() => {
            for (var key in allBids) {
              const bid: iJobBid = allBids[key];
              bid.key = key;
              bid.bidPerson = self.dataHelper.allUsers[bid.uid];
              bid.jobDetails = self.jobDetails;
              if (!bid.status) {
                self.pendingBids.push(bid);
              } else if (bid.status === 'accepted') {
                self.acceptedBids.push(bid);
              } else if (bid.status === 'completed' || bid.status === 'paid') {
                self.completedBids.push(bid);
              }
            }
            self.getBestMatchExperts();
            self.bidsFetched = true;
            self.loading = false;
          });
        } else {
          self.loading = false;
        }
      });
  }


  getBestMatchExperts() {
    const users = this.dataHelper.allUsers;
    const myUid = this.userAuth.currentUser.uid;
    for (var key in users) {
      const user: iUser = users[key];
      if (user.uid !== myUid && user.isExpert && user.expertProfile && user.expertProfile.expertise
        && this.isAnyCategoryMatched(user.expertProfile.expertise)) {
        this.bestMatchExperts.push(user);
      }
    }
  }


  isAnyCategoryMatched(expertise: iExpertise): boolean {
    let categoryMatched: boolean;
    categoryMatched = expertise.title === this.jobDetails.category;
    return categoryMatched;
  }


  getExpertAgency(expert: iUser): string {
    return this.dataHelper.getExpertAgency(expert);
  }


  inviteToJob(expert: iUser) {
    if (!this.jobDetails.invites) {
      this.jobDetails.invites = [];
    }
    this.jobDetails.invites.push(expert.uid);
    this.dataHelper.inviteExpertToJob(expert, this.jobDetails);
  }


  alreadyInvitedOrApplied(expert: iUser): boolean {
    let inviteable: boolean = true;
    if ((this.jobDetails.invites && this.jobDetails.invites.includes(expert.uid)) ||
      (this.jobDetails.hired && this.jobDetails.hired.includes(expert.uid)) ||
      (this.jobDetails.bids && this.jobDetails.bids.includes(expert.uid))) {
      inviteable = false;
    }
    return inviteable;
  }


  userDetails(expert: iUser) {
    this.dataHelper.expertDetails = expert;
    this.router.navigate(['/expert-profile/' + expert.uid]);
  }


  inviteExpert(expert: iUser) {
    this.dataHelper.inviteExpertToAgency(expert);
  }


  getAllSkills(expert: iUser): string[] {
    let skills: string[] = [];
    skills = expert.expertProfile.expertise.skills;
    return skills;
  }


}
