import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { iAgency } from '../models/agency';
import { iExperience } from '../models/experience';
import { iUser } from '../models/user';
import * as firebase from 'firebase';

@Component({
  selector: 'app-agency-profile',
  templateUrl: './agency-profile.component.html',
  styleUrls: ['./agency-profile.component.scss']
})
export class AgencyProfileComponent implements OnInit {

  loading: boolean;
  myOwnAgency: boolean;
  joinedAgency: boolean;
  agencyDetails: iAgency = new iAgency();
  agencyWorkshops: iExperience[] = [];
  mainSlides: any[] = [];
  agencyExperts: iUser[] = [];

  currentPage: number = 1;
  selectedTag: string = 'All';

  activeSwitch: string = 'physical';
  selectedExpertise: string = 'All';
  sideMenuItems: string[] = ['All', 'Administration', 'Data Science & Analyrucs', 'Design & Creativity',
    'Electronics', 'Engineering & Architecture', 'Sales & Digital Marketing', 'Web, Mobile & Software Development', 'Writing'];

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
  ) {
  }

  ngOnInit(): void {
    if (this.dataHelper.dataFetching.allWorkshopsFetched) {
      this.getHubDetails();
    } else {
      this.loading = true;
      this.dataHelper.getObservable().subscribe(data => {
        if (data.allWorkshopsFetched) {
          this.loading = false;
          this.getHubDetails();
        }
      });
    }
  }

  getHubDetails() {
    const hubId = this.activeRoute.snapshot.params.hubId;
    this.agencyDetails = this.dataHelper.allAgencies[hubId] || new iAgency();
    if (!this.agencyDetails.expertUid) {
      this.router.navigate(['/home']);
    } else {
      if (!this.agencyDetails.memberRequests) {
        this.agencyDetails.memberRequests = [];
      }
      if (!this.agencyDetails.agencyMembers) {
        this.agencyDetails.agencyMembers = [];
      }
      this.filterWorkshops();
      if (this.agencyDetails.experts) {
        this.getHubExperts();
      }
      this.myOwnAgency = this.agencyDetails.expertUid === this.userAuth.currentUser.uid;
      this.joinedAgency = false;
      if(this.agencyDetails.expertUid == this.userAuth.currentUser.agencyId && 
        this.agencyDetails.experts.findIndex(obj=> obj.uid == this.userAuth.currentUser.uid)>=0 ) {
        this.joinedAgency = true;
      }
    }
  }

  filterExperts() {

  }

  getHubExperts() {
    this.agencyDetails.experts.forEach(x => {
      if (this.dataHelper.allUsers[x.uid]) {
        this.agencyExperts.push(this.dataHelper.allUsers[x.uid]);
      }
    });
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
      this.agencyWorkshops = this.dataHelper.allWorkshopList.filter(x =>
        x.experienceType === this.activeSwitch && x.uid === this.agencyDetails.expertUid
      );
    } else {
      this.agencyWorkshops = this.dataHelper.allWorkshopList.filter(x =>
        x.theme === this.selectedTag && x.experienceType === this.activeSwitch
        && x.uid === this.agencyDetails.expertUid
      );
    }
    this.mainSlides = [];
    var pArray: any = [];
    for (var i = 0, j = this.agencyWorkshops.length; i < j; i++) {
      pArray.push(JSON.parse(JSON.stringify(this.agencyWorkshops[i])));
      if ((i + 1) % 3 == 0) {
        this.mainSlides.push(JSON.parse(JSON.stringify(pArray)));
        pArray = [];
      }
    }
    if (pArray.length) {
      this.mainSlides.push(JSON.parse(JSON.stringify(pArray)));
    }
  }

  favUnfavWorkshop(workshop: iExperience) {
    this.userAuth.favUnfavWorkshop(workshop);
  }

  isMyFavWorkshop(workshop: iExperience): boolean {
    return this.userAuth.isMyFavWorkshop(workshop);
  }

  becomeAgencyMember() {
    if (!this.userAuth.currentUser.uid) {
      this.dataHelper.openSpecificModal('loginModalOpener');
      return;
    }
    if (!this.userAuth.currentUser.myAgency && !this.userAuth.currentUser.agencyId &&
      this.userAuth.currentUser.learnerProfile) {
      const myUid = this.userAuth.currentUser.uid;
      if (this.agencyDetails.memberRequests.includes(myUid)) {
        this.dataHelper.publishSomeData({ showError: 'You have already submitted a join request!' });
      } else {
        let alreadyMember: boolean;
        this.agencyDetails.agencyMembers.forEach(x => {
          if (x.uid === myUid) {
            alreadyMember = true;
          }
        });
        if (alreadyMember) {
          this.dataHelper.publishSomeData({ showError: 'You are already a member!' });
        } else {
          this.sendHubJoinRequest(myUid);
        }
      }
    } else {
      this.dataHelper.publishSomeData({ showError: 'You are already a member of some hub or have incomplete learner profile!' });
    }
  }

  sendHubJoinRequest(myUid: string) {
    this.agencyDetails.memberRequests.push(myUid);
    firebase.database().ref().child(`/agencies/${this.agencyDetails.expertUid}/memberRequests`)
      .set(this.agencyDetails.memberRequests).then(() => {
        this.dataHelper.publishSomeData({ showSuccess: 'Hub join request submitted successfully!' });
        this.dataHelper.allAgencies[this.agencyDetails.expertUid] = this.agencyDetails;
      });
  }

  expertProfile(expert: iUser) {
    if (expert.isExpert) {
      this.dataHelper.expertDetails = expert;
      this.router.navigate(['/general-profile']);
    } else {
      this.dataHelper.publishSomeData({ showError: 'Expert profile not found!' });
    }
  }

  isFavHub(): boolean {
    return this.userAuth.isMyFavAgency(this.agencyDetails.expertUid);
  }

  favUnfavHub() {
    this.userAuth.favUnfavAgency(this.agencyDetails.expertUid);
  }

}
