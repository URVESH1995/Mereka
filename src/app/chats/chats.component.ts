import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import { iChatNode } from '../models/chat-node';
import { iUser } from '../models/user';
import * as firebase from 'firebase';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  loading: boolean;
  currentUser: iUser;
  activeChatsTab: string = 'clientsTab';

  chatWithClients: Array<iChatNode> = [];
  chatWithExperts: Array<iChatNode> = [];

  agencyChats = [];
  clientChats = [];
  dataFetched: boolean;

  activeChat: iChatNode = new iChatNode();

  constructor(
    public zone: NgZone,
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) {
    dataHelper.getObservable().subscribe(data => {
      if (data.sortActiveChats) {
        this.soortActiveChats(data.sortActiveChats);
      }
    });
  }


  ngOnInit(): void {
    if (localStorage.getItem('userLoggedIn') === 'true') {
      this.currentUser = this.userAuth.currentUser;
      this.loading = true;
      if (this.dataHelper.dataFetching.allJobsFetched) {
        this.getAllChats();
      }

      this.dataHelper.getObservable().subscribe(data => {
        if (data.allJobsFectchedInService) {
          this.getAllChats();
        }
      });
    } else {
      this.router.navigate(['/home']);
    }
  }


  getAllChats() {
    this.agencyChats = [];
    this.clientChats = [];
    this.chatWithClients = [];
    this.chatWithExperts = [];

    this.getChatsAsExpert();
    this.getChatsAsClient().then(() => {
      if (this.currentUser.isExpert && this.currentUser.myAgency) {
        this.getChatsAsAgency().then(() => {
          this.concatenateChats();
        });
      } else {
        this.concatenateChats();
      }
    });
  }


  concatenateChats() {
    this.loading = false;
    this.dataFetched = true;
    this.chatWithExperts = this.clientChats.concat(this.agencyChats).concat(this.chatWithExperts);

    if (this.dataHelper.chatNodeObj) {
      this.checkIfChatAlreadyExists();
    } else {
      if (!this.chatWithClients.length && this.chatWithExperts.length) {
        this.activeChatsTab = 'expertsTab';
      }
      this.sortChats();
    }
  }


  checkIfChatAlreadyExists() {
    const chatNode = this.dataHelper.chatNodeObj;
    let chatAlreadyFound: boolean;

    this.chatWithClients.forEach(x => {
      if (x.jobKey === chatNode.jobKey && x.clientId === chatNode.clientId
        && x.expertId === chatNode.expertId) {
        chatAlreadyFound = true;
        this.activeChatsTab = 'clientsTab';
        this.activeChat.lastMessageTimestamp = Number(new Date());
      }
    });
    this.chatWithExperts.forEach(x => {
      if (x.jobKey === chatNode.jobKey && x.clientId === chatNode.clientId
        && x.expertId === chatNode.expertId) {
        chatAlreadyFound = true;
        this.activeChatsTab = 'expertsTab';
        this.activeChat.lastMessageTimestamp = Number(new Date());
      }
    });

    if (!chatAlreadyFound) {
      chatNode.chatKey = firebase.database().ref().child('chats').push().key;
      chatNode.clientDetails = this.dataHelper.allUsers[chatNode.clientId];
      chatNode.expertDetails = this.dataHelper.allUsers[chatNode.expertId];

      if (chatNode.agencyId) {
        chatNode.agencyDetails = this.dataHelper.allAgencies[chatNode.agencyId];
      }

      chatNode.lastMessageTimestamp = Number(new Date());
      const jobIndex = this.dataHelper.allJobs.findIndex(x => x.key === chatNode.jobKey);
      chatNode.jobDetails = this.dataHelper.allJobs[jobIndex];
      this.activeChat = chatNode;

      if (chatNode.clientId === this.userAuth.currentUser.uid) {
        this.activeChatsTab = 'expertsTab';
        this.chatWithExperts.push(chatNode);
      } else {
        this.activeChatsTab = 'clientsTab';
        this.chatWithClients.push(chatNode);
      }
    }

    this.sortChats();
  }


  sortChats() {
    if (this.dataHelper.chatNodeObj) {
      this.activeChatsTab = this.dataHelper.activeChatTab;
      if (this.activeChatsTab === 'clientsTab') {
        const index = this.chatWithClients.findIndex(x => x.chatKey === this.dataHelper.chatNodeObj.chatKey);
        if (index >= 0) {
          this.chatWithClients[index].lastMessageTimestamp = Number(new Date());
        }
      } else {
        const index = this.chatWithExperts.findIndex(x => x.chatKey === this.dataHelper.chatNodeObj.chatKey);
        if (index >= 0) {
          this.chatWithExperts[index].lastMessageTimestamp = Number(new Date());
        }
      }
    }

    this.chatWithClients.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    this.chatWithExperts.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    if (this.activeChatsTab === 'expertsTab') {
      this.activeChat = this.chatWithExperts[0];
    } else {
      this.activeChat = this.chatWithClients[0];
    }

    this.dataHelper.chatNodeObj = null;
  }


  getChatsAsAgency() {
    if (this.currentUser.isExpert && this.currentUser.myAgency) {
      const self = this;
      return firebase.database().ref().child('chats')
        .orderByChild('agencyId').equalTo(self.currentUser.uid)
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

            if (this.currentUser.uid === data[key].agencyId && data[key].clientId !== this.currentUser.uid) {
              self.chatWithClients.push(data[key]);
            } else if (this.currentUser.uid !== data[key].agencyId) {
              self.agencyChats.push(data[key]);
            }
          }
        });
    }
  }


  getChatsAsClient() {
    const self = this;
    return firebase.database().ref().child('chats')
      .orderByChild('clientId').equalTo(self.currentUser.uid)
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
          self.clientChats.push(data[key]);
        }
      });
  }


  getChatsAsExpert() {
    if (this.currentUser.isExpert) {
      const self = this;
      firebase.database().ref().child('chats')
        .orderByChild('expertId').equalTo(self.currentUser.uid)
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
            self.chatWithClients.push(data[key]);
          }
        });
    }
  }


  soortActiveChats(lastMessageTimestamp: number) {
    if (this.activeChat) {
      this.activeChat.lastMessageTimestamp = lastMessageTimestamp;
      this.chatWithClients.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
      this.chatWithExperts.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    }
  }


  deleteChat(i: number) {
    if (this.activeChatsTab === 'clientsTab') {
      console.log('Del Chat Key:', this.chatWithClients[i].chatKey);
    } else {
      console.log('Del Chat Key:', this.chatWithClients[i].chatKey);
    }
  }


  toggleChatTabs(activeTab: string) {
    this.activeChatsTab = activeTab;
    if (activeTab === 'clientsTab') {
      this.toggleActiveChat(this.chatWithClients[0]);
    } else {
      this.toggleActiveChat(this.chatWithExperts[0]);
    }
  }


  toggleActiveChat(chat: iChatNode) {
    this.activeChat = chat || new iChatNode();
    this.dataHelper.publishSomeData({ toggleActiveChat: this.activeChat });
  }


  ngOnDestroy() {
    this.dataHelper.chatNodeObj = null;
  }

}
