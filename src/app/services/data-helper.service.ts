import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { iUser, iExpertProfile, iLearnerProfile } from '../models/user';
import { Router } from '@angular/router';
import { iPostJob } from '../models/post-job';
import { iAgency } from '../models/agency';
import { HttpClient } from "@angular/common/http";
import { Papa } from 'ngx-papaparse';
import { iChatNode } from '../models/chat-node';
import { iExperienceFilters } from '../models/workshop-filters';
import { iBookWorkshop } from '../models/book-workshop';
import { iPushNotification } from '../models/push-notification';
import { iJobBid } from '../models/job-bid';
import { iStrings } from '../models/enums';
import { iExperience } from '../models/experience';
import { iBookExperience } from '../models/book-experience';
import * as firebase from 'firebase';
import { iTransaction } from '../models/transaction';


@Injectable({
  providedIn: 'root'
})
export class DataHelperService {

  public fooSubject = new Subject<any>();

  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  countries: string[] = ['Malaysia', 'Japan', 'Africa', 'Canada', 'England', 'Pakistan', 'India', 'China'];
  languages: string[] = ['English', 'Urdu', 'Arabic', 'Chinese', 'Hindi', 'French', 'Portuguese', 'Spanish'];
  years: number[] = [];
  dates: number[] = [];

  expertUserProfile: iUser;
  displayLoading: boolean;
  marekaServiceFeePerHour: number = 20;  //Percentage
  postJobObj: iPostJob;
  isEditJob: boolean;
  displayFilters: boolean;

  workshopBookedAs: string;
  myPostedJobs: iPostJob[] = [];
  allJobs: iPostJob[] = [];
  postedJobDetail: iPostJob;
  dataFetching: any = {};
  selectedSkill: string;
  allUsers: any = {};
  allUsersList: iUser[] = [];
  jobSearchQuery: string;
  bookWorkshopQty: number;
  contractDetails: iJobBid;
  payableMilestoneIndex: number;

  expertDetails: iUser;
  myAgency: iAgency;

  myWorkshopObj: iExperience;
  isEditWorkshop: boolean;
  workshopDetail: iExperience;
  allWorkshopList: iExperience[];
  myWorkshopBookingsList: iBookExperience[];
  allWorkshopBookingsList: iBookWorkshop[];
  bookWorkshopPayload: iBookExperience;

  educationInstitutions = [];
  jobCategoriesData: any = {};
  allAgencies: any = {};
  chatNodeObj: iChatNode;
  activeChatTab: string;
  workshopFilters: iExperienceFilters;
  acceptJobProposalBid: iJobBid;
  appData: any = {};
  allNotifications: iPushNotification[] = [];
  inviteNotifications: iPushNotification[] = [];

  selectedHubId: string;
  learnerProfile: iLearnerProfile;
  expertProfile: iExpertProfile;
  createAgencyData: iAgency;
  createExperienceObj: iExperience;
  notificationSettings = {};
  privacySettings = {};
  allTransactions: iTransaction[] = [];

  suggestedWorkshopTags: string[] = [
    'Alpha', 'Beta', 'Facebook', 'Google', 'History', 'Class', 'Culture'
  ];

  workshopCategories: string[] = [
    'Architecture', 'Art & Culture', 'Arts & Crafts', 'Biology & Life Sciences', 'Business & Management',
    'Creative', 'Chemistry', 'Communication', 'Cooking', 'Computer Science', 'Data Analysis & Statistics',
    'Design', 'DIY', 'Economics & Finance', 'Education & Teacher Training', 'Electronics', 'Energy & Earth',
    'Engineering', 'Environmental', 'Ethics', 'Food & Nutrition', 'Health & Safety', 'History', 'Humanities',
    'Language', 'Law', 'Literature', 'Math', 'Metal Working', 'Music', 'Philanthropy', 'Philosophy & Ethics',
    'Physics', 'Science', 'Social Sciences', 'Upcycling', 'Wood Working'
  ];

  constructor(
    public papa: Papa,
    private http: HttpClient,
    public router: Router,
  ) {
    this.getYearsAndDates();
    this.fetchAllData();
    this.convertCSVsintoArray();
  }

  fetchAllData() {
    this.getAllTransactions();
    this.getSettings();
    this.getAppData();
    this.getAllAgencies();
    this.getAllUsers();
    this.getMyJobs();
  }

  getAllTransactions() {
    const self = this;
    firebase.database().ref().child('allTransactions')
      .once('value', (snapshot) => {
        const data = snapshot.val();
        self.allTransactions = [];
        for (var key in data) {
          const transaction: iTransaction = data[key];
          self.allTransactions.push(transaction);
        }
      });
  }

