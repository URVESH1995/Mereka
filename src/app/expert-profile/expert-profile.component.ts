import { Component, OnInit, Input } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iAgency } from '../models/agency';
import { iUser, iExpertProfile, iLearnerProfile, iUserLocation } from '../models/user';
import { Router } from '@angular/router';
import { iChatNode } from '../models/chat-node';

@Component({
  selector: 'app-expert-profile',
  templateUrl: './expert-profile.component.html',
  styleUrls: ['./expert-profile.component.scss']
})
export class ExpertProfileComponent implements OnInit {

  learnerProfile: iLearnerProfile = new iLearnerProfile();
  myOwnProfile: boolean;
  @Input() hideHeaderFooter: boolean;
  @Input() expertProfile: iUser = new iUser();
  expertAgency: iAgency = new iAgency();
  activeTab: string = 'General Profile';
  tabButtons: string[] = ['General Profile', 'Portfolio', 'Jobs Accomplished', 'My Services'];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    if (this.expertProfile && this.expertProfile.myAgency) {
      this.expertAgency = this.dataHelper.allAgencies[this.expertProfile.uid] || {};
    } else if (this.expertProfile && this.expertProfile.agencyId) {
      this.expertAgency = this.dataHelper.allAgencies[this.expertProfile.agencyId] || {};
    }

    this.dataHelper.getObservable().subscribe(data => {
      if (data.allAgenciesFetched) {
        if (this.expertProfile && this.expertProfile.myAgency) {
          this.expertAgency = this.dataHelper.allAgencies[this.expertProfile.uid] || {};
        } else if (this.expertProfile && this.expertProfile.agencyId) {
          this.expertAgency = this.dataHelper.allAgencies[this.expertProfile.agencyId] || {};
        }
      }
    });

    if (this.expertProfile.uid === this.userAuth.currentUser.uid) {
      this.myOwnProfile = true
    }

    if (this.dataHelper.learnerProfile) {
      this.learnerProfile = this.dataHelper.learnerProfile;
    }

  }

  updateProfile() {
    if (this.userAuth.currentUser.expertProfile) {
      this.dataHelper.expertProfile = this.userAuth.currentUser.expertProfile;
    } else {
      this.dataHelper.expertProfile = new iExpertProfile();
    }
    this.router.navigate(['/expertise-details']);
  }

  goToChat() {
    let chatNodeObj: iChatNode = new iChatNode();
    chatNodeObj.jobKey = null; // CAN'T CHAT WITHOUT JOB KEY
    chatNodeObj.expertId = this.expertProfile.uid;
    chatNodeObj.clientId = this.userAuth.currentUser.uid;
    chatNodeObj.agencyId = this.expertProfile.agencyId || null;
    this.dataHelper.chatNodeObj = chatNodeObj;
    // this.router.navigate(['/chats']);
  }

  favUnfavExpert() {
    this.userAuth.favUnfavExpert(this.expertProfile.uid);
  }

  isFavExpert(): boolean {
    return this.userAuth.isMyFavExpert(this.expertProfile.uid);
  }


}
