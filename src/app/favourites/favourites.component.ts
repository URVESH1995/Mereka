import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iExperience } from '../models/experience';
import { Router } from '@angular/router';
import { iUser } from '../models/user';
import { iAgency } from '../models/agency';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {

  favWorkshops: iExperience[] = [];
  favExperts: iUser[] = [];
  favHubs: iAgency[] = [];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    if (!this.dataHelper.allWorkshopList) {
      this.router.navigate(['/home']);
    } else {
      this.getMyFavListings();
    }
  }

  getMyFavListings() {
    if (this.userAuth.currentUser.favWorkshops) {
      this.userAuth.currentUser.favWorkshops.forEach(x => {
        this.dataHelper.allWorkshopList.forEach(y => {
          if (y.workshopKey === x) {
            this.favWorkshops.push(y);
          }
        });
      });
    }

    if (this.userAuth.currentUser.favExperts) {
      this.userAuth.currentUser.favExperts.forEach(x => {
        if (this.dataHelper.allUsers[x]) {
          this.favExperts.push(this.dataHelper.allUsers[x]);
        }
      });
    }

    if (this.userAuth.currentUser.favHubs) {
      this.userAuth.currentUser.favHubs.forEach(x => {
        if (this.dataHelper.allAgencies[x]) {
          this.favHubs.push(this.dataHelper.allAgencies[x]);
        }
      });
    }
  }

  workshopDetails(workshop: iExperience) {
    this.dataHelper.workshopDetail = workshop;
    this.router.navigate(['/workshop-details/' + workshop.workshopKey]);
  }

  getWorkshopHost(hostUid: string): string {
    if (this.dataHelper.allUsers[hostUid]) {
      return this.dataHelper.allUsers[hostUid].fullName;
    }
  }

  favUnfavWorkshop(workshop: iExperience, index: number) {
    this.userAuth.favUnfavWorkshop(workshop);
    this.favWorkshops.splice(index, 1);
  }

  isMyFavWorkshop(workshop: iExperience): boolean {
    return this.userAuth.isMyFavWorkshop(workshop);
  }

  expertProfile(expert: iUser) {
    if (expert.isExpert) {
      this.dataHelper.expertDetails = expert;
      this.router.navigate(['/general-profile']);
    } else {
      this.dataHelper.publishSomeData({ showError: 'Expert profile not found!' });
    }
  }

  agencyProfile(agency: iAgency) {
    this.router.navigate([`/agency-profile/${agency.expertUid}`]);
  }

}
