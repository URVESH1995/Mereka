import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { WorkshopService } from '../../services/workshop.service';
import { iExperience } from '../../models/experience';
import { Router } from '@angular/router';
import { iUser } from '../../models/user';
import * as firebase from 'firebase';


@Component({
  selector: 'app-workshop-preview',
  templateUrl: './workshop-preview.component.html',
  styleUrls: ['./workshop-preview.component.scss']
})
export class WorkshopPreviewComponent implements OnInit {

  myWorkshopObj: iExperience = new iExperience();
  workshopHost: iUser = new iUser();

  activeTab: string = 'Confirmation';
  isMyWorkshop: boolean;
  workshopPhotos: string[] = [];

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
      if (!this.myWorkshopObj.uid) {
        this.workshopHost = this.userAuth.currentUser;
      } else {
        this.workshopHost = this.dataHelper.allUsers[this.myWorkshopObj.uid];
      }
      if (this.workshopHost.uid === this.userAuth.currentUser.uid) {
        this.isMyWorkshop = true;
      }
      if (this.myWorkshopObj.additionalPhotos.length) {
        this.workshopPhotos = this.dataHelper.deepCloneData(this.myWorkshopObj.additionalPhotos);
        this.workshopPhotos.unshift(this.myWorkshopObj.coverImage);
      }
    }
  }

  saveAndNext(draft?) {
    if (this.workshopService.allFieldsAreFilled(this.myWorkshopObj)) {
      this.saveWorkshopOnFirebase(draft);
    } else {
      this.dataHelper.publishSomeData({ showError: 'There is some missing information, Go back and fill all of the required fields!' });
    }
  }

  saveWorkshopOnFirebase(draft?) {
    if (!this.myWorkshopObj.workshopKey) {
      this.myWorkshopObj.uid = this.workshopHost.uid;
      this.myWorkshopObj.timestamp = Number(new Date());
      this.myWorkshopObj.workshopKey = firebase.database().ref().child(`/workshops/`).push().key;
    }

    this.myWorkshopObj.isDraft = draft || false;

    firebase.database().ref().child(`/workshops/${this.myWorkshopObj.workshopKey}`)
      .set(this.myWorkshopObj).then(() => {
        this.updateLocalData();
        this.dataHelper.createExperienceObj = null;
        this.router.navigate(['/my-workshops']);
        this.dataHelper.publishSomeData({ showSuccess: 'Experience saved successfully!' });
      });
  }


  updateLocalData() {
    const index = this.dataHelper.allWorkshopList.findIndex(x => x.workshopKey === this.myWorkshopObj.workshopKey);
    if (index >= 0) {
      this.dataHelper.allWorkshopList[index] = this.myWorkshopObj;
    } else {
      this.dataHelper.allWorkshopList.unshift(this.myWorkshopObj);
    }
  }

  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

}
