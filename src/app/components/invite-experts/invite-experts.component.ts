import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { iAgency } from '../../models/agency';
import * as firebase from 'firebase';

@Component({
  selector: 'app-invite-experts',
  templateUrl: './invite-experts.component.html',
  styleUrls: ['./invite-experts.component.scss']
})
export class InviteExpertsComponent implements OnInit {

  myAgency: iAgency;
  inviteEmail: string;
  inviteMails: string[] = [];

  constructor(
    public dataHelper: DataHelperService,
  ) { }

  ngOnInit(): void {
  }

  pushInviteMail() {
    this.inviteMails.push(this.inviteEmail);
    this.inviteEmail = null;
  }

  removeMail(index: number) {
    this.inviteMails.splice(index, 1);
  }

  inviteExpertToHub() {
    this.myAgency = this.dataHelper.myAgency;
    if (!this.myAgency.experts) {
      this.myAgency.experts = [];
    } if (!this.myAgency.expertsInvitations) {
      this.myAgency.expertsInvitations = [];
    }

    this.inviteMails = this.inviteMails.filter(x => x);
    const myUid = localStorage.getItem('uid');
    this.inviteMails.forEach(x => {
      const alreadyExpertIndex = this.myAgency.experts.findIndex(obj => obj.uid === x);
      const expertIndex = this.myAgency.expertsInvitations.indexOf(x);
      if (alreadyExpertIndex < 0 && expertIndex < 0) {
        this.myAgency.expertsInvitations.push(x);
        firebase.database().ref().child(`/agencies/${myUid}`)
          .set(this.myAgency).then(() => {
            this.dataHelper.sendHubJoinNotification(x);
          });
      }
    });
    document.getElementById('closeInviteExpertModal').click();
    this.inviteMails = [];
    this.dataHelper.publishSomeData({ showSuccess: 'Expert(s) invited to the Hub successfully!' });
  }

  updateInvitesArray(e: any, index: number) {
    this.inviteMails[index] = e.target.value;
  }

}
