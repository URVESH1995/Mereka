import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  email: string;

  constructor(
    public dataHelper: DataHelperService
  ) { }


  ngOnInit(): void {
  }


  resetPassword() {
    const self = this;
    self.dataHelper.displayLoading = true;
    firebase.auth().sendPasswordResetEmail(self.email)
      .then(() => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showSuccess: 'Email has been sent!' });
        document.getElementById('closeResetPasswordModal').click();
        self.dataHelper.openSpecificModal('loginModalOpener');
      })
      .catch((e) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }

}
