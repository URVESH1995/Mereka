import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-learner-privacy-settings',
  templateUrl: './learner-privacy-settings.component.html',
  styleUrls: ['./learner-privacy-settings.component.scss']
})
export class LearnerPrivacySettingsComponent implements OnInit {

  myUid: string;
  mySettings: any = {};

  constructor(
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit(): void {
    this.myUid = this.userAuth.currentUser.uid;
    this.mySettings = this.dataHelper.privacySettings[this.myUid] || {};
  }

  updateSettings() {
    this.dataHelper.privacySettings[this.myUid] = this.mySettings;
    firebase.database().ref().child(`/privacySettings/${this.myUid}`).set(this.mySettings);
  }

}
