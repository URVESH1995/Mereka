import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import { iExperience } from '../models/experience';
import { iAgency } from '../models/agency';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentPage: number = 1;
  activeSwitch: string = 'physical';
  selectedTag: string = 'All';
  workshopTags: string[] = [];

  allWorkshops: iExperience[] = [];
  parentSlides: any[] = [];
  mainSlides: any[] = [];
  featuredVendors: iAgency[] = [];

  discoverItems: any[] = [
    { imageUrl: '/assets/imgs/disc1.png' },
    { imageUrl: '/assets/imgs/disc2.png' },
    { imageUrl: '/assets/imgs/disc3.png' },
  ];

  featuredSpacesBlocks: any[] = [
    { imageUrl: '/assets/imgs/elLab.png', title: 'Electronics Lab' },
    { imageUrl: '/assets/imgs/dcRoom.png', title: 'Digital Conference Room' },
    { imageUrl: '/assets/imgs/wwLab.png', title: 'Woodworking Lab' },
    { imageUrl: '/assets/imgs/kStudio.png', title: 'Kitchen Studio' },
    { imageUrl: '/assets/imgs/uVenue.png', title: 'Unusual Venue' },
    { imageUrl: '/assets/imgs/cwStudio.png', title: 'Co-working Studio' },
  ];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) {
    this.dataHelper.workshopFilters = null;
    this.dataHelper.getObservable().subscribe(data => {
      if (data.allWorkshopsFetched) {
        this.getAllWorkshops();
      } else if (data.allAgenciesFetched) {
        this.getAllAgencies();
      }
    });
  }


  ngOnInit(): void {
    this.getAllWorkshops();
    this.getAllAgencies();
  }

  getAllWorkshops() {
    this.allWorkshops = this.dataHelper.allWorkshopList || [];
    this.allWorkshops = this.allWorkshops.filter(x => x.experienceType === this.activeSwitch);
    this.filterWorkshopSlides();
  }

  filterWorkshopSlides() {
    var pArray = [];
    this.mainSlides = [];
    for (var i = 0, j = this.allWorkshops.length; i < j; i++) {
        pArray.push(this.allWorkshops[i]);
        if (pArray.length == 3) {
          this.mainSlides.push(JSON.parse(JSON.stringify(pArray)));
          pArray = [];
        }
    } if (pArray.length) {
      this.mainSlides.push(JSON.parse(JSON.stringify(pArray)))
    }
  }

  getAllAgencies() {
    this.parentSlides = [];
    var pArray: any = [];
    this.featuredVendors = [];
    const allAgencies = this.dataHelper.allAgencies;
    for (const key in allAgencies) {
      var temp = allAgencies[key];
      if (temp.isFeatured && temp.isApproved) {
        pArray.push(temp);
        if (pArray.length == 3) {
          this.parentSlides.push(JSON.parse(JSON.stringify(pArray)));
          pArray = [];
        }
      } else if (temp.isApproved) {
        this.featuredVendors.push(temp);
      }
    }
    if (pArray.length) {
      this.parentSlides.push(JSON.parse(JSON.stringify(pArray)));
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

  isMyWorkshop(workshop: iExperience) {
    return this.userAuth.currentUser.uid === workshop.uid;
  }

  filterWorkshops() {
    if (this.selectedTag === 'All') {
      this.allWorkshops = this.dataHelper.allWorkshopList.filter(x => x.experienceType === this.activeSwitch);
    } else {
      this.allWorkshops = this.dataHelper.allWorkshopList.filter(x =>
        x.theme === this.selectedTag && x.experienceType === this.activeSwitch
      );
    }
    this.filterWorkshopSlides();
  }

  favUnfavWorkshop(workshop: iExperience) {
    this.userAuth.favUnfavWorkshop(workshop);
  }

  isMyFavWorkshop(workshop: iExperience): boolean {
    return this.userAuth.isMyFavWorkshop(workshop);
  }

  agencyProfile(agency: iAgency) {
    this.router.navigate([`/agency-profile/${agency.expertUid}`]);
  }


}
