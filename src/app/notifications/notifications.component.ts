import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { iPushNotification } from '../models/push-notification';
import { iStrings } from '../models/enums';
import { iExpertProfile } from '../models/user';
import * as firebase from 'firebase';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  loading: boolean;
  notifications: iPushNotification[] = [];

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) {
    if (!this.userAuth.currentUser.uid) {
      this.router.navigate(['/home']);
    } else {
      this.getUserNotifications();
      if (!this.dataHelper.dataFetching.allNotificationsFetched) {
        this.loading = true;
      }

      this.dataHelper.getObservable().subscribe(data => {
        if (data.allNotificationsFetched) {
          this.getUserNotifications();
          this.loading = false;
        }
      });
    }
  }


  ngOnInit(): void {
  }


  getUserNotifications() {
    this.notifications = this.dataHelper.allNotifications;
    this.notifications = this.notifications.concat(this.dataHelper.inviteNotifications);
    this.notifications.sort((a, b) => b.timestamp - a.timestamp);
  }


  createExpertProfile(notification: iPushNotification) {
    this.dataHelper.selectedHubId = notification.sender;
    if (this.userAuth.currentUser.expertProfile) {
      this.dataHelper.expertProfile = this.userAuth.currentUser.expertProfile;
    } else {
      this.dataHelper.expertProfile = new iExpertProfile();
    }
    this.router.navigate(['/expertise-details']);
  }


  getSenderImage(notification: iPushNotification): string {
    if (this.dataHelper.allUsers[notification.sender]) {
      return this.dataHelper.allUsers[notification.sender].profileUrl;
    }
  }


  getNotificationText(notification: iPushNotification): string {
    if (notification.type === iStrings.SEND_JOB_INVITE) {
      return this.sendJobInvitationTitle(notification);
    } else if (notification.type === iStrings.SUBMIT_JOB_BID) {
      return this.submitBidOnJobTitle(notification);
    } else if (notification.type === iStrings.JOB_COMPLETED) {
      return this.jobCompletionTitle(notification);
    } else if (notification.type === iStrings.ACCEPT_JOB_PROPOSAL) {
      return this.acceptJobPropsalTitle(notification);
    } else if (notification.type === iStrings.REJECT_JOB_PROPOSAL) {
      return this.rejectJobPropsalTitle(notification);
    } else if (notification.type === iStrings.WORKSHOP_BOOKED) {
      return this.workshopBookedTitle(notification);
    } else if (notification.type === iStrings.INVITED_TO_AGENCY) {
      return this.invitedToAgencyTitle(notification);
    } else if (notification.type === iStrings.REMOVE_FROM_HUB) {
      return this.removeFromHubTitle(notification);
    } else if (notification.type === iStrings.WORKSHOP_RATED) {
      return this.workshopRatedTitle(notification);
    } else if (notification.type === iStrings.VERIFIED_EXPERT) {
      return this.verifiedExpertTitle(notification);
    } else if (notification.type === iStrings.NON_VERIFIED_EXPERT) {
      return this.nonVerifiedExpertTitle(notification);
    } else if (notification.type === iStrings.HUB_JOIN_ACCEPTANCE) {
      return this.hubJoinedTitle(notification);
    } else if (notification.type === iStrings.HUB_JOIN_REJECTION) {
      return this.hubJoinedRejectTitle(notification);
    } else if (notification.type === iStrings.HUB_LEFT) {
      return this.hubLeftTitle(notification);
    } else if (notification.type === iStrings.JOB_PAID) {
      return this.jobPaidTitle(notification);
    } else if (notification.type === iStrings.JOB_REJECTED) {
      return this.jobRejectionTitle(notification);
    } else if (notification.type === iStrings.MILESTONE_COMPLETED) {
      return this.milestoneCompletionRequest(notification);
    } else if (notification.type === iStrings.MILESTONE_REVERTED) {
      return this.milestoneRejectedTitle(notification);
    } else if (notification.type === iStrings.MILESTONE_PAID) {
      return this.milestonePaidTitle(notification);
    } else if (notification.type === iStrings.BECAME_HUB_MEMBER) {
      return this.acceptedToJoinHubTitle(notification);
    }
  }


  sendJobInvitationTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} invited you to their job: ${this.getJob(notification)}.`;
    return returnString;
  }

  submitBidOnJobTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} submitted a job proposal: ${this.getJob(notification)}.`;
    return returnString;
  }

  jobCompletionTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} completed your job: ${this.getJob(notification)}.`;
    return returnString;
  }

  acceptJobPropsalTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} accepted your job propsal: ${this.getJob(notification)}.`;
    return returnString;
  }

  rejectJobPropsalTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} rejected your job propsal: ${this.getJob(notification)}.`;
    return returnString;
  }

  workshopBookedTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} booked your workshop: ${this.getWorkshop(notification)}.`;
    return returnString;
  }

  invitedToAgencyTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} invited you to their hub: ${this.getAgency(notification.sender)}.`;
    return returnString;
  }

  removeFromHubTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} removed you from their hub: ${this.getAgency(notification.sender)}.`;
    return returnString;
  }

  acceptedToJoinHubTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} accepted your request to join hub: ${this.getAgency(notification.sender)}.`;
    return returnString;
  }

  workshopRatedTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} rated your workshop: ${this.getWorkshop(notification)}.`;
    return returnString;
  }

  verifiedExpertTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `Congratulations! You are now a verified expert.`;
    return returnString;
  }

  nonVerifiedExpertTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `Improve your profile and try re-submitting.`;
    return returnString;
  }

  hubJoinedTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} joined your hub: ${this.getAgency(notification.receiver)}.`;
    return returnString;
  }

  hubJoinedRejectTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} declined your request to join their hub: ${this.getAgency(notification.sender)}.`;
    return returnString;
  }

  hubLeftTitle(notification: iPushNotification): string {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} has left your hub: ${this.getAgency(notification.receiver)}.`;
    return returnString;
  }

  getJob(notification: iPushNotification): string {
    const job = this.dataHelper.allJobs.filter(x => x.key === notification.jobKey);
    if (job && job[0]) {
      return job[0].jobTitle || 'N/A';
    } else {
      return 'N/A';
    }
  }

  getSenderName(notification: iPushNotification): string {
    if (this.dataHelper.allUsers[notification.sender]) {
      return this.dataHelper.allUsers[notification.sender].fullName;
    } else {
      return 'N/A';
    }
  }

  getAgency(uid: string) {
    if (this.dataHelper.allUsers[uid]) {
      return this.dataHelper.allUsers[uid].myAgency || 'N/A';
    } else {
      return 'N/A';
    }
  }

  getWorkshop(notification: iPushNotification) {
    const workshop = this.dataHelper.allWorkshopList.filter(x => x.workshopKey === notification.workshopKey);
    if (workshop && workshop[0]) {
      return workshop[0].experienceTitle || 'N/A';
    } else {
      return 'N/A';
    }
  }

  jobPaidTitle(notification: iPushNotification) {
    let returnString = '';
    returnString = `Congratulations! ${this.getSenderName(notification)} marked your job as completed: ${this.getJob(notification)}.`;
    return returnString;
  }

  jobRejectionTitle(notification: iPushNotification) {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} rejected your job completion request for: ${this.getJob(notification)}.`;
    return returnString;
  }

  milestoneCompletionRequest(notification: iPushNotification) {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} completed milestone for the job: ${this.getJob(notification)}.`;
    return returnString;
  }

  milestoneRejectedTitle(notification: iPushNotification) {
    let returnString = '';
    returnString = `${this.getSenderName(notification)} rejected your milestone completion request for the job: ${this.getJob(notification)}.`;
    return returnString;
  }

  milestonePaidTitle(notification: iPushNotification) {
    let returnString = '';
    returnString = `Congratulations! ${this.getSenderName(notification)} marked your milestone as completed for the job: ${this.getJob(notification)}.`;
    return returnString;
  }

  // ====== NOTIFICATION DETAILS METHODS

  notificationDetails(notification: iPushNotification) {
    if (notification.jobKey) {
      this.getJobDetails(notification);
    } else if (notification.workshopKey) {
      this.getWorkshopDetails(notification);
    } else if (notification.type === iStrings.VERIFIED_EXPERT ||
      notification.type === iStrings.NON_VERIFIED_EXPERT) {
      if (this.userAuth.currentUser.expertProfile) {
        this.dataHelper.expertProfile = this.userAuth.currentUser.expertProfile;
        this.router.navigate(['/expertise-details']);
      } else {
        this.router.navigate(['/home']);
      }
    } else {
      this.getHubExpertDetails(notification);
    }
  }


  getJobDetails(notification: iPushNotification) {
    const job = this.dataHelper.allJobs.filter(x => x.key === notification.jobKey);
    if (job && job[0]) {
      this.dataHelper.postedJobDetail = job[0];
      if (job[0].uid === this.userAuth.currentUser.uid) {
        this.router.navigate(['/post-details/' + notification.jobKey]);
      } else {
        this.router.navigate(['/job-detail/' + notification.jobKey]);
      }
    } else {
      this.dataHelper.publishSomeData({ showError: 'Job does not exist any more!' });
    }
  }


  getWorkshopDetails(notification: iPushNotification) {
    const workshop = this.dataHelper.allWorkshopList.filter(x => x.workshopKey === notification.workshopKey);
    if (workshop && workshop[0]) {
      this.dataHelper.workshopDetail = workshop[0];
      this.router.navigate(['/workshop-details/' + notification.workshopKey]);
    } else {
      this.dataHelper.publishSomeData({ showError: 'Workshop does not exist any more!' });
    }
  }


  getHubExpertDetails(notification: iPushNotification) {
    if (this.dataHelper.allUsers[notification.sender] &&
      this.dataHelper.allUsers[notification.sender].experexpertProfile) {
      this.router.navigate(['/agency-profile/' + notification.sender]);
    } else if (this.dataHelper.allUsers[notification.sender]) {
      this.dataHelper.learnerProfile = this.dataHelper.allUsers[notification.sender].learnerProfile;
      this.router.navigate(['/learner-profile']);
    }
  }


  removeNotification(index: number) {
    const notificationKey = this.notifications[index].key;
    this.notifications.splice(index, 1);
    const indx = this.dataHelper.allNotifications.findIndex(x => x.key === notificationKey);
    const ind = this.dataHelper.inviteNotifications.findIndex(x => x.key === notificationKey);
    if (indx >= 0) {
      firebase.database().ref()
        .child(`/notifications/${this.userAuth.currentUser.uid}/${notificationKey}`)
        .remove().then(() => {
          this.dataHelper.allNotifications.splice(indx, 1);
        });
    } else if (ind >= 0) {
      firebase.database().ref()
        .child(`/inviteExpertNotifications/${notificationKey}`)
        .remove().then(() => {
          this.dataHelper.inviteNotifications.splice(indx, 1);
        });
    }
  }


}
