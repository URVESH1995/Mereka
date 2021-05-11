import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../../services/data-helper.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { iChatNode } from '../../../models/chat-node';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hub-messages',
  templateUrl: './hub-messages.component.html',
  styleUrls: ['./hub-messages.component.scss']
})
export class HubMessagesComponent implements OnInit {

  agencyChats = [];
  clientChats = [];
  chatWithClients: Array<iChatNode> = [];
  chatWithExperts: Array<iChatNode> = [];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) {
    this.dataHelper.displayLoading = true;
  }

  ngOnInit(): void {
    this.getChatMessagesForHub();
  }

  getChatMessagesForHub() {
    const self = this;
    const myUid = this.userAuth.currentUser.uid;
    firebase.database().ref().child(`/chats/`)
      .orderByChild('agencyId').equalTo(myUid)
      .once('value', (snapshot) => {
        const data = snapshot.val();
        for (var key in data) {
          data[key].clientDetails = self.dataHelper.allUsers[data[key].clientId];
          data[key].expertDetails = self.dataHelper.allUsers[data[key].expertId];

          if (data[key].agencyId) {
            data[key].agencyDetails = this.dataHelper.allAgencies[data[key].agencyId];
          }

          const jobIndex = self.dataHelper.allJobs.findIndex(x => x.key === data[key].jobKey);
          data[key].jobDetails = self.dataHelper.allJobs[jobIndex];

          if (myUid === data[key].agencyId && data[key].clientId !== myUid) {
            self.chatWithClients.push(data[key]);
          } else if (myUid !== data[key].agencyId) {
            self.agencyChats.push(data[key]);
          }
        }
        self.sortChats();
      });
  }

  sortChats() {
    this.chatWithExperts = this.clientChats.concat(this.agencyChats).concat(this.chatWithExperts);
    this.chatWithClients.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    this.chatWithExperts.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    this.dataHelper.displayLoading = false;
  }

  chatDetails(chat: iChatNode, chatTab: string) {
    this.dataHelper.chatNodeObj = chat;
    this.dataHelper.activeChatTab = chatTab;
    this.router.navigate(['/chats']);
  }

}
