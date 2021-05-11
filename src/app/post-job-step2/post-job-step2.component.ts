import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iPostJob } from '../models/post-job';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-job-step2',
  templateUrl: './post-job-step2.component.html',
  styleUrls: ['./post-job-step2.component.scss']
})
export class PostJobStep2Component implements OnInit {

  jobDetails: iPostJob = new iPostJob();
  question: string;
  isEditQuestion: boolean;
  activeIndex: string;
  selectedCategorySkills: string[];
  allCountries: string[];
  allLanguages: string[];
  categories: string[];

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
      this.getJobCategoryTitles();
    }
    if (!this.jobDetails.teamSize) {
      this.jobDetails.teamSize = 'One Expert/Hub';
    }
  }


  getJobCategoryTitles() {
    this.categories = [];
    for (var key in this.dataHelper.jobCategoriesData) {
      this.categories.push(key);
    }
    if (this.jobDetails.category) {
      this.getCategorySkills(this.jobDetails.category);
    }
  }


  getCategorySkills(category: string, changeCategory?) {
    if (changeCategory) {
      this.jobDetails.skills = [];
    }
    this.selectedCategorySkills = [];
    const selectedCatObj = this.dataHelper.jobCategoriesData[category];
    selectedCatObj.specialities.forEach(x => {
      x.skills.forEach(skill => {
        if (!this.selectedCategorySkills.includes(skill)) {
          this.selectedCategorySkills.push(skill);
        }
      });
    });
  }


  saveJobDetails() {
    if (!this.isEmptyFields()) {
      this.dataHelper.postJobObj = this.jobDetails;
      this.router.navigate(['/post-job-step3']);
    } else {
      this.dataHelper.publishSomeData({ showError: 'Fill required fields!' });
    }
  }


  saveQuestion() {
    if (this.isEditQuestion) {
      this.jobDetails.questions[this.activeIndex] = this.question;
    } else {
      if (!this.jobDetails.questions) {
        this.jobDetails.questions = [];
      }
      this.jobDetails.questions.push(this.question);
    }
  }


  editQuestion(i) {
    this.activeIndex = i;
    this.question = this.jobDetails.questions[i];
    this.isEditQuestion = true;
  }

  newQuestion() {
    this.question = '';
    this.isEditQuestion = false;
  }

  removeQuestion(i) {
    this.jobDetails.questions.splice(i, 1);
  }

  isEmptyFields(): boolean {
    if (!this.jobDetails.category || !this.jobDetails.skills.length) {
      return true;
    } else {
      return false;
    }
  }


}
