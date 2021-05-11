import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iPostJob } from '../models/post-job';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-post-job-step4',
  templateUrl: './post-job-step4.component.html',
  styleUrls: ['./post-job-step4.component.scss']
})
export class PostJobStep4Component implements OnInit {

  jobDetails: iPostJob = new iPostJob();
  imageFormats: string[] = ['PNG', 'png', 'jpg', 'JPG', 'jpeg', 'JPEG'];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService
  ) {
  }

  ngOnInit(): void {
    this.getJobDetails();
  }


  getJobDetails() {
    if (this.dataHelper.postJobObj) {
      this.jobDetails = this.dataHelper.deepCloneData(this.dataHelper.postJobObj);
    }
  }


  saveJobOnFirebase() {
    const self = this;
    if (self.fieldsAreFilled()) {
      self.dataHelper.displayLoading = true;
      if (!self.dataHelper.isEditJob) {
        self.jobDetails.timestamp = Number(new Date());
        self.jobDetails.uid = localStorage.getItem('uid');
        self.jobDetails.key = firebase.database().ref().child('/jobs/').push().key;
      }

      firebase.database().ref().child(`/jobs/${self.jobDetails.key}`)
        .set(self.jobDetails).then(() => {
          self.dataHelper.publishSomeData({ showSuccess: 'Job saved successfully!' });
          self.dataHelper.displayLoading = false;
          self.router.navigate(['/my-orders']);
        });
    } else {
      self.dataHelper.publishSomeData({ showError: 'Some required fields are missing!' });
    }
  }


  fieldsAreFilled(): boolean {
    if (!this.jobDetails.jobTitle || !this.jobDetails.description || !this.jobDetails.category ||
      !this.jobDetails.skills.length || !this.jobDetails.jobType) {
      return false;
    }
    return true;
  }


  getJobImage(): string {
    let imageUrl: string;
    if (this.jobDetails.fileUrls) {
      this.jobDetails.fileUrls.forEach(x => {
        if (this.imageFormats.includes(x.name.split('.').pop())) {
          imageUrl = x.url;
        }
      });
    }
    return imageUrl;
  }


}