  getSettings() {
    const self = this;
    firebase.database().ref().child('notificationSettings')
      .once('value', (snapshot) => {
        self.notificationSettings = snapshot.val() || {};
      });

    firebase.database().ref().child('privacySettings')
      .once('value', (snapshot) => {
        self.privacySettings = snapshot.val() || {};
      });
  }

  convertCSVsintoArray() {
    this.convertEducationInstitutionsCSV();
    this.convertJobCategoriesCSV();
  }

  convertEducationInstitutionsCSV() {
    this.educationInstitutions = [];
    const filePath: string = 'assets/Education_Insititutions.csv';
    this.http.get(filePath, { responseType: 'text' })
      .subscribe(
        data => {
          this.papa.parse(data, {
            complete: (result) => {
              for (var i = 1; i < result.data.length - 1; i++) {
                const obj = result.data[i];
                this.educationInstitutions.push({
                  id: obj[0],
                  name: obj[1],
                  url: obj[2],
                });
              }
            }
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  convertJobCategoriesCSV() {
    this.jobCategoriesData = {};
    const filePath: string = 'assets/Job_Categories.csv';
    this.http.get(filePath, { responseType: 'text' })
      .subscribe(
        data => {
          this.papa.parse(data, {
            complete: (result) => {
              for (var i = 1; i < result.data.length - 1; i++) {
                const obj = result.data[i];
                if (!this.jobCategoriesData[obj[2]]) {
                  this.jobCategoriesData[obj[2]] = {
                    category: obj[2]
                  };
                }
                if (!this.jobCategoriesData[obj[2]].specialities) {
                  this.jobCategoriesData[obj[2]].specialities = [];
                }

                this.jobCategoriesData[obj[2]].specialities.push({
                  name: obj[0],
                  skills: this.splitAndTrimSkills(obj),
                });
              }
              this.publishSomeData({ jobCategoriesDataFetched: true });
            }
          });
        },
        error => {
          console.log(error);
        }
      );
  }


  splitAndTrimSkills(arrayItem: any[]): string[] {
    const skills = [];
    for (var j = 3; j < arrayItem.length - 1; j++) {
      if (arrayItem[j]) {
        const data = arrayItem[j].split(',');
        data.forEach(x => {
          if (!skills.includes(x.trim())) {
            skills.push(x.trim());
          }
        });
      }
    }
    return skills;
  }


  getAppData() {
    const self = this;
    firebase.database().ref().child('appData')
      .on('value', (snapshot) => {
        self.appData = snapshot.val();
        if (!self.appData.faqs) {
          self.appData.faqs = [];
        }
        self.dataFetching.appDataFetched = true;
        self.publishSomeData({ appDataFetched: true });
      });
  }


  getAllAgencies() {
    const self = this;
    const uid = localStorage.getItem('uid');
    firebase.database().ref().child('agencies')
      .once('value', (snapshot) => {
        self.allAgencies = snapshot.val();
        self.createAgencyData = self.allAgencies[uid];
        self.dataFetching.allAgenciesFetched = true;
        self.publishSomeData({ allAgenciesFetched: true });
      });
  }


  getAllUsers() {
    const self = this;
    firebase.database().ref().child('users')
      .once('value', (snapshot) => {
        self.allUsers = snapshot.val();
        self.allUsersList = [];
        for (var key in self.allUsers) {
          self.allUsersList.push(self.allUsers[key])
        }
        self.getAllJobs();
        self.getMyAgencyProfile();
        self.getAllWorkshops();
        self.dataFetching.allUsersFetched = true;
        self.publishSomeData({ allUsersFetched: true });
      });
  }


  getMyAgencyProfile() {
    if (localStorage.getItem('userLoggedIn') === 'true') {
      const self = this;
      const currentUser: iUser = JSON.parse(localStorage.getItem('userData'));
      if (currentUser.isExpert) {
        firebase.database().ref().child(`/agencies/${currentUser.uid}`)
          .on('value', (snapshot) => {
            self.myAgency = snapshot.val();
            self.allAgencies[self.myAgency.expertUid] = self.myAgency;
            self.publishSomeData({ myAgencyFetched: true });
          });
      }
    }
  }


  getAllJobs() {
    const self = this;
    firebase.database().ref().child('jobs')
      .once('value', (snapshot) => {
        const data = snapshot.val();
        self.allJobs = [];
        for (var key in data) {
          const job: iPostJob = data[key];
          self.allJobs.push(job);
        }
        self.getNotifications();
        self.dataFetching.allJobsFetched = true;
        self.publishSomeData({ allJobsFectchedInService: true });
        self.publishSomeData({ jobSearchQuery: 'fetchAllJobs' });
      });
  }


  getNotifications() {
    const self = this;
    const uid = localStorage.getItem('uid');
    const currentUser = JSON.parse(localStorage.getItem('userData')) || new iUser();

    if (currentUser.email) {
      firebase.database().ref().child(`/inviteExpertNotifications/`)
        .orderByChild('receiver').equalTo(currentUser.email)
        .once('value', (snapshot) => {
          self.inviteNotifications = [];
          const data = snapshot.val();
          if (data) {
            for (var key in data) {
              const notification: iPushNotification = data[key];
              notification.key = key;
              self.inviteNotifications.push(notification);
            }
          }
          self.inviteNotifications.sort((a, b) => b.timestamp - a.timestamp);
        });
    }

    firebase.database().ref().child(`/notifications/${uid}`)
      .once('value', (snapshot) => {
        self.allNotifications = [];
        const data = snapshot.val();
        if (data) {
          for (var key in data) {
            const notification: iPushNotification = data[key];
            notification.key = key;
            self.allNotifications.push(notification);
          }
        }
        self.allNotifications.sort((a, b) => b.timestamp - a.timestamp);
        self.dataFetching.allNotificationsFetched = true;
        self.publishSomeData({ allNotificationsFetched: true });
      });
  }


  getMyJobs() {
    const self = this;
    const uid = localStorage.getItem('uid');
    firebase.database().ref().child('jobs')
      .orderByChild('uid').equalTo(uid)
      .on('value', (snapshot) => {
        self.myPostedJobs = [];
        const postedJobs = snapshot.val();
        for (var key in postedJobs) {
          self.myPostedJobs.push(postedJobs[key]);
        }
        self.dataFetching.postedJobsFetched = true;
        self.publishSomeData({ myPostedJobsFetched: true });
      });
  }


  getAllWorkshops() {
    const self = this;
    self.allWorkshopList = [];
    firebase.database().ref().child('workshops')
      .once('value', (snapshot) => {
        const workshops = snapshot.val();
        for (var key in workshops) {
          if (!workshops[key].isDraft)
            self.allWorkshopList.push(workshops[key]);
        }
        self.getMyWorkshopsBookings();
        self.allWorkshopList.sort((a, b) => b.timestamp - a.timestamp);
        self.dataFetching.allWorkshopsFetched = true;
        self.publishSomeData({ allWorkshopsFetched: true });
      });
  }


  getMyWorkshopsBookings() {
    const self = this;
    const uid = localStorage.getItem('uid');
    firebase.database().ref().child('workshopBookings')
      .once('value', (snapshot) => {
        self.allWorkshopBookingsList = [];
        self.myWorkshopBookingsList = [];
        const workshopBookings = snapshot.val();
        for (var key in workshopBookings) {
          const bookingPayload: iBookExperience = workshopBookings[key];
          bookingPayload.workshopDetails = this.allWorkshopList.filter(x =>
            x.workshopKey === bookingPayload.workshopKey)[0];
          if (bookingPayload.bookedBy === uid) {
            self.myWorkshopBookingsList.push(workshopBookings[key]);
          }
          self.allWorkshopBookingsList.push(workshopBookings[key]);
        }
        self.dataFetching.myWorkshopBookingsFetched = true;
        self.publishSomeData({ myWorkshopBookingsFetched: true });
      });
  }


  getYearsAndDates() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 16; i >= currentYear - 70; i--) {
      this.years.push(i);
    }
    for (let j = 1; j <= 31; j++) {
      this.dates.push(j);
    }
  }


  saveExpertProfileNode(data: iUser) {
    const self = this;
    self.displayLoading = true;
    const uid = localStorage.getItem('uid');
    firebase.database().ref().child(`/users/${uid}`)
      .set(data).then(() => {
        self.displayLoading = false;
        self.expertProfile = null;
        self.publishSomeData({ showSuccess: 'Profile saved!' });
        self.router.navigate(['/home']);
      })
      .catch(() => {
        self.displayLoading = false;
        self.publishSomeData({ showError: 'Error while saving profile, try again!' });
      });
  }


  inviteExpertToAgency(expert: iUser) {
    if (this.myAgency) {
      const myAgency = this.myAgency;
      if (expert.myAgency) {
        this.publishSomeData({ showError: 'This Expert already have a Hub Team!' });
        return;
      } else if (expert.agencyId) {
        this.publishSomeData({ showError: 'Already hired by some agency!' });
        return;
      }

      if (!myAgency.experts) {
        myAgency.experts = [];
      } if (!myAgency.expertsInvitations) {
        myAgency.expertsInvitations = []
      }

      var alreadyExpertIndex = myAgency.experts.findIndex(obj => obj.uid == expert.uid);
      if (alreadyExpertIndex >= 0) {
        this.publishSomeData({ showError: 'Expert is already your Hub Team member!' });
        return;
      }

      var expertIndex = myAgency.expertsInvitations.indexOf(expert.uid);
      if (expertIndex >= 0) {
        this.publishSomeData({ showError: 'Expert already invited!' });
        return;
      }

      this.displayLoading = true;
      const uid = localStorage.getItem('uid');

      myAgency.expertsInvitations.push(expert.uid);
      firebase.database().ref().child(`/agencies/${uid}`)
        .set(myAgency).then(() => {
          this.displayLoading = false;
          this.sendHubJoinNotification(expert.uid);
          this.publishSomeData({ showSuccess: 'Expert invited to the Hub successfully!' });
        });
    } else {
      this.publishSomeData({ showError: 'Register your agency first!' });
    }
  }


  sendHubJoinNotification(expertUid: string) {
    const notificationObj = new iPushNotification();
    notificationObj.sender = localStorage.getItem('uid');
    notificationObj.receiver = expertUid; // Uid for existing users and Email for non-registred users
    notificationObj.title = 'Hub Join Invitation';
    notificationObj.type = iStrings.INVITED_TO_AGENCY;

    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(expertUid)) {
      firebase.database().ref().child(`/inviteExpertNotifications/`).push(notificationObj);
    } else {
      this.sendNotification(expertUid, notificationObj);
    }
  }


  public alreadyInvitedOrApplied(expert: iUser, jobDetails: iPostJob): boolean {
    let inviteable: boolean = true;
    if ((jobDetails.invites && jobDetails.invites.includes(expert.uid)) ||
      (jobDetails.hired && jobDetails.hired.includes(expert.uid)) ||
      (jobDetails.bids && jobDetails.bids.includes(expert.uid))) {
      inviteable = false;
    }
    return inviteable;
  }


  public inviteExpertToJob(expert: iUser, jobDetails: iPostJob) {
    const notificationObj = new iPushNotification();
    notificationObj.timestamp = Number(new Date());
    notificationObj.receiver = expert.uid;
    notificationObj.sender = localStorage.getItem('uid');
    notificationObj.jobKey = jobDetails.key;
    notificationObj.type = iStrings.SEND_JOB_INVITE;
    notificationObj.title = 'Job Invitation';

    firebase.database().ref().child(`/jobs/${jobDetails.key}/invites`)
      .set(jobDetails.invites).then(() => {
        const allJobsIndex = this.allJobs.findIndex(x => x.key === jobDetails.key);
        if (allJobsIndex >= 0) {
          this.allJobs[allJobsIndex] = jobDetails;
        }
        const myJobsIndex = this.myPostedJobs.findIndex(x => x.key === jobDetails.key);
        if (myJobsIndex >= 0) {
          this.myPostedJobs[myJobsIndex] = jobDetails;
        }
        this.sendNotification(expert.uid, notificationObj);
        this.publishSomeData({ showSuccess: 'Expert invited to this job!' });
      });
  }


  public sendNotification(receiverUid: string, data: iPushNotification) {
    firebase.database().ref().child(`/notifications/${receiverUid}`).push(data);
  }


  public saveWorkshopAsDraft() {
    if (this.createExperienceObj.location.postcode.indexOf('@') >= 0) {
      this.createExperienceObj.location.postcode = null;
    }
    if (!this.createExperienceObj.workshopKey) {
      this.createExperienceObj.uid = localStorage.getItem('uid');
      this.createExperienceObj.timestamp = Number(new Date());
      this.createExperienceObj.workshopKey = firebase.database().ref().child(`/workshops/`).push().key;
    }
    this.createExperienceObj.isDraft = true;
    firebase.database().ref().child(`/workshops/${this.createExperienceObj.workshopKey}`)
      .set(this.createExperienceObj).then(() => {
        this.createExperienceObj = null;
        this.router.navigate(['/my-workshops']);
        this.publishSomeData({ showSuccess: 'Experience saved successfully!' });
      });
  }


  public getExpertAgency(expert: iUser): string {
    let expertAgency: string;
    if (expert.myAgency) {
      expertAgency = expert.myAgency;
    } else if (expert.agencyId) {
      return this.allUsers[expert.agencyId].myAgency;
    }
    return expertAgency;
  }


  public openSpecificModal(modalTogglerBtnId: string) {
    const el = document.getElementById(modalTogglerBtnId);
    if (el) {
      el.click();
    }
  }

  public deepCloneData(data: any) {
    if (data) {
      return JSON.parse(JSON.stringify(data));
    }
  }

  public publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  public getObservable(): Subject<any> {
    return this.fooSubject;
  }


}

