import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { iUser, iExpertProfile } from '../models/user';
import { iPostJob } from '../models/post-job';
import { iExperience } from '../models/experience';
import * as firebase from 'firebase';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  years: number[];
  months: string[];
  dates: number[];

  onLoginForm: FormGroup;
  onRegisterForm: FormGroup;

  referralCode: string;
  user: iUser = new iUser();
  loading: boolean;
  uid: string;
  email: string;
  jobSearchQuery: string;

  onlyLoginPaths: string[] = [
    '/profile', '/my-orders', '/hire-expert', '/post-job'
  ];

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) {
    this.years = dataHelper.years;
    this.months = dataHelper.months;
    this.dates = dataHelper.dates;

    this.navigateHomeIfNotLoggedIn();
    this.dataHelper.getObservable().subscribe(data => {
      if (data.openLoginModal) {
        setTimeout(() => {
          document.getElementById('openLoginModalId').click();
        }, 1000);
      }
    });
  }

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
      birthMonth: [null, Validators.compose([
        Validators.required
      ])],
      birthDate: [null, Validators.compose([
        Validators.required
      ])],
      birthYear: [null, Validators.compose([
        Validators.required
      ])],
    });

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


  navigateHomeIfNotLoggedIn() {
    if (localStorage.getItem('userLoggedIn') !== 'true') {
      if (this.onlyLoginPaths.includes(this.router.url)) {
        this.router.navigate(['/home']);
      }
    }
  }


  loginAccount(data) {
    const self = this;
    self.loading = true;
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then((user) => {
      if (user) {
        self.uid = user.user.uid;
        self.getUserData();
      }
    })
      .catch((e) => {
        self.loading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }


  getUserData() {
    const self = this;
    firebase.database().ref().child('users/' + self.uid)
      .once('value', (snapshot) => {
        const user: iUser = snapshot.val();
        if (user) {
          self.loading = false;
          self.userAuth.setUser(user);
          self.dataHelper.publishSomeData({ showSuccess: 'User Logged In' });
          document.getElementById('closeLoginModal').click();
          self.router.navigate(['/home']);
        } else {
          self.userAuth.logoutUser();
          self.loading = false;
        }
      })
      .catch((e) => {
        self.loading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }


  createAccount(userData) {
    const self = this;
    self.loading = true;
    const birthMonth = this.months.indexOf(userData.birthMonth);
    // self.user.dob = new Date(userData.birthYear, birthMonth, userData.birthDate);
    userData.birthYear = userData.birthMonth = userData.birthDate = null;
    firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
      .then((user) => {
        if (firebase.auth().currentUser) {
          const uid = user.user.uid;
          self.saveDatatoUserTableAfterRegister(userData, uid);
        }
      })
      .catch((err) => {
        self.loading = false;
        self.dataHelper.publishSomeData({ showError: err.message });
      });
  }


  saveDatatoUserTableAfterRegister(userData, uid) {
    const self = this;
    userData.password = null;
    self.user.uid = uid;
    self.user.referralCode = self.referralCode || null;
    self.user.timestamp = Number(new Date());
    self.user = { ...self.user, ...userData, };
    const updates = {};
    updates['/users/' + uid] = self.user;
    firebase.database().ref().update(updates).then(() => {
      document.getElementById('closeSignupModal').click();
      self.loading = false;
      self.userAuth.setUser(self.user);
      self.dataHelper.publishSomeData({ showSuccess: 'Account Created Successfully!' });
      self.router.navigate(['/general-profile']);
    })
      .catch((e) => {
        self.loading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }


  resetPassword() {
    const self = this;
    self.loading = true;
    firebase.auth().sendPasswordResetEmail(self.email)
      .then(() => {
        self.loading = false;
        self.dataHelper.publishSomeData({ showSuccess: 'Email has been sent!' });
        document.getElementById('closeResetPasswordModal').click();
      })
      .catch((e) => {
        self.loading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }


  postNewJob() {
    this.dataHelper.isEditJob = false;
    this.dataHelper.postJobObj = new iPostJob();
    this.router.navigate(['/post-job']);
  }


  addNewWorkshop() {
    this.dataHelper.isEditWorkshop = false;
    this.router.navigate(['/create-workshop']);
  }


  becomeExpert() {
    let expertProfile = new iUser();
    if (!this.userAuth.currentUser.expertProfile) {
      this.userAuth.currentUser.expertProfile = new iExpertProfile();
    }
    expertProfile = this.dataHelper.deepCloneData(this.userAuth.currentUser);
    this.dataHelper.expertUserProfile = expertProfile;
    this.router.navigate(['/become-expert-step1']);
  }


  searchJobs() {
    if (!this.jobSearchQuery) {
      this.jobSearchQuery = 'fetchAllJobs';
    }
    if (this.router.url === '/find-jobs') {
      this.dataHelper.publishSomeData({ jobSearchQuery: this.jobSearchQuery });
    } else {
      this.dataHelper.jobSearchQuery = this.jobSearchQuery;
      this.router.navigate(['/find-jobs']);
    }
    if (this.jobSearchQuery === 'fetchAllJobs') {
      this.jobSearchQuery = null;
    }
  }


  toggleDisplayFilters() {
    if (this.router.url === '/home') {
      this.dataHelper.displayFilters = !this.dataHelper.displayFilters;
    } else {
      this.router.navigate(['/workshops']);
    }
  }


}
