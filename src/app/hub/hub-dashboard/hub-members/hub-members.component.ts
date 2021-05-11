import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../../services/data-helper.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { iPushNotification } from '../../../models/push-notification';
import { iAgency, iAgencyMembers } from '../../../models/agency';
import { iUser } from '../../../models/user';
import { iStrings } from '../../../models/enums';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-hub-members',
  templateUrl: './hub-members.component.html',
  styleUrls: ['./hub-members.component.scss']
})
export class HubMembersComponent implements OnInit {

  activeMember: string;
  myAgency: iAgency = new iAgency();
  memberRequests: iUser[] = [];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.myAgency = this.dataHelper.myAgency;
    this.getMembers();
  }

  getMembers() {
    if (this.myAgency.memberRequests) {
      this.myAgency.memberRequests.forEach(x => {
        if (this.dataHelper.allUsers[x]) {
          this.memberRequests.push(this.dataHelper.allUsers[x]);
        }
      });
    }

    if (this.myAgency.agencyMembers) {
      this.myAgency.agencyMembers.forEach((x, index) => {
        if (this.dataHelper.allUsers[x.uid]) {
          this.myAgency.agencyMembers[index].profile = this.dataHelper.allUsers[x.uid];
        }
      });
    } else {
      this.myAgency.agencyMembers = [];
    }
  }

  acceptRequest(learnerUid: string, arrIndex: number) {
    this.dataHelper.displayLoading = true;
    const index = this.myAgency.memberRequests.indexOf(learnerUid);
    this.myAgency.memberRequests.splice(index, 1);
    const hubMember = new iAgencyMembers();
    hubMember.uid = learnerUid;
    hubMember.profile = this.dataHelper.allUsers[learnerUid];
    hubMember.joinDate = Number(new Date());
    this.myAgency.agencyMembers.push(hubMember);

    const updates = {};
    updates[`/users/${learnerUid}/agencyId`] = this.myAgency.expertUid;
    updates[`/agencies/${this.myAgency.expertUid}/agencyMembers`] = this.myAgency.agencyMembers;
    updates[`/agencies/${this.myAgency.expertUid}/memberRequests`] = this.myAgency.memberRequests;
    firebase.database().ref().update(updates)
      .then(() => {
        this.memberRequests.splice(arrIndex, 1);
        this.sendHubJoinAcceptanceNotificationToLearner(learnerUid);
        this.dataHelper.displayLoading = false;
        this.dataHelper.publishSomeData({ showSuccess: 'Member joined successfully!' });
      });
  }

  rejectRequest(learnerUid: string, arrIndex: number) {
    const index = this.myAgency.memberRequests.indexOf(learnerUid);
    this.myAgency.memberRequests.splice(index, 1);
    firebase.database().ref().child(`/agencies/${this.myAgency.expertUid}/memberRequests`)
      .set(this.myAgency.memberRequests).then(() => {
        this.memberRequests.splice(arrIndex, 1);
        this.sendRejectionNotification(learnerUid);
        this.dataHelper.publishSomeData({ showSuccess: 'Member join request rejected!' });
      });
  }

  sendHubJoinAcceptanceNotificationToLearner(learnerUid: string) {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = learnerUid;
    notificationObj.title = 'Hub Member';
    notificationObj.type = iStrings.BECAME_HUB_MEMBER;
    notificationObj.agencyUid = this.myAgency.expertUid;
    this.dataHelper.sendNotification(learnerUid, notificationObj);
  }

  sendRejectionNotification(learnerUid: string) {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = learnerUid;
    notificationObj.title = 'Hub Join Request';
    notificationObj.type = iStrings.HUB_JOIN_REJECTION;
    notificationObj.agencyUid = this.myAgency.expertUid;
    this.dataHelper.sendNotification(learnerUid, notificationObj);
  }

  removeMemberFromHub() {
    const updates = {};
    const index = this.myAgency.agencyMembers.findIndex(x => x.uid === this.activeMember);
    this.myAgency.agencyMembers.splice(index, 1);
    updates[`/users/${this.activeMember}/agencyId`] = null;
    updates[`/agencies/${this.myAgency.expertUid}/agencyMembers`] = this.myAgency.agencyMembers;
    firebase.database().ref().update(updates)
      .then(() => {
        this.sendHubMemberRemovalNotification();
      });
  }

  sendHubMemberRemovalNotification() {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = this.activeMember;
    notificationObj.title = 'Hub Membership Removed';
    notificationObj.type = iStrings.REMOVE_FROM_HUB;
    notificationObj.agencyUid = this.myAgency.expertUid;
    this.dataHelper.sendNotification(this.activeMember, notificationObj);
  }

  learnerDetails(learner: iUser) {
    this.dataHelper.learnerProfile = learner.learnerProfile;
    this.router.navigate(['/learner-profile']);
  }

}
