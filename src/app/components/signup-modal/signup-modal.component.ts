import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iUser } from '../../models/user';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss']
})
export class SignupModalComponent implements OnInit {

  onRegisterForm: FormGroup;
  user: iUser = new iUser();

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }


  ngOnInit(): void {
    this.onRegisterForm = this.fb.group({
      fullName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])],
      dob: [null, Validators.compose([
        Validators.required
      ])],
    });
  }


  createAccount(userData) {
    const self = this;
    self.dataHelper.displayLoading = true;
    firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
      .then((user) => {
        if (firebase.auth().currentUser) {
          const uid = user.user.uid;
          self.saveDatatoUserTableAfterRegister(userData, uid);
        }
      })
      .catch((err) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: err.message });
      });
  }


  saveDatatoUserTableAfterRegister(userData, uid: string) {
    const self = this;
    userData.password = null;
    userData.dob = new Date(userData.dob).toString();
    self.user.uid = uid;
    self.user.timestamp = Number(new Date());
    self.user = { ...self.user, ...userData, };
    self.user.learnerProfile = null;
    firebase.database().ref().child(`/users/${uid}`)
      .set(self.user).then(() => {
        self.onRegisterForm.reset();
        document.getElementById('closeSignupModal').click();
        self.dataHelper.displayLoading = false;
        self.dataHelper.allUsers[self.user.uid] = self.user;
        self.userAuth.setUser(self.user);
        self.router.navigate(['/create-learner-profile']);
        self.dataHelper.publishSomeData({ showSuccess: 'Account Created Successfully!' });
      })
      .catch((e) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }


}
