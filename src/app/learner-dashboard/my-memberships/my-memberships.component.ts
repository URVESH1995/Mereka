import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iAgency } from '../../models/agency';
import { iUser } from '../../models/user';
import * as firebase from 'firebase';
import { iPushNotification } from '../../models/push-notification';
import { iStrings } from '../../models/enums';

@Component({
  selector: 'app-my-memberships',
  templateUrl: './my-memberships.component.html',
  styleUrls: ['./my-memberships.component.scss']
})
export class MyMembershipsComponent implements OnInit {

  myAgency: iAgency;
  agencyOwner: string;
  myOwnAgency: boolean;
  joinedDate: number;
  currentUser = new iUser();

  constructor(
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userAuth.currentUser;
    const agencyId = this.currentUser.agencyId || this.currentUser.uid;
    this.myAgency = this.dataHelper.allAgencies[agencyId];
    if (this.myAgency) {
      if (!this.myAgency.agencyMembers) {
        this.myAgency.agencyMembers = [];
      }
      if (!this.myAgency.experts) {
        this.myAgency.experts = [];
      }
      this.agencyOwner = this.dataHelper.allUsers[this.myAgency.expertUid].fullName;
      this.myOwnAgency = this.myAgency.expertUid === this.currentUser.uid;
      this.joinedDate = this.myOwnAgency ? this.myAgency.timestamp : this.getMyInviteDate();
    }
  }

  getMyInviteDate(): number {
    const joinDate = this.myAgency.agencyMembers.filter(x => x.uid === this.currentUser.uid);
    if (joinDate && joinDate[0]) {
      return joinDate[0].joinDate;
    } else {
      const joinDate = this.myAgency.experts.filter(x => x.uid === this.currentUser.uid);
      if (joinDate && joinDate[0]) {
        return joinDate[0].inviteDate;
      }
    }
  }

  leaveHub() {
    const updates = {};
    this.currentUser.agencyId = null;
    this.currentUser.myAgency = null;
    const index = this.myAgency.experts.findIndex(x => x.uid === this.currentUser.uid);
    if (index >= 0) {
      this.myAgency.experts.splice(index, 1);
    } else {
      const index = this.myAgency.agencyMembers.findIndex(x => x.uid === this.currentUser.uid);
      this.myAgency.agencyMembers.splice(index, 1);
    }
    this.dataHelper.allAgencies[this.myAgency.expertUid] = this.myAgency;
    updates[`/agencies/${this.myAgency.expertUid}/experts`] = this.myAgency.experts;
    updates[`/agencies/${this.myAgency.expertUid}/agencyMembers`] = this.myAgency.agencyMembers;
    updates[`/users/${this.currentUser.uid}`] = this.currentUser;
    firebase.database().ref().update(updates).then(() => {
      this.sendHubLeftNotification();
      this.dataHelper.publishSomeData({ showSuccess: 'Hub left!' });
    });
  }

  sendHubLeftNotification() {
    const notificationObj = new iPushNotification();
    notificationObj.agencyUid = this.myAgency.expertUid;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = this.myAgency.expertUid;
    notificationObj.title = 'Hub Left';
    notificationObj.type = iStrings.HUB_LEFT;
    this.dataHelper.sendNotification(this.myAgency.expertUid, notificationObj);
    this.myAgency = null;
  }

}
