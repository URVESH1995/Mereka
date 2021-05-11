import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-learner-notify-settings',
  templateUrl: './learner-notify-settings.component.html',
  styleUrls: ['./learner-notify-settings.component.scss']
})
export class LearnerNotifySettingsComponent implements OnInit {

  myUid: string;
  mySettings: any = {};
  emailFreq: string[] = ['Daily', 'Weekly', 'Monthly'];

  constructor(
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit(): void {
    this.myUid = this.userAuth.currentUser.uid;
    this.mySettings = this.dataHelper.notificationSettings[this.myUid] || {};
  }

  updateSettings() {
    this.dataHelper.notificationSettings[this.myUid] = this.mySettings;
    firebase.database().ref().child(`/notificationSettings/${this.myUid}`).set(this.mySettings);
  }

}
