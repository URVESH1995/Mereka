import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iPostJob } from '../models/post-job';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent implements OnInit {

  jobDetails: iPostJob = new iPostJob();
  selectedFiles: any[] = [];
  inlavidDescription: boolean;
  lettersCount: number = 0;

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
      this.lettersCount = this.jobDetails.description ? this.jobDetails.description.length : 0;
    }
  }


  countLetters(e) {
    this.inlavidDescription = false;
    this.lettersCount = e.length;
    if (e.length < 50 || e.length > 5000) {
      this.inlavidDescription = true;
    }
  }


  onChangeFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    for (var a = 0; a < files.length; a++) {
      if (files[a].size <= 100000000) {
        this.selectedFiles.push(files[a]);
      }
    }
  }


  saveAttachedFiles(file: File, index: number) {
    const self = this;
    self.dataHelper.displayLoading = true;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000) + '.' + file.name.split('.').pop();
    const uploadTask = storageRef.child('jobDocuments/' + filename).put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => { },
      (error) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: error.message });
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          self.jobDetails.fileUrls.push({
            name: file.name,
            url: downloadURL
          });
          if (index === self.selectedFiles.length - 1) {
            self.dataHelper.displayLoading = false;
            self.dataHelper.postJobObj = self.jobDetails;
            self.router.navigate(['/post-job-step2']);
          } else {
            self.saveAttachedFiles(self.selectedFiles[index + 1], index + 1);
          }
        })
          .catch((e) => {
            self.dataHelper.displayLoading = false;
            self.dataHelper.publishSomeData({ showError: e.message });
          });
      });
  }


  saveJobDetails() {
    if (this.filedsAreFilled()) {
      if (this.selectedFiles.length) {
        this.saveAttachedFiles(this.selectedFiles[0], 0);
      } else {
        this.dataHelper.postJobObj = this.jobDetails;
        this.router.navigate(['/post-job-step2']);
      }
    } else {
      this.dataHelper.publishSomeData({ showError: 'Missing required fields or invalid description!' });
    }
  }


  removeFile(i) {
    this.jobDetails.fileUrls.splice(i, 1);
  }


  filedsAreFilled(): boolean {
    if (this.jobDetails.jobTitle && this.jobDetails.description && !this.inlavidDescription) {
      return true;
    } else {
      return false;
    }
  }

}
