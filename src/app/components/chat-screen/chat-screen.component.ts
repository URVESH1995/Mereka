import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { iChatNode } from '../../models/chat-node';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { iChatMessage } from '../../models/chat-message';
import * as firebase from 'firebase';


@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss']
})
export class ChatScreenComponent implements OnInit {

  @ViewChild('chatMessagesContainer') chatMessagesContainer;

  @Input() activeChat: iChatNode = new iChatNode();
  chatMessages: iChatMessage[] = [];
  newMessage: iChatMessage = new iChatMessage();
  selectedFiles: any[] = [];

  constructor(
    public zone: NgZone,
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }


  ngOnInit(): void {
    this.getChatMessages(this.activeChat);

    this.dataHelper.getObservable().subscribe(data => {
      if (data.toggleActiveChat) {
        this.getChatMessages(data.toggleActiveChat);
      }
    });
  }


  getChatMessages(chat: iChatNode) {
    if (chat && chat.chatKey) {
      const self = this;
      self.chatMessages = [];
      self.activeChat.messages = {};

      firebase.database().ref().child(`chats/${chat.chatKey}/messages`)
        .on('child_added', (snapshot) => {
          self.zone.run(() => {
            self.chatMessages.push(snapshot.val());
            self.chatMessages = self.chatMessages.filter((thing, index, self) =>
              index === self.findIndex((t) => (
                t.key === thing.key
              ))
            )
          });
          self.chatMessages.sort((a, b) => a.timestamp - b.timestamp);
          self.scrollToBottom();
        });
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
    if (this.activeChat.clientId === this.userAuth.currentUser.uid) {
      return this.activeChat.expertDetails.fullName;
    } else {
      return this.activeChat.clientDetails.fullName;
    }
  }


  getRecepientLocation() {
    if (this.activeChat.clientId === this.userAuth.currentUser.uid) {
      return this.activeChat.expertDetails.location ? this.activeChat.expertDetails.location.country : 'N/A';
    } else {
      return this.activeChat.clientDetails.location ? this.activeChat.clientDetails.location.country : 'N/A';
    }
  }


  getSenderFullName(message: iChatMessage): string {
    return this.dataHelper.allUsers[message.senderId].fullName;
  }


  getSenderProfileUrl(message: iChatMessage): string {
    return this.dataHelper.allUsers[message.senderId].profileUrl;
  }


  jobDetails() {
    if (this.activeChat.jobDetails.uid === this.userAuth.currentUser.uid) {
      this.dataHelper.postedJobDetail = this.activeChat.jobDetails;
      this.router.navigate(['/post-details/' + this.activeChat.jobDetails.key]);
    } else {
      this.dataHelper.postedJobDetail = this.activeChat.jobDetails;
      this.router.navigate(['/job-detail/' + this.activeChat.jobDetails.key]);
    }
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
    self.activeChat.messages = {};
    self.newMessage.timestamp = Number(new Date());
    self.newMessage.senderId = self.userAuth.currentUser.uid;
    self.activeChat.lastMessageTimestamp = self.newMessage.timestamp;
    self.activeChat.lastMessage = self.newMessage.message || 'Attachment';
    self.newMessage.key = firebase.database().ref().child(`chats`).push().key;
    self.activeChat.messages[self.newMessage.key] = self.newMessage;

    self.chatMessages.forEach(x => {
      self.activeChat.messages[x.key] = x;
    });

    firebase.database().ref().child(`chats/${self.activeChat.chatKey}`)
      .set(self.activeChat).then(() => {
        self.dataHelper.publishSomeData({ sortActiveChats: self.newMessage.timestamp });
        self.newMessage = new iChatMessage();
      });
  }


}
