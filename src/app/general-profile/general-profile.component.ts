import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iUser, iUserLocation } from '../models/user';
import { Router } from '@angular/router';
import *  as firebase from 'firebase';


@Component({
  selector: 'app-general-profile',
  templateUrl: './general-profile.component.html',
  styleUrls: ['./general-profile.component.scss']
})
export class GeneralProfileComponent implements OnInit {

  currentUser: iUser = new iUser();
  streetAddress: string;
  newFile: boolean;
  imagePath: any;
  userEmail: string;

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
  ) {
    if (!dataHelper.expertDetails) {
      router.navigate(['/home']);
    } else {
      this.currentUser = dataHelper.expertDetails;
    }
  }


  ngOnInit(): void {
    // this.currentUser = this.dataHelper.deepCloneData(this.userAuth.currentUser);
    // this.imagePath = this.currentUser.profileUrl || null;
    // this.userEmail = this.currentUser.email;
    // if (!this.currentUser.location) {
    //   this.currentUser.location = new iUserLocation();
    // }
  }


  invalidPhonePattern(): boolean {
    if (this.currentUser.phone && this.currentUser.phone.match(/^[0-9+]+$/) === null) {
      return true;
    }
    return false;
  }


  onChangeFile(event: EventTarget) {
    const self = this;
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    const selectedFileObject = files[0];
    self.newFile = true;
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      self.imagePath = event.target.result;
    });
    reader.readAsDataURL(selectedFileObject);
  }


  saveProfilePicture() {
    var self = this;
    self.dataHelper.displayLoading = true;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`profileImages/${filename}.jpg`);

    imageRef.putString(self.imagePath, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      firebase.storage().ref('profileImages/' + snapshot.metadata.name).getDownloadURL().then((url) => {
        self.currentUser.profileUrl = url;
        self.dataHelper.displayLoading = false;
        self.newFile = false;
        self.saveDataToFirebase();
      })
        .catch((e) => {
          self.dataHelper.displayLoading = false;
          self.dataHelper.publishSomeData({ showError: e.message });
        });
    })
      .catch((e) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }


  saveAndExit() {
    if (this.isRequiredFieldsAreFilled() && !this.invalidPhonePattern()) {
      this.newFile ? this.saveProfilePicture() : this.saveDataToFirebase();
    } else {
      this.dataHelper.publishSomeData({ showError: 'Invalid or missing required fields!' });
    }
  }


  isRequiredFieldsAreFilled(): boolean {
    let fieldsAreFilled: boolean;
    if (this.currentUser.fullName) {
      fieldsAreFilled = true;
    }
    return fieldsAreFilled;
  }


  saveDataToFirebase() {
    const self = this;
    self.checkIfFieldsAreFilled();
    self.currentUser.email = self.userEmail;
    firebase.database().ref().child(`/users/${self.currentUser.uid}`)
      .set(self.currentUser).then(() => {
        self.userAuth.currentUser = self.currentUser;
        self.checkIfNoLocationField();
        self.router.navigate(['/profile']);
        self.dataHelper.publishSomeData({ showSuccess: 'Profile saved successfully!' });
      });
  }


  checkIfNoLocationField() {
    // if (!this.currentUser.location.city && !this.currentUser.location.country &&
    //   !this.currentUser.location.stateProvince && !this.currentUser.location.streetAddress &&
    //   !this.currentUser.location.zipcode) {
    //   this.userAuth.currentUser.location = null;
    // }
  }


  checkIfFieldsAreFilled() {
    for (var key in this.currentUser.location) {
      if (!this.currentUser.location[key]) {
        this.currentUser.location[key] = null;
      }
    }
  }

}
