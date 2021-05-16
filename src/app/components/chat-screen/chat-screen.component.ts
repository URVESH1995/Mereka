import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { iChatNode } from '../../models/chat-node';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { iChatMessage } from '../../models/chat-message';
import * as firebase from 'firebase';
import { iChat } from 'src/app/models/chats';
import { iUser } from 'src/app/models/user';
import { iAgency } from 'src/app/models/agency';


@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss']
})
export class ChatScreenComponent implements OnInit {

  @ViewChild('chatMessagesContainer') chatMessagesContainer;

  chatMessages: iChatMessage[] = [];
  newMessage: iChatMessage = new iChatMessage();
  selectedFiles: any[] = [];

  userInfo: iUser = new iUser();
  hubInfo: iAgency = new iAgency();

  constructor(
    public zone: NgZone,
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }


  ngOnInit(): void {
    this.getChatMessages(this.dataHelper.activeChat);

    this.dataHelper.getObservable().subscribe(data => {
      if (data.activeChatUpdated) {
        this.getChatMessages(this.dataHelper.activeChat);
      }
    });
  }


  getChatMessages(chat: iChat) {
    if (chat && chat.chatKey) {
      const self = this;
      if (this.dataHelper.activeChat.uid === this.userAuth.currentUser.uid) {
        if (this.dataHelper.allAgencies[this.dataHelper.activeChat.hubId]) {
          this.hubInfo = this.dataHelper.allAgencies[this.dataHelper.activeChat.hubId];
        } else {
          this.hubInfo = new iAgency();
        }
      } else {
        if (this.dataHelper.allUsers[this.dataHelper.activeChat.uid]) {
          this.userInfo = this.dataHelper.allUsers[this.dataHelper.activeChat.uid];
        } else {
          this.userInfo = new iUser();
        }
      }
      
      self.chatMessages = [];
    
      for(var key in self.dataHelper.activeChat.messages) {
        self.chatMessages.push(self.dataHelper.activeChat.messages[key]) ;
      }
      self.chatMessages.sort((x, y) => x.timestamp - y.timestamp );
      self.scrollToBottom();
     
    }
  }


  scrollToBottom() {
    if (this.chatMessagesContainer) {
      setTimeout(() => {
        let element = this.chatMessagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight - element.clientHeight;
      }, 500);
    }
  }


  getRecepientName() {
    if (this.dataHelper.activeChat.uid === this.userAuth.currentUser.uid) {
      return this.hubInfo.agencyName;
    } else {
      return this.userInfo.fullName;
    }
  }


  getRecepientLocation() {
    if (this.dataHelper.activeChat.uid === this.userAuth.currentUser.uid && this.hubInfo.location) {
      return this.hubInfo.location.city + ' , ' + this.hubInfo.location.country;
    } else if (this.userInfo.location) {
      return this.userInfo.location.location;
    }
    return '';
  }


  getSenderFullName(message: iChatMessage): string {
    return this.dataHelper.allUsers[message.senderId].fullName;
  }


  getSenderProfileUrl(message: iChatMessage): string {
    return this.dataHelper.allUsers[message.senderId].profileUrl;
  }

  onChangeFile(event: EventTarget) {
    this.selectedFiles = [];
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    for (var a = 0; a < files.length; a++) {
      if (files[a].size <= 100000000) {
        this.selectedFiles.push(files[a]);
      }
    }
    this.saveAttachedFiles(this.selectedFiles[0], 0);
  }


  saveAttachedFiles(file: File, index: number) {
    const self = this;
    self.dataHelper.displayLoading = true;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000) + '.' + file.name.split('.').pop();
    const uploadTask = storageRef.child('chatDocuments/' + filename).put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => { },
      (error) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: error.message });
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          self.newMessage.attachedFile = {
            name: file.name,
            url: downloadURL
          };
          self.saveMessageToFirebase();
          if (index === self.selectedFiles.length - 1) {
            self.dataHelper.displayLoading = false;
          } else {
            self.saveAttachedFiles(self.selectedFiles[index + 1], index + 1);
          }
        })
          .catch((e) => {
            self.dataHelper.displayLoading = false;
            self.dataHelper.publishSomeData({ showError: e.message });
          });
      });
  }


  sendNewMessage() {
    if (!this.newMessage.message.trim()) {
      return;
    }
    this.saveMessageToFirebase();
  }

  saveMessageToFirebase() {
    const self = this;
    self.dataHelper.activeChat.messages = {};
    self.newMessage.timestamp = Number(new Date());
    self.newMessage.senderId = self.userAuth.currentUser.uid;
    self.dataHelper.activeChat.lastEdit = self.newMessage.timestamp;
    self.dataHelper.activeChat.lastMessage = self.newMessage.message || 'Attachment';
    self.newMessage.key = firebase.database().ref().child(`chats`).push().key;
    self.dataHelper.activeChat.messages[self.newMessage.key] = self.newMessage;

    self.chatMessages.forEach(x => {
      self.dataHelper.activeChat.messages[x.key] = x;
    });

    firebase.database().ref().child(`chats/${self.dataHelper.activeChat.chatKey}`)
      .set(self.dataHelper.activeChat).then(() => {
        self.dataHelper.publishSomeData({ sortActiveChats: self.newMessage.timestamp });
        self.newMessage = new iChatMessage();
      });
  }

}
