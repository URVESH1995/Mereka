import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iLearnerProfile, iUserLocation, iUser, iEducation, iEmployment } from '../../models/user';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-setup-learner-profile',
  templateUrl: './setup-learner-profile.component.html',
  styleUrls: ['./setup-learner-profile.component.scss']
})
export class SetupLearnerProfileComponent implements OnInit {

  loading: boolean;
  activeIndex: number = -1;
  profileImagePath: any;
  coverImagePath: any;
  newProfileImg: boolean;
  newCoverImg: boolean;
  currentUser: iUser = new iUser();
  showStep1: boolean;
  newLanguage: string;

  learnerProfile: iLearnerProfile = new iLearnerProfile();
  currentEducation: iEducation = new iEducation();
  currentEmployment: iEmployment = new iEmployment();

  expandTypeofEdu: boolean = true;
  expandTypeofEmp: boolean = true;
  expandTypeoflang: boolean = true;
  activeTab: string = 'Step 2: Set up your profile';
  tabButtons: any[] = [
    { title: 'Step 1: Personalize your page', navigatePage: 'create-learner-profile' },
    { title: 'Step 2: Set up your profile', navigatePage: 'setup-learner-profile' },
    { title: 'Confirmation', navigatePage: 'learner-confirmation' },
  ];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.showStep1 = true;
    if (!this.userAuth.currentUser.learnerProfile) {
      this.router.navigate(['/create-learner-profile']);
    } else {
      this.getLearnerProfile();
    }
    this.dataHelper.getObservable().subscribe(data => {
      if (data.updateSetupProfileTab) {
        this.showStep1 = false;
      }
    });
  }

  getLearnerProfile() {
    this.currentUser = this.dataHelper.deepCloneData(this.userAuth.currentUser);
    this.learnerProfile = this.currentUser.learnerProfile;
    if(!this.learnerProfile.educationList){
      this.learnerProfile.educationList = [];
    } 
    this.profileImagePath = this.currentUser.profileUrl;
    this.coverImagePath = this.learnerProfile.coverImage;
    if (!this.currentUser.location) {
      this.currentUser.location = new iUserLocation();
    }
    if (!this.learnerProfile.otherLanguages) {
      this.learnerProfile.otherLanguages = [];
    }
  }

  onChangeLogoFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    if (files[0]) {
      this.newProfileImg = true;
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.profileImagePath = event.target.result;
      });
      reader.readAsDataURL(files[0]);
    }
  }

  onChangeCoverFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    if (files[0]) {
      this.newCoverImg = true;
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.coverImagePath = event.target.result;
      });
      reader.readAsDataURL(files[0]);
    }
  }

  updateEducation(education: iEducation, index: number) {
    this.currentEducation = this.dataHelper.deepCloneData(education);
    this.activeIndex = index;
  }

  newEducation() {
    this.activeIndex = -1;
    this.currentEducation = new iEducation();
  }

  removeEducation(index: number) {
    this.learnerProfile.educationList.splice(index, 1);
  }

  saveEducation() {
    if (this.currentEducation.startDate && this.currentEducation.endDate &&
      new Date(this.currentEducation.startDate) >= new Date(this.currentEducation.endDate)) {
      this.dataHelper.publishSomeData({ showError: 'Invalid education period!' });
    } else {
      if (this.activeIndex >= 0) {
        this.learnerProfile.educationList[this.activeIndex] = this.currentEducation;
      } else {
        this.learnerProfile.educationList.push(this.currentEducation);
      }
      document.getElementById('closeEducationModal').click();
    }
  }

  updateEmployment(employment: iEmployment, index: number) {
    this.currentEmployment = this.dataHelper.deepCloneData(employment);
    this.activeIndex = index;
  }

  newEmployment() {
    this.activeIndex = -1;
    this.currentEmployment = new iEmployment();
  }

  removeEmployment(index: number) {
    this.learnerProfile.employmentList.splice(index, 1);
  }

  saveEmployment() {
    if (this.currentEmployment.endDate &&
      new Date(this.currentEmployment.startDate) >= new Date(this.currentEmployment.endDate)) {
      this.dataHelper.publishSomeData({ showError: 'Invalid employment period!' });
    } else {
      if (this.activeIndex >= 0) {
        this.learnerProfile.employmentList[this.activeIndex] = this.currentEmployment;
      } else {
        this.learnerProfile.employmentList.push(this.currentEmployment);
      }
      document.getElementById('closeEmploymentModal').click();
    }
  }

  nextTab() {
    if (this.newProfileImg) {
      this.dataHelper.displayLoading = true;
      this.saveImageOnFirebase();
    } else if (this.newCoverImg) {
      this.dataHelper.displayLoading = true;
      this.saveImageOnFirebase();
    } else {
      this.dataHelper.displayLoading = false;
      this.saveAndNextTab();
    }
  }

  saveImageOnFirebase() {
    const self = this;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`hubImages/${filename}.jpg`);
    const imageFile = self.newProfileImg ? self.profileImagePath : self.coverImagePath;

    imageRef.putString(imageFile, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      firebase.storage().ref('hubImages/' + snapshot.metadata.name).getDownloadURL().then((url) => {
        if (self.newProfileImg) {
          self.newProfileImg = false;
          self.currentUser.profileUrl = url;
        } else {
          self.newCoverImg = false;
          self.learnerProfile.coverImage = url;
        }
        self.nextTab();
      })
        .catch((e) => {
          self.dataHelper.publishSomeData({ showError: e.message });
        });
    })
      .catch((e) => {
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }

  saveAndNextTab() {
    this.currentUser.learnerProfile = this.learnerProfile;
    this.userAuth.currentUser = this.currentUser;
    this.router.navigate(['/learner-confirmation']);
  }

  basicDetailsAreFilled() {
    let dataFilled: boolean = true;
    if (!this.currentUser.fullName || !this.currentUser.location.city || !this.learnerProfile.aboutMe) {
      this.dataHelper.publishSomeData({ showError: 'Please fill out the basic details!' });
      dataFilled = false;
    }
    if (dataFilled) {
      this.showStep1 = false;
    }
  }

  // requiredFieldsAreFilled(): boolean {
  //   let dataFilled: boolean = true;
  //   if (!this.learnerProfile.educationList.length || !this.learnerProfile.employmentList.length) {
  //     this.dataHelper.publishSomeData({ showError: 'Missing education or employment!' });
  //     dataFilled = false;
  //   } else if (!this.learnerProfile.language) {
  //     this.dataHelper.publishSomeData({ showError: 'Choose your primary language!' });
  //     dataFilled = false;
  //   }
  //   return dataFilled;
  // }

  backToLearnerProfile() {
    this.router.navigate(['/create-learner-profile']);
    setTimeout(() => {
      this.dataHelper.publishSomeData({ activeExpertTab: true });
    }, 100);
  }

  addNewLanguage() {
    if (this.newLanguage) {
      this.learnerProfile.otherLanguages.push(this.newLanguage);
      this.newLanguage = '';
    }
  }

  removeLanguage(index: number) {
    this.learnerProfile.otherLanguages.splice(index, 1);
  }


}
