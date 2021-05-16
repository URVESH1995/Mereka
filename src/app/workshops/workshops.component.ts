import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { iExperienceFilters, iMoreFilters } from '../models/workshop-filters';
import { iExperience } from '../models/experience';
import { Router, ActivatedRoute } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {

  showLevelDropdown: boolean;
  showLanguageDropdown: boolean;
  currentPage: number = 1;
  showNav2:boolean = true;

  userSettings = {
    showSearchButton: false,
    inputPlaceholderText: 'Location',
    inputString: ''
  };

  showTopics: boolean = false;
  showAccess: boolean = false
  hideMap: boolean;
  loading: boolean;
  workshopFilters: iExperienceFilters = new iExperienceFilters();
  allWorkshops: iExperience[] = [];
  displayWorkshops: iExperience[] = [];
  allLanguages: string[] = [];
  allTags: string[] = [];

  workshopsLatLngList = [];
  selectedSortBy: string;
  allTopics: string[] = [];
  selectedTopic: string = 'All';
  selectedTopicList: string[] = ['All'];
  sortOptions: string[] = ['Alphabetically', 'Price low to high', 'Price high to low'];
  groupOptions: string[] = ['Group - Friendly', 'For Students', 'Family - Friendly', 'For Couples', 'Kids Activities'];

  rangeBarOptions: Options = {
    floor: 1,
    ceil: 50,
    showTicks: true,
    step: 1
  };

  constructor(
    public router: Router,
    public zone: NgZone,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) {

    this.dataHelper.getObservable().subscribe(data => {
      if (data.allWorkshopsFetched) {
        this.loading = false;
        this.getFilteredWorkshops();
        this.getTopics();
      }
    });
  }

  ngOnInit(): void {
    if (this.dataHelper.workshopFilters) {
      this.workshopFilters = this.dataHelper.workshopFilters;
      this.userSettings = {
        showSearchButton: false,
        inputPlaceholderText: 'Location',
        inputString: this.workshopFilters.location || ''
      };
    }

    if (!this.dataHelper.dataFetching.allWorkshopsFetched) {
      this.loading = true;
    } else {
      this.getFilteredWorkshops();
      this.getTopics();
    }
  }

  updateFilterTopicList(topic) {

    var idx = this.selectedTopicList.indexOf(topic);
    if(idx>=0) {
      this.selectedTopicList.splice(idx,1)
    } else {
      this.selectedTopicList.push(topic)
    }
  }

  getFilteredWorkshops() {
    this.allWorkshops = this.dataHelper.allWorkshopList;

    this.zone.run(() => {
      this.displayWorkshops = this.allWorkshops.filter(x => this.isWorkshopTagMatched(x) &&
        this.isWorkshopTypeMatched(x) && this.isWorkshopDateMatched(x) && this.isWorkshopLocationMatched(x)
        && this.isWorkshopAccessibilityMatched(x) && this.isCategoryMatched(x) && this.isLanguageMatched(x)
        && this.isSkillsetMatched(x) && this.isAnyClassTopicMatched(x) && this.isNumberOfLearnersMatched(x)
        && this.isGroupMatched(x)
      );
    });

    this.getLocationsLatLng();
    this.dataHelper.workshopFilters = this.workshopFilters;
  }

  getTopics() {
    this.allTopics = [];
    this.allWorkshops.forEach(x =>
      x.sessions.forEach(y => {
        this.allTopics.push(y.topic);
      }));
    this.allTopics.unshift('All');
  }

  isWorkshopTagMatched(workshop: iExperience): boolean {
    let tagMatched: boolean;
    if (this.workshopFilters.tag === 'All tags') {
      tagMatched = true;
    } else {
      if (workshop.tags.includes(this.workshopFilters.tag)) {
        tagMatched = true;
      }
    }
    return tagMatched;
  }

  isAnyClassTopicMatched(workshop: iExperience): boolean {
    let topicMatched: boolean;
    if (this.selectedTopicList.includes('All') ) {
      topicMatched = true;
    } else {
      workshop.sessions.forEach(x => {
        if ( this.selectedTopicList.includes(x.topic) ) {
          topicMatched = true;
        }
      });
    }
    return topicMatched;
  }

  isWorkshopTypeMatched(workshop: iExperience): boolean {
    let typeMatched: boolean;
    typeMatched = workshop.experienceType === this.workshopFilters.type;
    return typeMatched;
  }

  isWorkshopDateMatched(workshop: iExperience): boolean {
    let dateMatched: boolean;
    if (!this.workshopFilters.date) {
      dateMatched = true;
    } else {
      workshop.sessions.forEach(y => {
        if (Number(new Date(this.workshopFilters.date)) >= Number(new Date(y.date))) {
          dateMatched = true;
        }
      });
    }
    return dateMatched;
  }

  isWorkshopLocationMatched(workshop: iExperience): boolean {
    let locationMatched: boolean;
    if (!this.workshopFilters.location) {
      locationMatched = true;
    } else {
      if (this.inNearbyRange(workshop) <= 2) {
        locationMatched = true;
      }
    }
    return locationMatched;
  }

  inNearbyRange(workshop: iExperience) {
    var R = 6371;
    var dLat = (workshop.location.lat - this.workshopFilters.lat) * (Math.PI / 180)
    var dLon = (workshop.location.lng - this.workshopFilters.lng) * (Math.PI / 180);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.workshopFilters.lat) * (Math.PI / 180)) * Math.cos((workshop.location.lat) * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  isWorkshopAccessibilityMatched(workshop: iExperience): boolean {
    let accessibilityMatched: boolean;
    if (workshop.accessibility === this.workshopFilters.accessibility || workshop.accessibility === 'both') {
      accessibilityMatched = true;
    }
    return accessibilityMatched;
  }

  isCategoryMatched(workshop: iExperience): boolean {
    let categoryMatched: boolean;
    if (!this.workshopFilters.category) {
      categoryMatched = true;
    } else {
      if (workshop.theme === this.workshopFilters.category) {
        categoryMatched = true;
      }
    }
    return categoryMatched;
  }

  isLanguageMatched(workshop: iExperience): boolean {
    let languageMatched: boolean;
    if (!this.workshopFilters.languages.length) {
      languageMatched = true;
    } else {
      if (this.workshopFilters.languages.includes(workshop.mainLanguage)) {
        languageMatched = true;
      }
    }
    return languageMatched;
  }

  isSkillsetMatched(workshop: iExperience): boolean {
    let skillsetMatched: boolean;
    if (!this.workshopFilters.skillsets.length) {
      skillsetMatched = true;
    } else {
      if (this.workshopFilters.skillsets.includes(workshop.requiredLevelOfExpertise)) {
        skillsetMatched = true;
      }
    }
    return skillsetMatched;
  }

  isNumberOfLearnersMatched(workshop: iExperience): boolean {
    let earnersMatched: boolean;
    if (!this.workshopFilters.moreFilters.numberOfLearners || this.workshopFilters.moreFilters.numberOfLearners === 1) {
      earnersMatched = true;
    } else {
      earnersMatched = this.workshopFilters.moreFilters.numberOfLearners >= workshop.guestLearners;
    }
    return earnersMatched;
  }

  isGroupMatched(workshop: iExperience): boolean {
    let groupMatched: boolean;
    if (!this.workshopFilters.moreFilters.groups.length) {
      groupMatched = true;
    } else {
      if (workshop.targetGroups) {
        this.workshopFilters.moreFilters.groups.forEach(x => {
          if (workshop.targetGroups.includes(x)) {
            groupMatched = true;
          }
        });
      } else {
        groupMatched = true;
      }
    }
    return groupMatched;
  }

  sortDisplayWorkshops() {
    if (this.selectedSortBy === 'Alphabetically') {
      this.displayWorkshops.sort((a, b) => a.experienceTitle.localeCompare(b.experienceTitle));
    } else if (this.selectedSortBy === 'Price high to low') {
      this.displayWorkshops.sort((a, b) => b.ratePerLearner - a.ratePerLearner);
    } else if (this.selectedSortBy === 'Price low to high') {
      this.displayWorkshops.sort((a, b) => a.ratePerLearner - b.ratePerLearner);
    }
  }

  getLocationsLatLng() {
    this.workshopsLatLngList = [];
    this.displayWorkshops.forEach(x => {
      this.workshopsLatLngList.push({
        lat: x.location.lat,
        lng: x.location.lng,
        title: x.experienceTitle
      });
    });
  }

  autoCompleteCallback(selectedData: any) {
    var Data = selectedData.data;
    if (Data) {
      this.userSettings.inputString = Data.description;
      var geometry = Data.geometry;
      var Location = geometry.location;
      this.workshopFilters.lat = Location.lat;
      this.workshopFilters.lng = Location.lng;
      this.workshopFilters.location = Data.description;
      this.getFilteredWorkshops();
    }
  }

  updateAccessibilitySwitch(e: any) {
    this.workshopFilters.accessibility = e.target.checked ? 'everybody' : 'members';
    this.getFilteredWorkshops();
  }

  updateSkillsets(skillset: string) {
    const index = this.workshopFilters.skillsets.indexOf(skillset);
    if (index >= 0) {
      this.workshopFilters.skillsets.splice(index, 1);
    } else {
      this.workshopFilters.skillsets.push(skillset);
    }
    this.getFilteredWorkshops();
  }

  isSkillsetAdded(skillset: string) {
    return this.workshopFilters.skillsets.includes(skillset);
  }

  updateLanguages(language: string) {
    const index = this.workshopFilters.languages.indexOf(language);
    if (index >= 0) {
      this.workshopFilters.languages.splice(index, 1);
    } else {
      this.workshopFilters.languages.push(language);
    }
    this.getFilteredWorkshops();
  }

  isLanguageAdded(language: string) {
    return this.workshopFilters.languages.includes(language);
  }

  isGroupAdded(group: string) {
    return this.workshopFilters.moreFilters.groups.includes(group);
  }

  updateGroups(group: string) {
    const index = this.workshopFilters.moreFilters.groups.indexOf(group);
    if (index >= 0) {
      this.workshopFilters.moreFilters.groups.splice(index, 1);
    } else {
      this.workshopFilters.moreFilters.groups.push(group);
    }
  }

  isMyWorkshop(workshop: iExperience) {
    return this.userAuth.currentUser.uid === workshop.uid;
  }

  switchWorkshopAccessibility(accessibility: string) {
    this.workshopFilters.accessibility = accessibility;
    this.getFilteredWorkshops();
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

  checkLocationString() {
    setTimeout(() => {
      const el: any = document.getElementById('search_places');
      if (!el.value) {
        this.workshopFilters.location = null;
        this.getFilteredWorkshops();
      }
    }, 500);
  }

  resetMoreFilters() {
    this.workshopFilters.moreFilters = new iMoreFilters();
    this.getFilteredWorkshops();
  }

  updateSelectedLearners(selectedLearners: number) {
    this.workshopFilters.moreFilters.numberOfLearners = selectedLearners;
  }

  checkNgxInput() {
    setTimeout(() => {
      const el: any = document.getElementById('search_places');
      if (!el.value) {
        this.workshopFilters.location = null;
        this.workshopFilters.lat = null;
        this.workshopFilters.lng = null;
        this.getFilteredWorkshops();
      }
    }, 500);
  }

  favUnfavWorkshop(workshop: iExperience) {
    this.userAuth.favUnfavWorkshop(workshop);
  }

  isMyFavWorkshop(workshop: iExperience): boolean {
    return this.userAuth.isMyFavWorkshop(workshop);
  }

  profileViewMode(): string {
    return localStorage.getItem('profileViewMode') || 'learner';
  }

  updateViewMode(mode: string) {
    localStorage.setItem('profileViewMode', mode);
    if (mode === 'expert') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/learner-dashboard']);
    }
  }

}
