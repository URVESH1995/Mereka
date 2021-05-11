import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iExpertProfile, iPortfolio } from '../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-expert-portfolios',
  templateUrl: './expert-portfolios.component.html',
  styleUrls: ['./expert-portfolios.component.scss']
})
export class ExpertPortfoliosComponent implements OnInit {

  years: number[] = [];
  endYears: number[] = [];
  expandPortfolios: boolean = true;
  expandLanguages: boolean = true;
  activeTab: string = 'Your Details';

  portfolioObj: iPortfolio = new iPortfolio();
  expertProfile: iExpertProfile = new iExpertProfile();

  skillList: string[] = [];
  isEditPortfolio: boolean;
  activeIndex: number;
  portfolioForm: FormGroup;
  selectedFiles: any[] = [];

  tabButtons: any[] = [
    { title: 'Your Expertise', navigatePage: 'expertise-details' },
    { title: 'Profile Page', navigatePage: 'expert-overview' },
    { title: 'Your Details', navigatePage: 'expert-portfolios' },
    { title: 'Confirmation', navigatePage: 'expert-profile-confirmation' },
  ];

  suggestedSkills: string[] = [
    'Communication skills', 'Emotional intelligence', 'Team-working', 'Problem solving', 'Decision making',
    'Conflict resolution', 'Leadership', 'Creativity', 'Mentoring'
  ];

  constructor(
    public fb: FormBuilder,
    public zone: NgZone,
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) {
    this.getYears();
    this.getExpertProfile();
  }


  ngOnInit(): void {
    this.portfolioForm = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
      ])],
      startYear: [null, Validators.compose([
        Validators.required,
      ])],
      endYear: [null, Validators.compose([
        Validators.required,
      ])],
      description: ['', Validators.compose([
        Validators.required,
      ])],
      skills: ['', Validators.compose([])],
      attachedFiles: ['', Validators.compose([])],
      projectLink: ['', Validators.compose([])],
    });
  }


  getExpertProfile() {
    if (!this.dataHelper.expertProfile) {
      this.router.navigate(['/add-service']);
    } else {
      this.expertProfile = this.dataHelper.deepCloneData(this.dataHelper.expertProfile);
      if (!this.expertProfile.languages) {
        this.expertProfile.languages = [];
      }
      if (!this.expertProfile.otherLanguages) {
        this.expertProfile.otherLanguages = [];
      }
      if (!this.expertProfile.portfolio) {
        this.expertProfile.portfolio = [];
      }
    }
  }


  getYears() {
    const currentYear = new Date().getFullYear();
    for (var i = currentYear; i >= 1950; i--) {
      this.years.push(i);
    }
    for (var i = currentYear + 20; i >= 1950; i--) {
      this.endYears.push(i);
    }
  }


  onChangeFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    for (var a = 0; a < files.length; a++) {
      this.selectedFiles.push(files[a]);
    }
  }


  saveAttachedFiles(file: File, index: number) {
    const self = this;
    if (!self.portfolioObj.attachedFiles) {
      self.portfolioObj.attachedFiles = [];
    }
    self.dataHelper.displayLoading = true;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000) + '.' + file.name.split('.').pop();
    const uploadTask = storageRef.child('portfolioImages/' + filename).put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => { },
      (error) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: error.message });
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          self.portfolioObj.attachedFiles.push({
            name: file.name,
            url: downloadURL
          });
          if (index === self.selectedFiles.length - 1) {
            self.dataHelper.displayLoading = false;
            self.savePortfolioDataAndCloseModal();
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


  saveThisPortfolio(data) {
    data.attachedFiles = this.portfolioObj.attachedFiles || [];
    if (this.selectedFiles.length || data.attachedFiles.length) {
      if (this.fieldsAreValid(data)) {
        this.portfolioObj = data;
        if (this.selectedFiles.length) {
          this.saveAttachedFiles(this.selectedFiles[0], 0);
        } else {
          this.savePortfolioDataAndCloseModal();
        }
      } else {
        this.dataHelper.publishSomeData({ showError: 'Looks like you have entered invalid duration!' });
      }
    } else {
      this.dataHelper.publishSomeData({ showError: 'Attach portfolio images!' });
    }
  }


  savePortfolioDataAndCloseModal() {
    this.portfolioObj.skills = this.skillList;
    if (!this.isEditPortfolio) {
      this.expertProfile.portfolio.push(this.portfolioObj);
    } else {
      this.expertProfile.portfolio[this.activeIndex] = this.portfolioObj;
    }
    this.dataHelper.displayLoading = false;
    document.getElementById('closePortfolioModalButton').click();
  }


  fieldsAreValid(data: iPortfolio): boolean {
    let validFields: boolean = true;
    if (Number(data.endYear) < Number(data.startYear)) {
      validFields = false;
    }
    return validFields;
  }


  removePortfolio(i) {
    this.activeIndex = i;
  }

  removeFile(i) {
    this.portfolioObj.attachedFiles.splice(i, 1);
    this.expertProfile.portfolio[this.activeIndex] = this.portfolioObj;
  }

  removePortfolioObject() {
    this.expertProfile.portfolio.splice(this.activeIndex, 1);
  }

  editPortfolio(i: number) {
    this.zone.run(() => {
      this.activeIndex = i;
      this.selectedFiles = [];
      this.isEditPortfolio = true;
      if (!this.expertProfile.portfolio[i].projectLink) {
        this.expertProfile.portfolio[i].projectLink = '';
      }
      this.portfolioForm.setValue(this.dataHelper.deepCloneData(this.expertProfile.portfolio[i]));
      this.skillList = this.expertProfile.portfolio[i].skills;
      this.portfolioObj = this.dataHelper.deepCloneData(this.expertProfile.portfolio[i]);
    });
  }

  newPortfolio() {
    this.isEditPortfolio = false;
    this.portfolioForm.reset();
    this.skillList = [];
    this.selectedFiles = [];
    this.portfolioObj = new iPortfolio();
  }

  saveAndNext() {
    if (this.fieldsAreFilled()) {
      this.dataHelper.expertProfile = this.expertProfile;
      this.userAuth.currentUser.expertProfile = this.expertProfile;
      this.router.navigate(['/expert-profile-confirmation']);
    }
  }

  saveAndExit() {
    if (this.fieldsAreFilled()) {
      this.userAuth.currentUser.expertProfile = this.expertProfile;
      this.dataHelper.saveExpertProfileNode(this.userAuth.currentUser);
    }
  }

  fieldsAreFilled() {
    let dataFilled: boolean = true;
    if (!this.expertProfile.languages.length) {
      this.dataHelper.publishSomeData({ showError: 'Add at least one language!' });
      dataFilled = false;
    } else if (!this.expertProfile.portfolio.length) {
      this.dataHelper.publishSomeData({ showError: 'Add at least one portfolio!' });
      dataFilled = false;
    }
    return dataFilled;
  }


  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

}
