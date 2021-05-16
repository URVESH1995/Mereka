import { Component, OnInit, NgZone, Self } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import { iChat } from '../models/chats';
import { iUser } from '../models/user';
import * as firebase from 'firebase';
import { jitOnlyGuardedExpression } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  loading: boolean;
  currentUser: iUser;
  activeChatsTab: string = 'hubsTab';
  chatWithLearners: Array<iChat> = [];
  chatWithHubs: Array<iChat> = [];
  //activeChat: iChat = new iChat();
  dataFetched: boolean = false;

  constructor(
    public zone: NgZone,
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }


  ngOnInit(): void {
    if (localStorage.getItem('userLoggedIn') === 'true') {
      this.currentUser = this.userAuth.currentUser;
      //this.loading = true;
      this.getChatsData()
      this.dataHelper.getObservable().subscribe(data => {
        if (data.myChatFetched) {
          this.getChatsData()
        }
      });

    } else {
      this.router.navigate(['/home']);
    }
  }

  getChatsData() {
    var self = this;
    self.chatWithHubs = [];
    self.chatWithLearners = [];
    if (self.dataHelper.chatWithLearners) {
      self.chatWithLearners = JSON.parse(JSON.stringify(self.dataHelper.chatWithLearners));
      self.chatWithLearners.sort((x, y) => y.lastEdit - x.lastEdit);

      for (var i=0, j=self.chatWithLearners.length ; i<j; i++ ) {
        this.getLatestChatMessages(self.chatWithLearners[i]);
      }
    } if (self.dataHelper.chatWithHubs) {
      self.chatWithHubs = JSON.parse(JSON.stringify(self.dataHelper.chatWithHubs));
      self.chatWithHubs.sort((x, y) => y.lastEdit - x.lastEdit );

      for (var i=0, j=self.chatWithHubs.length ; i<j; i++ ) {
        this.getLatestChatMessages(self.chatWithHubs[i]);
      }

    }
    self.getActiveChatData();
  }

  getActiveChatData() {
    var self = this;
  
    this.activeChatsTab = 'learnerTab';
    if (self.dataHelper.selectedHubId && self.chatWithHubs && self.chatWithHubs[0] ) {
      self.dataHelper.activeChat = self.chatWithHubs.find(obj => obj.hubId == self.dataHelper.selectedHubId) || new iChat();
    } else if (!self.dataHelper.selectedHubId && self.chatWithHubs && self.chatWithHubs[0]) {
      self.dataHelper.activeChat = JSON.parse(JSON.stringify(self.chatWithHubs[0]));
    } else if (!self.dataHelper.selectedHubId && self.chatWithLearners && self.chatWithLearners[0]) {
      self.dataHelper.activeChat = JSON.parse(JSON.stringify(self.chatWithLearners[0]));
      this.activeChatsTab = 'hubsTab';
    }
    if (self.dataHelper.selectedHubId && (!self.dataHelper.activeChat || !self.dataHelper.activeChat.chatKey)) {
      this.dataHelper.activeChat.chatKey = firebase.database().ref().child('chats').push().key;
      this.dataHelper.activeChat.hubId = this.dataHelper.selectedHubId;
      this.dataHelper.activeChat.uid = this.currentUser.uid;
    }
    this.dataFetched = true;
   // this.dataHelper.publishSomeData({ toggleActiveChat: this.dataHelper.activeChat });
    self.dataHelper.publishSomeData({ activeChatUpdated: true });
  }

  getLatestChatMessages(chatData:iChat) {
    var self = this;
    firebase.database().ref("chats/" + chatData.chatKey + "/messages")
      .orderByChild('timestamp').startAt(Date.now())
      .on("child_added", function (snapshot) {
        self.zone.run(() => {
        var msg = snapshot.val();
          if(!chatData.messages[snapshot.key] ) {
            chatData.lastEdit = msg.timestamp;
            chatData.lastMessage = msg.message;
            chatData.messages[snapshot.key] = msg;
            self.chatWithHubs.sort((x, y) => y.lastEdit - x.lastEdit );
            self.chatWithLearners.sort((x, y) => y.lastEdit - x.lastEdit );
          } if(chatData.chatKey == self.dataHelper.activeChat.chatKey) {
            self.dataHelper.activeChat = JSON.parse(JSON.stringify(chatData));
            self.dataHelper.publishSomeData({ activeChatUpdated: true });
          }
        });
      });
  }

  getHubName(id , check) {
    if (this.dataHelper.allAgencies[id]) {
      if(check=='name') {
        return this.dataHelper.allAgencies[id].agencyName;
      } else {
        return this.dataHelper.allAgencies[id].agencyLogo;
      }
    }
    return '';
  }

  getUserName(uid, check) {
    if (this.dataHelper.allUsers[uid]) {
      if(check=='name') {
        return this.dataHelper.allUsers[uid].fullName;
      } else {
        return this.dataHelper.allUsers[uid].profileUrl;
      }
    }
    return '';
  }

  deleteChat(i: number) {
    if (this.activeChatsTab === 'hubsTab') {
      console.log('Del Chat Key:', this.chatWithLearners[i].chatKey);
    } else {
      console.log('Del Chat Key:', this.chatWithLearners[i].chatKey);
    }
  }


  toggleChatTabs(activeTab: string) {
    this.activeChatsTab = activeTab;
    if (activeTab === 'hubsTab') {
      this.toggleActiveChat(this.chatWithLearners[0]);
    } else {
      this.toggleActiveChat(this.chatWithHubs[0]);
    }
  }


  toggleActiveChat(chat: iChat) {
    this.dataHelper.activeChat = chat || new iChat();
    this.dataHelper.publishSomeData({ activeChatUpdated: true });
  }

  ngOnDestroy() {
    this.dataHelper.chatNodeObj = null;
  }

}
