import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iPostJob } from '../models/post-job';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-job-step3',
  templateUrl: './post-job-step3.component.html',
  styleUrls: ['./post-job-step3.component.scss']
})
export class PostJobStep3Component implements OnInit {

  jobDetails: iPostJob = new iPostJob();
  allCountries: string[];
  allLanguages: string[];
  jobDurationList: any[] = ['Less than 1 month', '1-3 Months', '1-6 Months', 'More than 6 months'];
  experienceLevelList: any[] = ['Entry', 'Intermediate', 'Expert'];
  jobTypes: any[] = [
    {
      title: 'Quick Job',
      img: '/assets/imgs/dollar-sign.svg',
      description: 'Make a fixed one-time payment'
    },
    {
      title: 'Longer Commitment',
      img: '/assets/imgs/dollar-sign2.svg',
      description: 'Jobs longer than 30 days with <br/> milestone payments'
    }
  ];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService
  ) {
    this.allCountries = dataHelper.countries;
    this.allLanguages = dataHelper.languages;
  }

  ngOnInit(): void {
    this.getJobDetails();
  }


  getJobDetails() {
    if (this.dataHelper.postJobObj) {
      this.jobDetails = this.dataHelper.deepCloneData(this.dataHelper.postJobObj);
    }
    if (!this.jobDetails.jobType) {
      this.jobDetails.jobType = 'Quick Job';
    }
    if (!this.jobDetails.jobDuration) {
      this.jobDetails.jobDuration = 'Less than 1 month';
    }
    if (!this.jobDetails.experienceLevel) {
      this.jobDetails.experienceLevel = 'Entry';
    }
  }


  saveJobDetails() {
    this.dataHelper.postJobObj = this.jobDetails;
    this.router.navigate(['/post-job-step4']);
  }


}
