import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iPostJob } from '../models/post-job';
import { iUser } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { iJobBid, iJobMilestone } from '../models/job-bid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { iPushNotification } from '../models/push-notification';
import { iStrings } from '../models/enums';
import * as firebase from 'firebase';


@Component({
  selector: 'app-active-job-detail',
  templateUrl: './active-job-detail.component.html',
  styleUrls: ['./active-job-detail.component.scss']
})
export class ActiveJobDetailComponent implements OnInit {

  loading: boolean;
  jobDetail: iPostJob;
  jobOwnerAgency: string;
  jobOwner: iUser = new iUser();
  myBidObject: iJobBid = new iJobBid();
  milestoneForm: FormGroup
  isEditMilestone: boolean;
  milestoneObj: iJobMilestone;
  activeIndex: number;

  months: string[] = [];
  years: number[] = [];
  days: number[] = [];

  constructor(
    public router: Router,
    public zone: NgZone,
    public fb: FormBuilder,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) {
    this.getMonthsYears();
  }


  ngOnInit(): void {
    this.getJobDetails();
    this.milestoneForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
      ])],
      endDay: [null, Validators.compose([
        Validators.required,
      ])],
      endMonth: [null, Validators.compose([
        Validators.required,
      ])],
      endYear: [null, Validators.compose([
        Validators.required,
      ])],
      price: [null, Validators.compose([
        Validators.required,
      ])],
    });
  }


  getMonthsYears() {
    this.months = this.dataHelper.months;
    const currentYear = new Date().getFullYear();
    for (var i = currentYear; i <= currentYear + 10; i++) {
      this.years.push(i);
    }
    for (var j = 1; j <= 31; j++) {
      this.days.push(j);
    }
  }


  getJobDetails() {
    this.jobDetail = this.dataHelper.postedJobDetail || new iPostJob();
    if (this.jobDetail.key) {
      this.jobOwner = this.dataHelper.allUsers[this.jobDetail.uid];
      this.getJobOwnerAgency();
    } else if (!this.jobDetail.key && this.activeRoute.snapshot.params.key) {
      this.getPostedJobDetails(this.activeRoute.snapshot.params.key);
    } else if (!this.jobDetail.key && !this.activeRoute.snapshot.params.key) {
      this.router.navigate(['/home']);
    }
  }


  getPostedJobDetails(jobKey: string) {
    const self = this;
    self.loading = true;
    firebase.database().ref().child(`/jobs/${jobKey}`)
      .once('value', (snapshot) => {
        self.loading = false;
        self.jobDetail = snapshot.val();
        if (!self.jobDetail) {
          self.router.navigate(['/home']);
        } else {
          self.jobOwner = self.dataHelper.allUsers[self.jobDetail.uid];
          self.getJobOwnerAgency();
        }
      });
  }


  getJobOwnerAgency() {
    const myUid = this.userAuth.currentUser.uid;
    if (this.jobDetail.bids && this.jobDetail.bids.includes(myUid)) {
      this.router.navigate(['/find-jobs']);
      return;
    }

    this.jobOwnerAgency = this.jobOwner.myAgency;
    if (this.jobDetail.jobType === 'Quick Job') {
      this.myBidObject.type = 'fixed';
    } else {
      this.myBidObject.type = 'milestone';
    }

    if (this.jobDetail.questions) {
      this.jobDetail.questions.forEach(x => {
        this.myBidObject.answers.push({
          question: x, answer: ''
        });
      });
    }
  }


  editMilestone(i) {
    this.zone.run(() => {
      this.activeIndex = i;
      this.isEditMilestone = true;
      const deliveryDate = new Date(this.myBidObject.milestones[i].delivery);
      this.milestoneForm.get('endDay').setValue(deliveryDate.getDate());
      const endMonth = this.dataHelper.months[deliveryDate.getMonth()];
      this.milestoneForm.get('endMonth').setValue(endMonth);
      this.milestoneForm.get('endYear').setValue(deliveryDate.getFullYear());
      this.milestoneForm.get('name').setValue(this.myBidObject.milestones[i].name);
      this.milestoneForm.get('price').setValue(this.myBidObject.milestones[i].price);
    });
  }


  newMilestone() {
    this.isEditMilestone = false;
    this.milestoneForm.reset();
  }


  saveThisMilestone(data) {
    if (data.price.toString().match(/^[0-9]+$/) === null) {
      this.dataHelper.publishSomeData({ showError: 'Invalid milestone price!' });
      return;
    }

    const monthIndex = this.dataHelper.months.indexOf(data.endMonth);
    const milestoneEndDate = new Date(data.endYear, monthIndex, data.endDay);

    if (Number(milestoneEndDate) <= Number(new Date())) {
      this.dataHelper.publishSomeData({ showError: 'Invalid end date!' });
      return;
    }

    this.milestoneObj = {
      name: data.name,
      delivery: Number(milestoneEndDate),
      price: data.price,
      status: data.status || null
    }

    if (!this.isEditMilestone) {
      this.myBidObject.milestones.push(this.milestoneObj);
    } else {
      this.myBidObject.milestones[this.activeIndex] = this.milestoneObj;
    }
    document.getElementById('closeModalButton').click();
  }


  submitBid() {
    if (this.validateFields()) {
      const self = this;
      self.dataHelper.displayLoading = true;
      firebase.database().ref().child(`/jobs/${self.jobDetail.key}/bids`)
        .once('value', (snapshot) => {
          const bids = snapshot.val() || [];
          bids.push(self.userAuth.currentUser.uid);
          firebase.database().ref().child(`/jobs/${self.jobDetail.key}/bids`)
            .set(bids).then(() => {
              const jobIndex = self.dataHelper.allJobs.findIndex(x => x.key === self.jobDetail.key);
              self.dataHelper.allJobs[jobIndex].bids = bids;
              self.sendNotification();
              self.saveThisBidOnFirebase();
            });
        });
    }
  }


  sendNotification() {
    const notificationObj = new iPushNotification();
    notificationObj.jobKey = this.jobDetail.key;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = this.jobDetail.uid;
    notificationObj.title = 'Job Proposal';
    notificationObj.type = iStrings.SUBMIT_JOB_BID;
    this.dataHelper.sendNotification(this.jobDetail.uid, notificationObj);
  }


  saveThisBidOnFirebase() {
    const self = this;
    self.myBidObject.uid = self.userAuth.currentUser.uid;
    self.myBidObject.jobOwner = self.jobDetail.uid;
    self.myBidObject.jobKey = self.jobDetail.key;
    firebase.database().ref().child(`/bids/`)
      .push(self.myBidObject).then(() => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showSuccess: 'Bid submitted successfully!' });
        self.router.navigate(['/find-jobs']);
      });
  }


  validateFields(): boolean {
    let fieldsAreValid = true;
    this.myBidObject.totalPrice = 0;
    if (this.myBidObject.type === 'fixed') {
      if (!this.myBidObject.fixedPrice) {
        this.dataHelper.publishSomeData({ showError: 'Add fixed price!' });
        fieldsAreValid = false;
        return;
      } else {
        if (this.myBidObject.fixedPrice.toString().match(/^[0-9]+$/) === null) {
          this.dataHelper.publishSomeData({ showError: 'Add valid price!' });
          fieldsAreValid = false;
          return;
        } else {
          this.myBidObject.totalPrice = this.myBidObject.fixedPrice;
        }
      }
    } else {
      if (!this.myBidObject.milestones.length) {
        this.dataHelper.publishSomeData({ showError: 'Add milestones!' });
        fieldsAreValid = false;
        return;
      } else {
        this.myBidObject.milestones.forEach(x => {
          this.myBidObject.totalPrice += x.price;
        });
      }
    }

    if (this.myBidObject.answers.length) {
      let allAnswered = true;
      this.myBidObject.answers.forEach(x => {
        if (!x.answer) {
          allAnswered = false;
        }
      });
      if (!allAnswered) {
        this.dataHelper.publishSomeData({ showError: 'Answer all of the questions!' });
        fieldsAreValid = false;
        return;
      }
    }

    if (!this.myBidObject.coverLetter) {
      this.dataHelper.publishSomeData({ showError: 'Add cover letter!' });
      fieldsAreValid = false;
    }

    return fieldsAreValid;
  }


  removeMilestone(i) {
    this.myBidObject.milestones.splice(i, 1);
  }

  navigateJobDetail() {
    this.router.navigate(['/job-detail/' + this.jobDetail.key]);
  }


}
