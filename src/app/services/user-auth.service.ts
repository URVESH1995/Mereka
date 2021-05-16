import { Injectable } from '@angular/core';
import { iUser } from '../models/user';
import { DataHelperService } from './data-helper.service';
import { Router } from '@angular/router';
import { iExperience } from '../models/experience';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  currentUser: iUser = new iUser();

  constructor(
    public router: Router,
    public dataHelper: DataHelperService
  ) {
    if (localStorage.getItem('userLoggedIn') === 'true') {
      this.currentUser = JSON.parse(localStorage.getItem('userData'));
      this.getCurrentUser();
    }
  }


  getCurrentUser() {
    const uid = localStorage.getItem('uid');
    firebase.database().ref().child(`/users/${uid}`)
      .on('value', (snapshot) => {
        this.currentUser = snapshot.val();
        this.dataHelper.allUsers[this.currentUser.uid] = this.currentUser;
        localStorage.setItem('userData', JSON.stringify(this.currentUser));
      });
  }


  public setUser(user: iUser) {
    localStorage.setItem('uid', user.uid);
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(user));
    this.currentUser = user;
    this.dataHelper.expertUserProfile = null;
    this.dataHelper.postedJobDetail = null;
    this.dataHelper.fetchAllData();
  }


  public logoutUser() {
    firebase.auth().signOut().then(() => {
      localStorage.clear();
      this.clearServiceData();
      this.dataHelper.publishSomeData({ showSuccess: 'User logged out!' });
      this.router.navigate(['/home']);
    });


    var ref1: any = firebase.database().ref('chats/').orderByChild('uid').equalTo(this.currentUser.uid);
    ref1.off('child_added');

    for (var i = 0, j = this.dataHelper.chatWithHubs.length; i < j; i++) {
      var ref: any = firebase.database().ref('chats/' + this.dataHelper.chatWithHubs[i].chatKey + "/messages");
      ref.off('child_added');
    }

    if(this.currentUser.myAgency || this.currentUser.agencyId) {

      if (this.currentUser.myAgency) {
        var ref3: any = firebase.database().ref('chats/').orderByChild('hubId').equalTo(this.currentUser.uid);
        ref3.off('child_added');
      } else {
        var ref3: any = firebase.database().ref('chats/').orderByChild('hubId').equalTo(this.currentUser.agencyId);
        ref3.off('child_added');
      }

      for (var i = 0, j = this.dataHelper.chatWithLearners.length; i < j; i++) {
        var ref: any = firebase.database().ref('chats/' + this.dataHelper.chatWithLearners[i].chatKey + "/messages");
        ref.off('child_added');
      }
    }
   
  }

  clearServiceData() {
    this.dataHelper.myAgency = null;
    this.dataHelper.createExperienceObj = null;
    this.dataHelper.myPostedJobs = [];
    this.dataHelper.expertUserProfile = null;
    this.dataHelper.expertDetails = null;
    this.dataHelper.expertProfile = null;
    this.dataHelper.postJobObj = null;
    localStorage.setItem('userLoggedIn', 'false');
    this.currentUser = new iUser();
  }


  favUnfavWorkshop(workshop: iExperience) {
    if (this.currentUser.uid) {
      if (!this.currentUser.favWorkshops) {
        this.currentUser.favWorkshops = [];
      }
      const index = this.currentUser.favWorkshops.indexOf(workshop.workshopKey);
      if (index >= 0) {
        this.currentUser.favWorkshops.splice(index, 1);
      } else {
        this.currentUser.favWorkshops.push(workshop.workshopKey);
      }
      firebase.database().ref().child(`/users/${this.currentUser.uid}/favWorkshops`)
        .set(this.currentUser.favWorkshops);
    }
  }

  isMyFavWorkshop(workshop: iExperience): boolean {
    return this.currentUser.favWorkshops && this.currentUser.favWorkshops.includes(workshop.workshopKey);
  }

  favUnfavAgency(hubOwnerUid: string) {
    if (this.currentUser.uid) {
      if (!this.currentUser.favHubs) {
        this.currentUser.favHubs = [];
      }
      const index = this.currentUser.favHubs.indexOf(hubOwnerUid);
      if (index >= 0) {
        this.currentUser.favHubs.splice(index, 1);
      } else {
        this.currentUser.favHubs.push(hubOwnerUid);
      }
      firebase.database().ref().child(`/users/${this.currentUser.uid}/favHubs`)
        .set(this.currentUser.favHubs);
    }
  }

  isMyFavAgency(hubOwnerUid: string): boolean {
    return this.currentUser.favHubs && this.currentUser.favHubs.includes(hubOwnerUid);
  }

  favUnfavExpert(expertUid: string) {
    if (this.currentUser.uid) {
      if (!this.currentUser.favExperts) {
        this.currentUser.favExperts = [];
      }
      const index = this.currentUser.favExperts.indexOf(expertUid);
      if (index >= 0) {
        this.currentUser.favExperts.splice(index, 1);
      } else {
        this.currentUser.favExperts.push(expertUid);
      }
      firebase.database().ref().child(`/users/${this.currentUser.uid}/favExperts`)
        .set(this.currentUser.favExperts);
    }
  }

  isMyFavExpert(expertUid: string): boolean {
    return this.currentUser.favExperts && this.currentUser.favExperts.includes(expertUid);
  }

}
