import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iExperience } from '../../models/experience';
import { Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-workshop-audience',
  templateUrl: './workshop-audience.component.html',
  styleUrls: ['./workshop-audience.component.scss']
})
export class WorkshopAudienceComponent implements OnInit {

  myWorkshopObj: iExperience = new iExperience();

  activeTab: string = 'Your Audience';
  expandAccessibility: boolean = true;
  expandGuests: boolean = true;
  expandExpertise: boolean = true;
  expandLanguages: boolean = true;
  rangeBarOptions: Options = {
    floor: 1,
    ceil: 50,
    showTicks: true,
    step: 1
  };

  tabButtons: any[] = [
    { title: 'Your Experience', navigatePage: 'create-workshop' },
    { title: 'Your Audience', navigatePage: 'workshop-audience' },
    { title: 'Additional Information', navigatePage: 'workshop-additional-info' },
    { title: 'Your Page', navigatePage: 'workshop-basic-details' },
    { title: 'Confirmation', navigatePage: 'workshop-preview' },
  ];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    if (!this.dataHelper.createExperienceObj) {
      this.router.navigate(['/add-service']);
    } else {
      this.myWorkshopObj = this.dataHelper.createExperienceObj;
      if (!this.myWorkshopObj.otherLanguages) {
        this.myWorkshopObj.otherLanguages = [];
      }
    }
  }

  updateGuestsCount(maxLearners: number) {
    this.myWorkshopObj.guestLearners = maxLearners;
  }

  emptyGroupsArray() {
    this.myWorkshopObj.targetGroups = [];
  }

  updateTargetGroups(group: string) {
    const index = this.myWorkshopObj.targetGroups.indexOf(group);
    if (index >= 0) {
      this.myWorkshopObj.targetGroups.splice(index, 1);
    } else {
      this.myWorkshopObj.targetGroups.push(group);
    }
  }

  isGroupAdded(group: string) {
    return this.myWorkshopObj.targetGroups && this.myWorkshopObj.targetGroups.includes(group);
  }

  decreaseGroupMembers() {
    if (this.myWorkshopObj.maximumBookableGroupByLearner > 1) {
      this.myWorkshopObj.maximumBookableGroupByLearner--;
    }
  }

  increaseGroupMembers() {
    this.myWorkshopObj.maximumBookableGroupByLearner++;
  }

  saveAndNext() {
    if (this.allFieldsAreFilled()) {
      this.dataHelper.createExperienceObj = this.myWorkshopObj;
      this.router.navigate(['/workshop-additional-info']);
    }
  }

  allFieldsAreFilled(): boolean {
    let filedsAreFilled = true;
    if (!this.myWorkshopObj.targetAudience || (this.myWorkshopObj.targetAudience === 'Specific Groups'
      && !this.myWorkshopObj.targetGroups.length)) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Please choose your target audience!' });
    } else if (!this.myWorkshopObj.requiredLevelOfExpertise) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Please choose level of expertise!' });
    } else if ((this.myWorkshopObj.requiredLevelOfExpertise === 'Intermediate' ||
      this.myWorkshopObj.requiredLevelOfExpertise === 'Advanced') && !this.myWorkshopObj.requiredskillset.length) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Add at least one skill!' });
    } else if (!this.myWorkshopObj.mainLanguage) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Choose language!' });
    } else if (this.myWorkshopObj.guestLearners < 0) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Minimum guests learners can be 1!' });
    }
    return filedsAreFilled;
  }

  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

  clearOtherPriceValues() {
    this.myWorkshopObj.ratePerLearner = null;
    this.myWorkshopObj.ratePerMember = null;
  }

}
