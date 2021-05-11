import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iLearnerProfile } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-learner-profile',
  templateUrl: './create-learner-profile.component.html',
  styleUrls: ['./create-learner-profile.component.scss']
})
export class CreateLearnerProfileComponent implements OnInit {

  learnerProfile: iLearnerProfile = new iLearnerProfile();

  mainCateActive: string;
  workshopCates: string[] = ["Workshop", "Talk", "Class", "Course", "Program"];
  spaceCates: string[] = ["Topic1", "Topic2", "Topic3", "Topic4", "Topic5", "Topic6", "Topic7", "Topic8", "Topic9", "Topic10"];
  expertCates: string[] = [
    'Web, Mobile & Software Development', 'Design & Creative', 'Sales & Marketing', 'Writing',
    'Admin Support', 'Engineering & Architecture', 'Data Science & Analytics', 'IT & Networking',
    'Customer Service'
  ];

  activeTab: string = 'Step 1: Personalize your page';
  tabButtons: any[] = [
    { title: 'Step 1: Personalize your page', navigatePage: 'create-learner-profile' },
    { title: 'Step 2: Set up your profile', navigatePage: 'setup-learner-profile' },
    { title: 'Confirmation', navigatePage: 'learner-confirmation' },
  ];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) {
    if (!userAuth.currentUser.uid) {
      router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.getLearnerProfile();
    this.mainCateActive = 'experience';
    this.dataHelper.getObservable().subscribe(data => {
      if (data.activeExpertTab) {
        this.mainCateActive = 'expert';
      }
    });
  }

  getLearnerProfile() {
    if (this.userAuth.currentUser.learnerProfile) {
      this.learnerProfile = this.dataHelper.deepCloneData(this.userAuth.currentUser.learnerProfile);
    } else {
      this.learnerProfile = new iLearnerProfile();
    }
    this.learnerProfile.uid = this.userAuth.currentUser.uid;
    if (!this.learnerProfile.interestedExperiences) {
      this.learnerProfile.interestedExperiences = [];
    }
    if (!this.learnerProfile.interestedExperts) {
      this.learnerProfile.interestedExperts = [];
    }
    if (!this.learnerProfile.interestedSpaces) {
      this.learnerProfile.interestedSpaces = [];
    }
    if (!this.learnerProfile.interestedThemes) {
      this.learnerProfile.interestedThemes = [];
    }
    if (!this.learnerProfile.purposeInExperiences) {
      this.learnerProfile.purposeInExperiences = [];
    }
    if (!this.learnerProfile.purposeInSpaces) {
      this.learnerProfile.purposeInSpaces = [];
    }
  }

  isExperiencePurposeAdded(data: string) {
    return this.learnerProfile.purposeInExperiences.includes(data);
  }

  isSpacePurposeAdded(data: string) {
    return this.learnerProfile.purposeInSpaces.includes(data);
  }

  isInterestedInExperience(category: string): boolean {
    return this.learnerProfile.interestedExperiences.includes(category);
  }

  addInExperienceInterests(category: string) {
    const index = this.learnerProfile.interestedExperiences.indexOf(category);
    if (index >= 0) {
      this.learnerProfile.interestedExperiences.splice(index, 1);
    } else {
      this.learnerProfile.interestedExperiences.push(category);
    }
  }

  isInterestedInSpace(category: string): boolean {
    return this.learnerProfile.interestedSpaces.includes(category);
  }

  addInExperienceThemes(category: string) {
    const index = this.learnerProfile.interestedThemes.indexOf(category);
    if (index >= 0) {
      this.learnerProfile.interestedThemes.splice(index, 1);
    } else {
      this.learnerProfile.interestedThemes.push(category);
    }
  }

  isAddedInThemes(category: string): boolean {
    return this.learnerProfile.interestedThemes.includes(category);
  }

  addInSpaceInterests(category: string) {
    const index = this.learnerProfile.interestedSpaces.indexOf(category);
    if (index >= 0) {
      this.learnerProfile.interestedSpaces.splice(index, 1);
    } else {
      this.learnerProfile.interestedSpaces.push(category);
    }
  }

  isInterestedInExpert(category: string): boolean {
    return this.learnerProfile.interestedExperts.includes(category);
  }

  addInExpertInterests(category: string) {
    const index = this.learnerProfile.interestedExperts.indexOf(category);
    if (index >= 0) {
      this.learnerProfile.interestedExperts.splice(index, 1);
    } else {
      this.learnerProfile.interestedExperts.push(category);
    }
  }

  updateExperiencePurposes(data: string) {
    const index = this.learnerProfile.purposeInExperiences.indexOf(data);
    if (index >= 0) {
      this.learnerProfile.purposeInExperiences.splice(index, 1);
    } else {
      this.learnerProfile.purposeInExperiences.push(data);
    }
  }

  updateSpacePurposes(data: string) {
    const index = this.learnerProfile.purposeInSpaces.indexOf(data);
    if (index >= 0) {
      this.learnerProfile.purposeInSpaces.splice(index, 1);
    } else {
      this.learnerProfile.purposeInSpaces.push(data);
    }
  }

  validateFields() {
    if (this.mainCateActive === 'experience') {
      if (this.validateExperienceFields()) {
        this.mainCateActive = 'space';
      }
    } else if (this.mainCateActive === 'space') {
      if (this.validateSpaceFields()) {
        this.mainCateActive = 'expert';
      }
    } else if (this.checkIfDataFilled()) {
      this.goToSetupProfile();
    }
  }

  goToSetupProfile() {
    this.userAuth.currentUser.learnerProfile = this.learnerProfile;
    this.router.navigate(['/setup-learner-profile']);
  }

  validateExperienceFields(): boolean {
    let validData: boolean = true;
    if (!this.learnerProfile.purposeInExperiences.length) {
      this.dataHelper.publishSomeData({ showError: 'Please choose at least one to do in Experiences!' });
      validData = false;
    } else if (!this.learnerProfile.interestedExperiences.length) {
      this.dataHelper.publishSomeData({ showError: 'Please choose what type of experiences are you interested in!' });
      validData = false;
    } else if (!this.learnerProfile.interestedThemes.length) {
      this.dataHelper.publishSomeData({ showError: 'Please choose at least one experiece theme you are interested in!' });
      validData = false;
    }
    return validData;
  }

  validateSpaceFields(): boolean {
    let validData: boolean = true;
    if (!this.learnerProfile.purposeInSpaces.length) {
      this.dataHelper.publishSomeData({ showError: 'Please choose at least one to do in Spaces!' });
      validData = false;
    } else if (!this.learnerProfile.interestedSpaces.length) {
      this.dataHelper.publishSomeData({ showError: 'Please choose what type of spaces are you interested in!' });
      validData = false;
    }
    return validData;
  }

  checkIfDataFilled(): boolean {
    let validData: boolean = true;
    if (!this.learnerProfile.interestedExperts.length) {
      this.dataHelper.publishSomeData({ showError: 'Please choose what type of experts are you interested in!' });
      validData = false;
    }
    return validData;
  }

}
