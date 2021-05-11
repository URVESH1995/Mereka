import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';

import * as firebase from 'firebase';
import { UserAuthService } from '../../services/user-auth.service';
import { iUser } from '../../models/user';

@Component({
  selector: 'app-pre-signup',
  templateUrl: './pre-signup.component.html',
  styleUrls: ['./pre-signup.component.scss']
})
export class PreSignupComponent implements OnInit {

  user: iUser = new iUser();

  constructor(
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit(): void {
  }

  continueWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();

    this.loginWithProvider(provider);
  }

  continueWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();

    this.loginWithProvider(provider);
  }

  loginWithProvider(provider) {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // The signed-in user info.
        var user = result.user;

        firebase.database().ref(`/users/${user.uid}/uid`)
          .once("value")
          .then(snapshot => {
            if (!snapshot.val()) {
              var data = {
                uid: user.uid,
                email: user.email,
                fullName: user.displayName,
                timestamp: Number(new Date())
              };

              this.saveDatatoUserTableAfterRegister(data, user.uid);
            } else {
              this.getUserData(user.uid);
            }
          });
      })
      .catch((error) => {
        var errorMessage = error.message;

        this.dataHelper.publishSomeData({ showError: errorMessage });
      });
  }

  saveDatatoUserTableAfterRegister(userData, uid: string) {
    const self = this;
    self.user.uid = uid;
    self.user.timestamp = Number(new Date());
    self.user = { ...self.user, ...userData, };
    firebase.database().ref().child(`/users/${uid}`)
      .set(self.user).then(() => {
        document.getElementById('closePreSignupModal').click();
        self.dataHelper.displayLoading = false;
        self.userAuth.setUser(self.user);
        self.dataHelper.publishSomeData({ showSuccess: 'Account Created Successfully!' });
      })
      .catch((e) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }

  getUserData(uid: string) {
    const self = this;
    firebase.database().ref().child('users/' + uid)
      .once('value', (snapshot) => {
        const user: iUser = snapshot.val();
        if (user) {
          self.dataHelper.displayLoading = false;
          self.userAuth.setUser(user);
          self.dataHelper.publishSomeData({ showSuccess: 'User Logged In' });
          document.getElementById('closePreSignupModal').click();
        } else {
          self.userAuth.logoutUser();
          self.dataHelper.displayLoading = false;
        }
      })
      .catch((e) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }

}
