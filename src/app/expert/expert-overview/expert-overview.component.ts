import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { iExpertProfile, iOverview, iHourlyRate } from '../../models/user';


@Component({
  selector: 'app-expert-overview',
  templateUrl: './expert-overview.component.html',
  styleUrls: ['./expert-overview.component.scss']
})
export class ExpertOverviewComponent implements OnInit {

  expandHourlyRate: boolean = true;
  expandTitle: boolean = true;
  expandOverview: boolean = true;

  activeTab: string = 'Profile Page';
  tabButtons: any[] = [
    { title: 'Your Expertise', navigatePage: 'expertise-details' },
    { title: 'Profile Page', navigatePage: 'expert-overview' },
    { title: 'Your Details', navigatePage: 'expert-portfolios' },
    { title: 'Confirmation', navigatePage: 'expert-profile-confirmation' },
  ];

  expertProfile: iExpertProfile = new iExpertProfile();

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }


  ngOnInit(): void {
    if (!this.dataHelper.expertProfile) {
      this.router.navigate(['/add-service']);
    } else {
      this.expertProfile = this.dataHelper.deepCloneData(this.dataHelper.expertProfile);
      if (!this.expertProfile.overview) {
        this.expertProfile.overview = new iOverview();
      }
      if (!this.expertProfile.hourlyRate) {
        this.expertProfile.hourlyRate = new iHourlyRate()
      }
    }
  }


  updateHourlyRatePerMerekaFee(userDefinedRate: number) {
    this.expertProfile.hourlyRate.marekaFee = this.dataHelper.marekaServiceFeePerHour * userDefinedRate / 100;
    this.expertProfile.hourlyRate.expertHourlyRate = userDefinedRate - this.expertProfile.hourlyRate.marekaFee;
  }


  saveAndNext() {
    if (this.fieldsAreFilled()) {
      this.dataHelper.expertProfile = this.expertProfile;
      this.router.navigate(['/expert-portfolios']);
    }
  }

  saveAndExit() {
    if (this.fieldsAreFilled()) {
      this.userAuth.currentUser.expertProfile = this.expertProfile;
      this.dataHelper.saveExpertProfileNode(this.userAuth.currentUser);
    }
  }

  fieldsAreFilled() {
    let dataFilled: boolean;
    if (this.expertProfile.overview.title && this.expertProfile.overview.overview &&
      this.expertProfile.hourlyRate.hourlyRate) {
      dataFilled = true;
    } else {
      this.dataHelper.publishSomeData({ showError: 'Please fill out the required fields!' });
    }
    return dataFilled;
  }

  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

}
