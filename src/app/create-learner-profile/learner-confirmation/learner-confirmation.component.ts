import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iLearnerProfile, iUser } from '../../models/user';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-learner-confirmation',
  templateUrl: './learner-confirmation.component.html',
  styleUrls: ['./learner-confirmation.component.scss']
})
export class LearnerConfirmationComponent implements OnInit {

  activeTab2: string = 'General Profile';
  tabButtons2: string[] = ['General Profile', 'My Background'];
  activeTab: string = 'Confirmation';
  tabButtons: any[] = [
    { title: 'Step 1: Personalize your page', navigatePage: 'create-learner-profile' },
    { title: 'Step 2: Set up your profile', navigatePage: 'setup-learner-profile' },
    { title: 'Confirmation', navigatePage: 'learner-confirmation' },
  ];

  currentUser: iUser = new iUser();
  learnerProfile: iLearnerProfile = new iLearnerProfile();

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    if (!this.userAuth.currentUser.learnerProfile) {
      this.router.navigate(['/create-learner-profile']);
    } else {
      this.getLearnerProfile();
    }
  }

  getLearnerProfile() {
    this.currentUser = this.dataHelper.deepCloneData(this.userAuth.currentUser);
    this.learnerProfile = this.currentUser.learnerProfile;
  }

  saveLearnerProfile() {
    firebase.database().ref().child(`/users/${this.currentUser.uid}`)
      .set(this.currentUser).then(() => {
        this.dataHelper.allUsers[this.currentUser.uid] = this.currentUser;
        this.dataHelper.publishSomeData({ showSuccess: 'Learner profile saved!' });
        this.router.navigate(['/learner-dashboard']);
      });
  }

  goBackToSetupProfile() {
    this.router.navigate(['/setup-learner-profile']);
    setTimeout(() => {
      this.dataHelper.publishSomeData({ updateSetupProfileTab: true });
    }, 200);
  }

}
