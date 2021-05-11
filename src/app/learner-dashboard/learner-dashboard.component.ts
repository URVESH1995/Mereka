import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iLearnerProfile } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-learner-dashboard',
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.scss']
})
export class LearnerDashboardComponent implements OnInit {

  learnerProfile = new iLearnerProfile();
  activeTab: string = 'My Interests';
  sideMenuItems: string[] = ['Edit Profile', 'My Interests', 'My Memberships', 'Notifications',
    'Transaction History', 'Billing Information', 'Privacy', 'Security'];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.learnerProfile = this.userAuth.currentUser.learnerProfile || new iLearnerProfile();
    if (!this.learnerProfile.uid) {
      this.router.navigate(['/create-learner-profile']);
    }
  }

  switchMenu(menu: string) {
    if (menu === 'Edit Profile') {
      this.dataHelper.learnerProfile = this.userAuth.currentUser.learnerProfile;
      this.router.navigate(['/learner-profile']);
    } else {
      this.activeTab = menu;
    }
  }

}
