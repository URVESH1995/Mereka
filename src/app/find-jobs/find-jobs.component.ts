import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iPostJob } from '../models/post-job';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-find-jobs',
  templateUrl: './find-jobs.component.html',
  styleUrls: ['./find-jobs.component.scss']
})
export class FindJobsComponent implements OnInit {

  loading: boolean;
  displayJobList: iPostJob[] = [];
  allJobList: iPostJob[] = [];
  imageFormats: string[] = ['PNG', 'png', 'jpg', 'JPG', 'jpeg', 'JPEG'];
  selectedFilterObj: any;
  oneDayTimestamp: number = 86400000;

  allCategories: string[] = [];
  allLocations: string[] = [];
  allLanguages: string[] = [];

  selectedFilters = {
    jobType: '',
    duration: null,
    category: '',
    location: '',
    language: ''
  }

  jobFilters: any[] = [
    {
      title: 'All Locations',
      filters: [
        { display: 'All Locations', value: 'allLocations' },
      ]
    },
    {
      title: 'All type of offers',
      filters: [
        { display: 'All type of offers', value: 'Alltypes', key: 'jobType' },
        { display: 'Quick Job', value: 'Quick Job', key: 'jobType' },
        { display: 'Longer Commitment', value: 'Longer Commitment', key: 'jobType' },
      ]
    },
    {
      title: 'All creative fields',
      filters: [
        { display: 'All creative fields', value: 'allFields' }
      ]
    },
    {
      // title: 'This Month',
      title: 'Last 6 Months',
      filters: [
        { display: 'This Month', value: 'thisMonth', key: 'duration' },
        { display: 'Last 7 days', value: 7 * this.oneDayTimestamp, key: 'duration' },
        { display: 'Last 14 days', value: 14 * this.oneDayTimestamp, key: 'duration' },
        { display: 'Last 3 Months', value: 90 * this.oneDayTimestamp, key: 'duration' },
        { display: 'Last 6 Months', value: 180 * this.oneDayTimestamp, key: 'duration' }
      ]
    },
  ];

  public searchValue: string = '';
  public searchFields: any = ['jobTitle', 'jobType'];

  constructor(
    public router: Router,
    public zone: NgZone,
    public userAuth: UserAuthService,
    public activeRoute: ActivatedRoute,
    public location: Location,
    public dataHelper: DataHelperService
  ) {
    this.dataHelper.postedJobDetail = null;

  }


  ngOnInit(): void {
    if (this.dataHelper.dataFetching.allJobsFetched || this.dataHelper.jobSearchQuery) {
      // 1. When simple navigation back and forward
      // 2. When search from header searchbar from any other page
      this.applyMultiFilters('updateSideFilters');
    }

    else {
      // 1. When reload application, wait for service to fetch data
      // 2. When add search query in URL, wait to fetch data
      this.loading = true;
    }

    // 1. When search from header searchbar from this page
    // 2. When service fetched all the data, & stop loading
    this.dataHelper.getObservable().subscribe((data) => {
      if (data.jobSearchQuery) {
        this.dataHelper.jobSearchQuery = this.activeRoute.snapshot.params.searchQuery || data.jobSearchQuery;
        this.applyMultiFilters('updateSideFilters');
      }
    });
  }


  applyMultiFilters(updateSideFilters?) {
    if (updateSideFilters) {
      this.selectedFilters = {
        jobType: '',
        duration: 180 * this.oneDayTimestamp,
        category: '',
        location: '',
        language: ''
      }
    }

    this.displayJobList = this.dataHelper.allJobs.filter(x => this.isNotMyJob(x) &&
      this.isOfferTypeMatched(x) && this.isDurationMatched(x) && this.isCategoryMatched(x)
      && this.isLocationMatched(x) && this.isLanguageMatched(x) && this.isSearchQueryMatched(x)
    );
    if (updateSideFilters) {
      this.getSideFilters();
    }
    this.sortDiplayJobs();
  }


  isNotMyJob(job: iPostJob): boolean {
    return job.uid !== this.userAuth.currentUser.uid;
  }


  isSearchQueryMatched(x: iPostJob): boolean {
    let queryMatched: boolean = false;
    const searchQuery = this.dataHelper.jobSearchQuery;
    if (searchQuery && searchQuery !== 'fetchAllJobs') {
      this.location.replaceState('/find-jobs/' + searchQuery);
      const searchQueryParts = searchQuery.split(' ');
      if (searchQueryParts[1]) {
        if (x.jobTitle.toLowerCase().match(searchQueryParts[0].toLowerCase())
          || x.jobTitle.toLowerCase().match(searchQueryParts[1].toLowerCase())) {
          queryMatched = true;
        }
      } else if (x.jobTitle.toLowerCase().match(searchQuery.toLowerCase())) {
        queryMatched = true;
      }
    } else {
      queryMatched = true;
    }
    return queryMatched;
  }


