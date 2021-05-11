import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import { DataHelperService } from '../services/data-helper.service';
import { iExperience } from '../models/experience';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {

  servicesList: any[] = [
    {
      title: 'Experience',
      shortDescription: 'Write a short description here write a short description here description here',
      iconUrl: '/assets/imgs/elLab.png',
      navigateUrl: 'create-workshop'
    },
    {
      title: 'Space',
      shortDescription: 'Write a short description here write a short description here description here',
      iconUrl: '/assets/imgs/elLab.png',
      navigateUrl: ''
    },
    {
      title: 'Machine',
      shortDescription: 'Write a short description here write a short description here description here',
      iconUrl: '/assets/imgs/elLab.png',
      navigateUrl: ''
    },
    {
      title: 'Expert',
      shortDescription: 'Write a short description here write a short description here description here',
      iconUrl: '/assets/imgs/elLab.png',
      navigateUrl: 'expertise-details'
    },
  ];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
  ) { }

  ngOnInit(): void {
    if (!this.userAuth.currentUser.uid) {
      this.router.navigate(['/home']);
    }
  }

  navigatePage(pageUrl: string) {
    switch (pageUrl) {
      case 'create-workshop': {
        this.onCreateWorkshop();
        break;
      }
      case 'expertise-details': {
        if (this.dataHelper.myAgency) {
          this.dataHelper.openSpecificModal('inviteExpertModalOpener');
        } else {
          this.dataHelper.publishSomeData({ showError: 'You do not own a hub!' });
        }
        break;
      }
    }
  }

  onCreateWorkshop() {
    if (this.dataHelper.myAgency && this.dataHelper.myAgency.isApproved) {
      this.dataHelper.isEditWorkshop = false;
      this.dataHelper.createExperienceObj = new iExperience();
      this.router.navigate(['/create-workshop']);
    } else {
      this.dataHelper.publishSomeData({ showError: 'You Hub is not approved by admin yet to create workshop!' });
    }
  }

}
