import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iLearnerProfile, iUser } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-learner-profile',
  templateUrl: './learner-profile.component.html',
  styleUrls: ['./learner-profile.component.scss']
})
export class LearnerProfileComponent implements OnInit {

  myOwnProfile: boolean;
  userProfile: iUser = new iUser();
  learnerProfile: iLearnerProfile = new iLearnerProfile();
  activeTab: string = 'General Profile';
  tabButtons: string[] = ['General Profile', 'My Background'];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    if (this.dataHelper.learnerProfile) {
      this.learnerProfile = this.dataHelper.learnerProfile;
      this.userProfile = this.dataHelper.allUsers[this.learnerProfile.uid];
      this.myOwnProfile = this.userProfile.uid === this.userAuth.currentUser.uid;
    } else {
      this.router.navigate(['/home']);
    }
  }

  editLearnerProfile() {
    this.router.navigate(['/create-learner-profile']);
  }

}
