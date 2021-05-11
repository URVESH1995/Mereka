import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { iUser } from '../../models/user';


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  showPassword: boolean;
  onLoginForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }


  ngOnInit(): void {
    this.onLoginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }


  loginAccount(data) {
    const self = this;
    self.dataHelper.displayLoading = true;
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then((user) => {
      if (user) {
        self.getUserData(user.user.uid);
      }
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
          self.onLoginForm.reset();
          self.dataHelper.displayLoading = false;
          self.userAuth.setUser(user);
          self.dataHelper.publishSomeData({ showSuccess: 'User Logged In' });
          document.getElementById('closeLoginModal').click();
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
