import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { iAgency } from '../../models/agency';

@Component({
  selector: 'app-hub-basic-details',
  templateUrl: './hub-basic-details.component.html',
  styleUrls: ['./hub-basic-details.component.scss']
})
export class HubBasicDetailsComponent implements OnInit {

  loading: boolean;
  activeTab: string = 'Your Hub';
  myAgencyObj: iAgency = new iAgency();
  tabButtons: string[] = ['Your Hub', 'Your Details', 'About Page', 'Confirmation'];

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) {
    if (!this.userAuth.currentUser.uid) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

}
