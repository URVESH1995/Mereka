import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { iAgency } from '../../models/agency';

@Component({
  selector: 'app-expert-profile-confirmation',
  templateUrl: './expert-profile-confirmation.component.html',
  styleUrls: ['./expert-profile-confirmation.component.scss']
})
export class ExpertProfileConfirmationComponent implements OnInit {

  activeTab: string = 'Confirmation';
  tabButtons: any[] = [
    { title: 'Your Expertise', navigatePage: 'expertise-details' },
    { title: 'Profile Page', navigatePage: 'expert-overview' },
    { title: 'Your Details', navigatePage: 'expert-portfolios' },
    { title: 'Confirmation', navigatePage: 'expert-profile-confirmation' },
  ];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit(): void {
    if (!this.dataHelper.expertProfile) {
      this.router.navigate(['/add-service']);
    }
    if (!this.allFilled()) {
      this.router.navigate(['/expertise-details']);
    }
  }

  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

  allFilled(): boolean {
    let dataFilled: boolean
    if (this.userAuth.currentUser.expertProfile && this.userAuth.currentUser.expertProfile.expertise
      && this.userAuth.currentUser.expertProfile.hourlyRate && this.userAuth.currentUser.expertProfile.languages
      && this.userAuth.currentUser.expertProfile.overview && this.userAuth.currentUser.expertProfile.portfolio) {
      dataFilled = true;
    }
    return dataFilled;
  }

  saveExpertProfile() {
    this.userAuth.currentUser.expertProfile = this.dataHelper.expertProfile;
    firebase.database().ref().child(`/users/${this.userAuth.currentUser.uid}`)
      .set(this.userAuth.currentUser).then(() => {
        this.autoJoinInvitedHub();
        this.dataHelper.expertProfile = null;
        this.dataHelper.publishSomeData({ showSuccess: 'Expert profile saved!' });
        this.router.navigate(['/home']);
      });
  }

  saveAndExit() {
    this.autoJoinInvitedHub();
    this.dataHelper.saveExpertProfileNode(this.userAuth.currentUser);
  }

  autoJoinInvitedHub() {
    if (this.dataHelper.selectedHubId && !this.userAuth.currentUser.agencyId && !this.userAuth.currentUser.myAgency) {
      this.userAuth.currentUser.agencyId = this.dataHelper.selectedHubId;
      firebase.database().ref().child(`/agencies/${this.dataHelper.selectedHubId}`)
        .once('value', (snapshot) => {
          const agencyData: iAgency = snapshot.val();
          const index = agencyData.expertsInvitations.findIndex(x => x === this.userAuth.currentUser.email);
          if (index >= 0) {
            agencyData.expertsInvitations.splice(index, 1);
          }
          const temp = {
            inviteDate: Number(new Date()),
            role: 'Expert',
            uid: this.userAuth.currentUser.uid,
            profile: this.userAuth.currentUser
          }
          agencyData.experts.push(temp);
          this.updateDataOnFirebase(agencyData);
        });
    }
  }

  updateDataOnFirebase(agencyData: iAgency) {
    firebase.database().ref().child(`/users/${this.userAuth.currentUser.uid}/agencyId`)
      .set(this.dataHelper.selectedHubId);
    firebase.database().ref().child(`/agencies/${agencyData.expertUid}`)
      .set(agencyData).then(() => {
        this.dataHelper.allAgencies[this.dataHelper.selectedHubId] = agencyData;
      });
  }


}