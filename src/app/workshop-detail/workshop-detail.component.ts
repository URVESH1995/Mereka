import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { iExperienceReview } from '../models/workshop-review';
import { iExperience, iExperienceSession } from '../models/experience';
import { iBookExperience } from '../models/book-experience';
import { iPushNotification } from '../models/push-notification';
import { Options } from "@angular-slider/ngx-slider";
import { iStrings } from '../models/enums';
import { iAgency } from '../models/agency';
import { iUser } from '../models/user';
import * as firebase from 'firebase';


@Component({
  selector: 'app-workshop-detail',
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss']
})
export class WorkshopDetailComponent implements OnInit {

  workshopDetails: iExperience;
  loading: boolean;
  myWorkshop: boolean;
  workshopHost: iUser = new iUser();
  workshopReviews: iExperienceReview[] = [];
  iHaveReviewed: boolean;
  postReviewObj: iExperienceReview = new iExperienceReview();
  parentSlides: any[] = [];
  selectedSession: iExperienceSession = new iExperienceSession();
  selectedLearners: number = 1;
  totalBookingPrice: number = 0;
  featuredWorkshops: Array<iExperience> = [];
  rangeBarOptions: Options = {
    floor: 1,
    ceil: 1,
  };

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.workshopDetails = this.dataHelper.workshopDetail || new iExperience();
    if (this.workshopDetails.workshopKey) {
      this.getWorkshopHost();
    } else if (!this.workshopDetails.workshopKey && this.activeRoute.snapshot.params.key) {
      this.getPostedworkshopDetails(this.activeRoute.snapshot.params.key);
    } else if (!this.workshopDetails.workshopKey && !this.activeRoute.snapshot.params.key) {
      this.router.navigate(['/home']);
    }
  }

  getWorkshopHostFeatured(hostUid: string): string {
    if (this.dataHelper.allUsers[hostUid]) {
      return this.dataHelper.allUsers[hostUid].fullName;
    }
  }

  getPostedworkshopDetails(workshopKey: string) {
    const self = this;
    self.loading = true;
    firebase.database().ref().child(`/workshops/${workshopKey}`)
      .once('value', (snapshot) => {
        self.workshopDetails = snapshot.val();
        if (!self.workshopDetails) {
          self.loading = false;
          self.router.navigate(['/home']);
        } else {
          self.dataHelper.workshopDetail = self.workshopDetails;
          self.getWorkshopHost();
        }
      });
  }

  getWorkshopHost() {
    this.loading = false;
    this.getWorkshopReviews();
    if (this.workshopDetails.uid === this.userAuth.currentUser.uid) {
      this.myWorkshop = true;
      this.workshopHost = this.userAuth.currentUser;
    } else {
      this.workshopHost = this.dataHelper.allUsers[this.workshopDetails.uid];
    }
    this.rangeBarOptions = {
      floor: 1,
      ceil: this.workshopDetails.guestLearners,
      step: 1,
      showTicks: true,
      showSelectionBar: true
    }
    this.getTotalAmount();
    this.getFeaturedWorkshops();
    this.selectedSession = this.workshopDetails.sessions[0];
  }

  getFeaturedWorkshops() {
    this.featuredWorkshops = this.dataHelper.allWorkshopList.filter(x => x.isFeatured).splice(0, 3);
  }

  updateSelectedSession(session: iExperienceSession) {
    this.selectedSession = session;
  }

  updateSelectedLearners(selectedLearners: number) {
    this.selectedLearners = selectedLearners;
    this.getTotalAmount();
  }

  getTotalAmount() {
    if (this.iAmMemberOfHostAgency()) {
      if (this.workshopDetails.ratePerMember) {
        this.totalBookingPrice = this.selectedLearners * this.workshopDetails.ratePerMember;
      } else {
        this.totalBookingPrice = this.selectedLearners * this.workshopDetails.ratePerLearner;
      }
    } else {
      if (this.workshopDetails.ratePerLearner) {
        this.totalBookingPrice = this.selectedLearners * this.workshopDetails.ratePerLearner;
      } else {
        this.totalBookingPrice = this.selectedLearners * this.workshopDetails.ratePerMember;
      }
    }
  }

  iAmMemberOfHostAgency(): boolean {
    const hostAgency: iAgency = this.dataHelper.allAgencies[this.workshopHost.uid];
    let iamMemberOfHostAgency: boolean;
    if (hostAgency && hostAgency.experts) {
      hostAgency.experts.forEach(x => {
        if (x.uid === this.userAuth.currentUser.uid) {
          iamMemberOfHostAgency = true;
        }
      });
    }
    return iamMemberOfHostAgency;
  }

  bookWorkshop() {
    if (!this.userAuth.currentUser.uid) {
      this.dataHelper.openSpecificModal('preSignupModalOpener');
      return;
    }

    if (this.workshopDetails.bookedBy && this.workshopDetails.bookedBy.includes(this.userAuth.currentUser.uid)) {
      this.dataHelper.publishSomeData({ showError: 'You have already booked this experience!' });
      return;
    }

    if (this.isPastWorkshop()) {
      this.dataHelper.publishSomeData({ showError: 'Past sessions cannot be booked!' });
      return;
    }

    if (this.workshopDetails.accessibility === 'everybody'
      || (this.workshopDetails.accessibility === 'members' && this.iAmMemberOfHostAgency())) {
      this.navigateToPayment();
    } else {
      this.dataHelper.publishSomeData({ showError: 'Only hub members can book this experience!' });
    }
  }

  isPastWorkshop(): boolean {
    const todaysTimestamp = Number(new Date());
    if (Number(new Date(this.selectedSession.date)) < todaysTimestamp) {
      return true;
    }
    return false;
  }

  isBookingDatePassed() {
    if (this.dataHelper.myWorkshopBookingsList) {
      const myBookingOnThisWorkshop = this.dataHelper.myWorkshopBookingsList.filter(x => x.workshopKey === this.workshopDetails.workshopKey);
      if (myBookingOnThisWorkshop && myBookingOnThisWorkshop[0]) {
        const todaysTimestamp = Number(new Date());
        if (Number(new Date(myBookingOnThisWorkshop[0].session.date)) < todaysTimestamp) {
          return true;
        }
      }
    }
    return false;
  }

  navigateToPayment() {
    const bookWorkshopObj = new iBookExperience();
    bookWorkshopObj.bookedAs = this.iAmMemberOfHostAgency() ? 'Member' : 'Learner';
    bookWorkshopObj.bookedBy = this.userAuth.currentUser.uid;
    bookWorkshopObj.owner = this.workshopHost.uid;
    bookWorkshopObj.price = this.totalBookingPrice;
    bookWorkshopObj.workshopKey = this.workshopDetails.workshopKey;
    bookWorkshopObj.learners = this.selectedLearners;
    bookWorkshopObj.session = this.selectedSession;
    this.dataHelper.bookWorkshopPayload = bookWorkshopObj;
    this.router.navigate(['/workshop-payment']);
  }

  getWorkshopReviews() {
    const self = this;
    firebase.database().ref().child(`/workshopReviews/`)
      .orderByChild('workshopKey').equalTo(self.workshopDetails.workshopKey)
      .on('value', (snapshot) => {
        const allReviews = snapshot.val();
        self.workshopReviews = [];
        for (var key in allReviews) {
          const review: iExperienceReview = allReviews[key];
          if (review.uid === self.userAuth.currentUser.uid) {
            self.iHaveReviewed = true;
          }
          review.ratingUser = self.dataHelper.allUsers[review.uid] || {};
          self.workshopReviews.push(review);
        }
        self.divideInChunks();
        self.calculateWorkshopAvgRating();
        self.workshopReviews.sort((a, b) => b.timestamp - a.timestamp);
      });
  }

  divideInChunks() {
    this.parentSlides = [];
    var i, j, temparray, chunk = 3;
    for (i = 0, j = this.workshopReviews.length; i < j; i += chunk) {
      temparray = this.workshopReviews.slice(i, i + chunk);
      this.parentSlides.push(temparray);
    }
  }

  calculateWorkshopAvgRating() {
    let totalRating = 0;
    if (this.workshopReviews.length) {
      this.workshopReviews.forEach(x => {
        totalRating += x.rating;
      });
      this.workshopDetails.avgRating = totalRating / this.workshopReviews.length;
      this.workshopDetails.totalReviews = this.workshopReviews.length;
      const updates = {};
      updates[`/workshops/${this.workshopDetails.workshopKey}/avgRating`] = this.workshopDetails.avgRating;
      updates[`/workshops/${this.workshopDetails.workshopKey}/totalReviews`] = this.workshopReviews.length;
      firebase.database().ref().update(updates);
    }
  }

  updateHubRating() {
    const agencyUid = this.workshopHost.uid;
    firebase.database().ref().child(`/workshopReviews/`)
      .orderByChild('workshopOwner').equalTo(agencyUid)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};
        let totalRating = 0;
        let numberOfReviews = 0;
        for (var key in data) {
          const workshopReview: iExperienceReview = data[key];
          totalRating += workshopReview.rating;
          numberOfReviews++;
        }
        if (totalRating > 0) {
          const avgRating = totalRating / numberOfReviews;
          const updates = {};
          updates[`/agencies/${agencyUid}/avgRating`] = avgRating;
          updates[`/agencies/${agencyUid}/totalReviews`] = numberOfReviews;
          firebase.database().ref().update(updates).then(() => {
            if (this.dataHelper.allAgencies[agencyUid]) {
              this.dataHelper.allAgencies[agencyUid].avgRating = avgRating;
              this.dataHelper.allAgencies[agencyUid].totalReviews = numberOfReviews;
            }
          });
        }
      });
  }

  saveThisReview() {
    const self = this;
    self.postReviewObj.timestamp = Number(new Date());
    self.postReviewObj.uid = self.userAuth.currentUser.uid;
    self.postReviewObj.workshopOwner = self.workshopDetails.uid;
    self.postReviewObj.workshopKey = self.workshopDetails.workshopKey;
    self.postReviewObj.key = firebase.database().ref().child('/workshopReviews/').push().key;
    firebase.database().ref().child(`/workshopReviews/${self.postReviewObj.key}`)
      .set(self.postReviewObj).then(() => {
        self.updateHubRating();
        self.sendReviewNotification();
        document.getElementById('closeModalButton').click();
        self.dataHelper.publishSomeData({ showSuccess: 'Review posted successfully!' });
      });
  }

  sendReviewNotification() {
    const notificationObj = new iPushNotification();
    notificationObj.workshopKey = this.workshopDetails.workshopKey;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = this.workshopDetails.uid;
    notificationObj.title = 'Workshop Rated';
    notificationObj.type = iStrings.WORKSHOP_RATED;
    this.dataHelper.sendNotification(this.workshopDetails.uid, notificationObj);
  }

  iHaveBookedThisWorkshop(): boolean {
    return this.workshopDetails.bookedBy && this.workshopDetails.bookedBy.includes(this.userAuth.currentUser.uid);
  }

  iHaveReviewd(): boolean {
    const index = this.workshopReviews.findIndex(x => x.uid === this.userAuth.currentUser.uid);
    if (index >= 0) {
      return true;
    }
    return false;
  }

  expertDetails() {
    if (this.workshopHost.isExpert) {
      this.dataHelper.expertDetails = this.workshopHost;
      this.router.navigate(['/general-profile']);
    } else {
      this.dataHelper.publishSomeData({ showError: 'Expert profile not found!' });
    }
  }

  favUnfavWorkshop(wokshop?: iExperience) {
    this.userAuth.favUnfavWorkshop(wokshop || this.workshopDetails);
  }

  isMyFavWorkshop(wokshop?: iExperience): boolean {
    return this.userAuth.isMyFavWorkshop(wokshop || this.workshopDetails);
  }

  userProfile(user: iUser) {
    if (user.learnerProfile) {
      this.dataHelper.learnerProfile = user.learnerProfile;
      this.router.navigate(['/learner-profile']);
    } else {
      this.dataHelper.publishSomeData({ showError: 'User profile not found!' });
    }
  }

  agencyProfile() {
    this.router.navigate(['/agency-profile/' + this.workshopHost.uid]);
  }

}