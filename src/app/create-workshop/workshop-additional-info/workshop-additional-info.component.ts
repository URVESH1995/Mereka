import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iExperience, iExperienceSession, iExperienceDuration } from '../../models/experience';
import { Router } from '@angular/router';
import { WorkshopService } from '../../services/workshop.service';

@Component({
  selector: 'app-workshop-additional-info',
  templateUrl: './workshop-additional-info.component.html',
  styleUrls: ['./workshop-additional-info.component.scss']
})
export class WorkshopAdditionalInfoComponent implements OnInit {

  myWorkshopObj: iExperience = new iExperience();

  sessionDetails: iExperienceSession = new iExperienceSession();
  activeTab: string = 'Additional Information';
  expandDuration: boolean = true;
  expandTiming: boolean = true;
  expandPrice: boolean = true;
  expandSessions: boolean = true;
  activeIndex: number = -1;

  recurringList: string[] = ['Daily', 'Weekly', 'Fortnightly', 'Monthly', 'Quarterly', 'Yearly'];

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
    public workshopService: WorkshopService,
    public userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    if (!this.dataHelper.createExperienceObj) {
      this.router.navigate(['/add-service']);
    } else {
      this.myWorkshopObj = this.dataHelper.createExperienceObj;
      if (!this.myWorkshopObj.sessions) {
        this.myWorkshopObj.sessions = [];
      }
      if (!this.myWorkshopObj.experienceDuration) {
        this.myWorkshopObj.experienceDuration = new iExperienceDuration();
      }
    }
  }

  newSession() {
    this.activeIndex = -1;
    this.sessionDetails = new iExperienceSession();
  }

  updateSession(index: number) {
    this.activeIndex = index;
    this.sessionDetails = this.dataHelper.deepCloneData(this.myWorkshopObj.sessions[index]);
  }

  saveSession() {
    if (!this.sessionDetails.topic || !this.sessionDetails.date || !this.sessionDetails.startTime
      || !this.sessionDetails.endTime) {
      this.dataHelper.publishSomeData({ showError: 'Please fill out the required fields!' });
      return
    }

    if (this.activeIndex >= 0) {
      this.myWorkshopObj.sessions[this.activeIndex] = this.sessionDetails;
    } else {
      this.myWorkshopObj.sessions.push(this.sessionDetails);
    }
    this.newSession();
    document.getElementById('closeSessionModalBtn').click();
  }

  confirmRemove(index: number) {
    this.activeIndex = index;
  }

  removeSession() {
    this.myWorkshopObj.sessions.splice(this.activeIndex, 1);
  }

  saveAndNext() {
    if (this.allFieldsAreFilled()) {
      this.dataHelper.createExperienceObj = this.myWorkshopObj;
      this.router.navigate(['/workshop-basic-details']);
    }
  }

  allFieldsAreFilled(): boolean {
    let filedsAreFilled = true;
    if (!this.myWorkshopObj.experienceDuration.hourlyDuration && !this.myWorkshopObj.experienceDuration.minutesDuration) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Please provide experience duration!' });
    } else if (!this.myWorkshopObj.experienceDuration.startDate ||
      !this.myWorkshopObj.experienceDuration.startTime || !this.myWorkshopObj.experienceDuration.endDate) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Please provide date and time for the experience hosting!' });
    } else if (this.myWorkshopObj.experienceDuration.isRecurring && !this.myWorkshopObj.experienceDuration.recurringPeriod) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Please set a recurring period for experience!' });
    } else if (!this.isPriceDefined()) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Please set the price for your experience!' });
    } else if (!this.myWorkshopObj.sessions.length) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Please add at least one session!' });
    }
    return filedsAreFilled;
  }

  isPriceDefined(): boolean {
    return this.workshopService.isPriceDefined(this.myWorkshopObj);
  }

  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

}