  isOfferTypeMatched(job: iPostJob): boolean {
    let offerMatched: boolean = true;
    if (!this.selectedFilters.jobType || this.selectedFilters.jobType === 'Alltypes') {
      offerMatched = true;
    } else if (job.jobType === this.selectedFilters.jobType) {
      offerMatched = true;
    } else {
      offerMatched = false;
    }
    return offerMatched;
  }


  isDurationMatched(job: iPostJob): boolean {
    let durationMatched: boolean = true;
    if (this.selectedFilters.duration === 'thisMonth') {
      durationMatched = true;
    } else {
      const lastXDaysTimestamp = Number(new Date()) - Number(this.selectedFilters.duration);
      if (job.timestamp >= lastXDaysTimestamp) {
        durationMatched = true;
      } else {
        durationMatched = false;
      }
    }
    return durationMatched;
  }


  isCategoryMatched(job: iPostJob): boolean {
    let categoryMatched: boolean = true;
    if (!this.selectedFilters.category) {
      categoryMatched = true;
    } else if (this.selectedFilters.category === job.category) {
      categoryMatched = true;
    } else {
      categoryMatched = false;
    }
    return categoryMatched;
  }


  isLocationMatched(job: iPostJob): boolean {
    let locationMatched: boolean = true;
    if (!this.selectedFilters.location) {
      locationMatched = true;
    } else if (this.selectedFilters.location === job.preferredLocation) {
      locationMatched = true;
    } else {
      locationMatched = false;
    }
    return locationMatched;
  }


  isLanguageMatched(job: iPostJob): boolean {
    let languageMatched: boolean = true;
    if (!this.selectedFilters.language || !job.languages) {
      languageMatched = true;
    } else if (job.languages.includes(this.selectedFilters.language)) {
      languageMatched = true;
    } else {
      languageMatched = false;
    }
    return languageMatched;
  }


  isPostedThisMonth(job: iPostJob): boolean {
    const todayDate = new Date();
    const startOfCurrentMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    return job.timestamp >= Number(startOfCurrentMonth);
  }


  getJobImage(job: iPostJob): string {
    let imageUrl: string = '/assets/imgs/notify-img.PNG';
    if (job.fileUrls) {
      job.fileUrls.forEach(x => {
        if (this.imageFormats.includes(x.name.split('.').pop())) {
          imageUrl = x.url;
        }
      });
    }
    return imageUrl;
  }


  applySideFilters(key, value) {
    this.selectedFilters[key] = value;
    this.applyMultiFilters();
  }


  applyNavbarFilters(filterObj) {
    this.selectedFilters[filterObj.key] = filterObj.value;
    this.applyMultiFilters();
  }


  sortDiplayJobs() {
    this.loading = false;
    if (this.selectedFilters.duration === 'thisMonth') {
      this.displayJobList = this.displayJobList.filter(x => this.isPostedThisMonth(x));
    }
    this.displayJobList.sort((a, b) => b.timestamp - a.timestamp);
  }


  getSideFilters() {
    this.zone.run(() => {
      this.allCategories = [];
      this.allLocations = [];
      this.allLanguages = [];

      this.displayJobList.forEach(x => {
        if (!this.allCategories.includes(x.category)) {
          this.allCategories.push(x.category);
        }
        if (!this.allLocations.includes(x.preferredLocation)) {
          this.allLocations.push(x.preferredLocation);
        }
        if (x.languages) {
          x.languages.forEach(language => {
            if (!this.allLanguages.includes(language)) {
              this.allLanguages.push(language);
            }
          });
        }
      });
    });
  }


  isActiveFilter(index): boolean {
    let activeFilter: boolean;
    if (index === 0) {
      activeFilter = false;
    } else if (index === 1) {
      activeFilter = this.selectedFilters.jobType ? true : false;
    } else if (index === 2) {
      activeFilter = false;
    } else {
      activeFilter = this.selectedFilters.duration ? true : false;
    }
    return activeFilter;
  }


  jobDetails(job: iPostJob) {
    this.dataHelper.postedJobDetail = job;
    this.router.navigate(['/job-detail/' + job.key]);
  }


}
