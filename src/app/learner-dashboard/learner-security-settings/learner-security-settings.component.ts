import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-learner-security-settings',
  templateUrl: './learner-security-settings.component.html',
  styleUrls: ['./learner-security-settings.component.scss']
})
export class LearnerSecuritySettingsComponent implements OnInit {

  oldPassword: string;
  newPassword: string;
  cNewPassword: string;

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
  ) { }

  ngOnInit(): void {
  }

  updatePassword() {
    const self = this;
    self.dataHelper.displayLoading = true;
    const email = self.userAuth.currentUser.email;
    firebase.auth().signInWithEmailAndPassword(email, self.oldPassword)
      .then(() => {
        firebase.auth().currentUser.updatePassword(self.newPassword).then(() => {
          firebase.database().ref().child(`/users/${self.userAuth.currentUser.uid}/passwordUpdatedOn`)
            .set(Number(new Date())).then(() => {
              self.dataHelper.displayLoading = false;
              self.userAuth.clearServiceData();
              self.router.navigate(['/home']);
              self.dataHelper.openSpecificModal('loginModalOpener');
              self.dataHelper.publishSomeData({ showSuccess: 'Password updated successfully, Login with new password!' });
            });
        })
          .catch((error) => {
            self.dataHelper.displayLoading = false;
            self.dataHelper.publishSomeData({ showError: error.message });
          });
      })
      .catch((error) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: error.message });
      });
  }

}
