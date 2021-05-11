import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../../services/data-helper.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { iExperience } from '../../../models/experience';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-hub-experiences',
  templateUrl: './hub-experiences.component.html',
  styleUrls: ['./hub-experiences.component.scss']
})
export class HubExperiencesComponent implements OnInit {

  activeIndex: number;
  selectedTopic: string;
  selectedType: string;
  selectedSort: string;
  years: number[] = [];

  hubWorkshops: iExperience[] = [];
  workshopType: string = 'physical';
  workshopTypes: string[] = ['Workshop', 'Course'];
  sortList: string[] = ['Recent', 'Popular', 'A - Z'];

  drafts: Array<iExperience> = [];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit(): void {
    this.getYearsAndDates();
    this.getHubWorkshops();
    this.getDrafts();
  }

  getYearsAndDates() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 70; i--) {
      this.years.push(i);
    }
  }

  getHubWorkshops() {
    const myUid = this.userAuth.currentUser.uid;
    this.hubWorkshops = this.dataHelper.allWorkshopList.filter(x => x.uid === myUid);
    this.filterList();
  }

  getDrafts() {
    firebase.database().ref().child('workshops')
      .orderByChild("uid")
      .equalTo(this.userAuth.currentUser.uid)
      .once('value', (snapshot) => {
        const workshops = snapshot.val();
        for (var key in workshops) {
          if (workshops[key].isDraft)
            this.drafts.push(workshops[key]);
        }

        this.drafts.sort((a, b) => b.timestamp - a.timestamp);
      });
  }

  removeWorkshop(index: number) {
    this.activeIndex = index;
  }

  editWorkshop(workshop: iExperience) {
    this.dataHelper.isEditWorkshop = true;
    this.dataHelper.createExperienceObj = workshop;
    this.router.navigate(['/create-workshop']);
  }

  toggleFeatured(workshop: iExperience) {
    workshop.isFeatured = !workshop.isFeatured;

    firebase.database().ref(`/workshops/${workshop.workshopKey}/isFeatured`).set(workshop.isFeatured);
    this.dataHelper.publishSomeData({ showSuccess: 'Workshop updated successfully!' });
  }

  workshopDetails(workshop: iExperience) {
    this.dataHelper.workshopDetail = workshop;
    this.router.navigate(['/workshop-details/' + workshop.workshopKey]);
  }

  removeWorkshopFromFirebase() {
    const self = this;
    const workshop = self.hubWorkshops[self.activeIndex];
    firebase.database().ref().child(`/workshops/${workshop.workshopKey}`)
      .remove().then(() => {
        self.updateLocalData(workshop.workshopKey);
        self.dataHelper.publishSomeData({ showSuccess: 'Workshop removed successfully!' });
      });
  }

  updateLocalData(workshopKey: string) {
    this.hubWorkshops.splice(this.activeIndex, 1);
    const index = this.dataHelper.allWorkshopList.findIndex(x => x.workshopKey === workshopKey);
    if (index >= 0) {
      this.dataHelper.allWorkshopList.splice(index, 1);
    }
  }

  filterList() {
    this.hubWorkshops = this.hubWorkshops.filter(x =>
      this.isWorkshopTypeMatched(x) && this.isCategoryMatched(x) && this.isThemeMatched(x)
    );
  }

  isWorkshopTypeMatched(workshop: iExperience): boolean {
    let typeMatched: boolean;
    if (!this.selectedType) {
      typeMatched = true;
    } else {
      typeMatched = workshop.experienceCategory.toLowerCase() === this.selectedType.toLowerCase();
    }
    return typeMatched;
  }

  isCategoryMatched(workshop: iExperience): boolean {
    let categoryMatched: boolean;
    categoryMatched = workshop.experienceType.toLowerCase() === this.workshopType.toLowerCase();
    return categoryMatched;
  }

  isThemeMatched(workshop: iExperience): boolean {
    let categoryMatched: boolean;
    if (!this.selectedTopic) {
      categoryMatched = true;
    } else {
      categoryMatched = workshop.theme === this.selectedTopic;
    }
    return categoryMatched;
  }

  sortDisplayWorkshops() {
    if (this.selectedSort === 'Recent') {
      this.hubWorkshops.sort((a, b) => b.timestamp - a.timestamp);
    } else if (this.selectedSort === 'Popular') {
      this.hubWorkshops.sort((a, b) => b.avgRating - a.avgRating);
    } else if (this.selectedSort === 'A - Z') {
      this.hubWorkshops.sort((a, b) => a.experienceTitle.localeCompare(b.experienceTitle))
    }
  }

  clearFilters() {
    this.selectedSort = null;
    this.selectedType = null;
    this.selectedTopic = null;
    this.workshopType = 'physical';
    this.getHubWorkshops();
  }

}