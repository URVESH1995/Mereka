import { Component, NgZone, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
// import { ExpertProfile } from '../models/expert';
import { Router } from '@angular/router';
import { iUser, iExpertProfile } from '../models/user';
import { iPaymentPackage } from '../models/payment-package';
import *  as firebase from 'firebase';
import { iAgency, iAgencyExperts } from '../models/agency';
import { iPayment } from '../models/payment';
import { iPushNotification } from '../models/push-notification';
import { iStrings } from '../models/enums';

declare var Stripe: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  expertsCsvEmailsList: any;
  oldPassword: string;
  newPassword: string;
  loading: boolean;
  myAgency: iAgency;
  agencyImagePath: string;
  newAgencyLogo: boolean;
  activeTab: string = 'members';
  agencySearchQuery: string = '';
  agencyExpertsList: iAgencyExperts[] = [];
  selectAllMembers: boolean;
  selectAllExperts: boolean;

  remainingList: iAgencyExperts[];
  excludedExperts: string[];
  activeSideMenu: string = 'profile';
  businessRegID: string;

  suggestedYears: number[] = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
  suggestedMonths: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  suggestedPackages = [];
  selectedPackage: any = {};
  paymentObj: iPayment;
  pakagePrice: number = 0;
  submitted: boolean = false;

  joinedAgency: iAgency;
  myAgencyInvites: iAgency[] = [];


  constructor(
    public zone: NgZone,
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) {
    this.getAllPackages();
    this.getMyAgencyInvites();
  }


  ngOnInit(): void {
    this.paymentObj = new iPayment();
    this.getMyAgency();

    this.dataHelper.getObservable().subscribe(data => {
      if (data.myAgencyFetched) {
        this.getMyAgency();
      } else if (data.allAgenciesFetched) {
        this.getMyAgencyInvites();
      }
    });

    Stripe.setPublishableKey('pk_test_C4XRD7Rk8EueE0DTxTYAuFQD00slr8BFYU');
  }


  getMyAgencyInvites() {
    if (this.dataHelper.dataFetching.allAgenciesFetched) {
      const allAgencies = this.dataHelper.allAgencies;
      for (var key in allAgencies) {
        const agency: iAgency = allAgencies[key];
        if (agency.expertsInvitations && agency.expertsInvitations.includes(this.userAuth.currentUser.uid)) {
          this.myAgencyInvites.push(agency);
        } else if (agency.experts) {
          agency.experts.forEach(x => {
            if (x.uid === this.userAuth.currentUser.uid) {
              this.joinedAgency = agency;
            }
          });
        }
      }
    }
  }


  getAllPackages() {
    firebase.database().ref().child('packages')
      .once('value', (snapshot) => {
        const allPackages = [];
        const packages = snapshot.val();
        for (var key in packages) {
          allPackages.push(packages[key]);
        }
        this.getSuggestesPackages(allPackages);
      });
  }


  getSuggestesPackages(allPackages: iPaymentPackage[]) {
    allPackages.forEach(x => {
      this.suggestedPackages.push({
        display: x.packageTitle + ' RM' + x.price + '/' + this.packageLimit(x),
        value: x.price
      });
    });
    this.selectedPackage = this.suggestedPackages[0];
  }


  packageLimit(x: iPaymentPackage): string {
    if (x.limit === '1 Month') {
      return 'month';
    } else if (x.limit === '7 Days') {
      return '7 days';
    } else if (x.limit === '6 Months') {
      return '6 months';
    } else if (x.limit === '1 Year') {
      return '1 year';
    }
    return 'Unlimited';
  }


  getMyAgency() {
    this.myAgency = this.dataHelper.myAgency || new iAgency();
    this.agencyImagePath = this.myAgency.agencyLogo;
    this.agencyExpertsList = [];
    this.getAgencyExperts();
  }


  getAgencyExperts() {
    if (this.myAgency.experts && this.myAgency.experts.length) {
      this.myAgency.experts.forEach(x => {
        x.profile = this.dataHelper.allUsers[x.uid] || new iUser();
        this.agencyExpertsList.push(x);
      });
    }
  }


  saveAgency() {
    this.newAgencyLogo ? this.saveAgencyLogo() : this.updateAgencyProfile();
  }


  updatePackagePrice(e) {
    this.pakagePrice = e.value;
  }


  onChangeFile(event: EventTarget) {
    const self = this;
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    const selectedFileObject = files[0];
    self.newAgencyLogo = true;
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      self.agencyImagePath = event.target.result;
    });
    reader.readAsDataURL(selectedFileObject);
  }

  saveAgencyLogo() {
    var self = this;
    self.dataHelper.displayLoading = true;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`agencyLogos/${filename}.jpg`);

    imageRef.putString(self.agencyImagePath, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      firebase.storage().ref('agencyLogos/' + snapshot.metadata.name).getDownloadURL().then((url) => {
        self.myAgency.agencyLogo = url;
        self.dataHelper.displayLoading = false;
        self.newAgencyLogo = false;
        self.updateAgencyProfile();
      })
        .catch((e) => {
          self.dataHelper.publishSomeData({ showError: e.message });
        });
    })
      .catch((e) => {
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }


  updateAgencyProfile() {
    const self = this;
    if (!self.myAgency.expertUid) {
      self.myAgency.timestamp = Number(new Date());
      self.myAgency.expertUid = self.userAuth.currentUser.uid;
      self.myAgency.packageInfo = self.selectedPackage;
      self.myAgency.packagePrice = self.pakagePrice;
    }
    const uid = self.userAuth.currentUser.uid;
    firebase.database().ref().child(`/agencies/${uid}`)
      .set(self.myAgency).then(() => {
        self.dataHelper.publishSomeData({ showSuccess: 'Agency saved successfully!' });

        var element = document.getElementById('closePaymentMd');
        if (element) {
          element.click();
        }
        if (self.myAgency.agencyName) {
          firebase.database().ref().child(`/users/${self.myAgency.expertUid}/myAgency`)
            .set(self.myAgency.agencyName);
        }
      });
  }

  editExpertProfile() {
    let expertProfile = new iUser();
    if (!this.userAuth.currentUser.expertProfile) {
      this.userAuth.currentUser.expertProfile = new iExpertProfile();
    }
    expertProfile = this.dataHelper.deepCloneData(this.userAuth.currentUser);
    this.dataHelper.expertUserProfile = expertProfile;
    this.router.navigate(['/become-expert-step1']);
  }


  updatePassword() {
    const self = this;
    self.loading = true;
    const email = self.userAuth.currentUser.email;
    firebase.auth().signInWithEmailAndPassword(email, self.oldPassword)
      .then((user) => {
        if (user) {
          firebase.auth().currentUser.updatePassword(self.newPassword).then(() => {
            self.loading = false;
            self.oldPassword = null;
            self.newPassword = null;
            localStorage.clear();
            localStorage.setItem('userLoggedIn', 'false');
            self.userAuth.currentUser = new iUser();
            self.router.navigate(['/home']);
            self.dataHelper.publishSomeData({ openLoginModal: true });
            self.dataHelper.publishSomeData({ showSuccess: 'Password updated successfully, Login with new password!' });
          })
            .catch((error) => {
              self.loading = false;
              self.dataHelper.publishSomeData({ showError: error.message });
            });
        }
      })
      .catch((error) => {
        self.loading = false;
        self.dataHelper.publishSomeData({ showError: error.message });
      });
  }


  removeMembersExperts() {
    if (this.activeTab === 'experts') {
      this.remainingList = [];
      this.excludedExperts = [];

      if (this.myAgency.experts && this.myAgency.experts.length) {
        this.myAgency.experts.forEach(x => {
          this.agencyExpertsList.forEach(y => {
            if (y.isSelected && x.uid === y.uid) {
              x.isSelected = true;
            }
          });
        });

        this.myAgency.experts.forEach(item => {
          if (!item.isSelected) {
            this.remainingList.push(item);
          } else {
            this.excludedExperts.push(item.uid);
          }
        });
      }

      if (this.excludedExperts.length) {
        document.getElementById('deleteExpertsModalButton').click();
      } else {
        this.dataHelper.publishSomeData({ showError: 'No expert selected!' });
      }
    }
  }


  removeExpertsFromAgency() {
    const uid = this.userAuth.currentUser.uid;
    firebase.database().ref().child(`/agencies/${uid}/experts`)
      .set(this.remainingList).then(() => {
        this.dataHelper.publishSomeData({ showSuccess: 'Expert(s) removed successfully!' });
      });
    this.excludedExperts.forEach(x => {
      this.sendNotification(x);
      this.dataHelper.allUsers[x].agencyId = null;
      firebase.database().ref().child(`/users/${x}/agencyId`).set(null);
    });
  }


  sendNotification(expertUid: string) {
    const notificationObj = new iPushNotification();
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = expertUid;
    notificationObj.title = 'Removed From Hub';
    notificationObj.type = iStrings.REMOVE_FROM_HUB;
    this.dataHelper.sendNotification(expertUid, notificationObj);
  }


  searchMembersExperts() {
    if (this.activeTab === 'experts') {
      this.agencyExpertsList = this.myAgency.experts.filter(x =>
        x.profile.fullName ? x.profile.fullName.toLowerCase().match(this.agencySearchQuery.toLowerCase()) : null
      );
    }
  }


  updateBusinessID() {
    this.businessRegID = this.userAuth.currentUser.businessRegID;
  }


  createNewBusinessID() {
    this.businessRegID = '';
  }


  saveBusinessRegID() {
    const self = this;
    firebase.database().ref().child(`/users/${self.userAuth.currentUser.uid}/businessRegID`)
      .set(self.businessRegID).then(() => {
        self.dataHelper.publishSomeData({ showSuccess: 'Business registration id saved!' });
      });
  }


  selectUnselectAllMembers(e: any) {
    this.selectAllMembers = e.target.checked;
  }

  selectUnselectAllExperts(e: any) {
    this.selectAllExperts = e.target.checked;
    this.agencyExpertsList.forEach(x => {
      x.isSelected = this.selectAllExperts;
    });
  }


  toggelAgencyTabs(tab: string) {
    this.activeTab = tab;
  }


  scrollTop() {
    window.scroll(0, 0);
  }

  newtab() {
    window.open('http://localhost:4700/mereka-pro', '_blank')
  }


  invalidCardNumber() {
    if (this.paymentObj.cardNumber && this.paymentObj.cardNumber.match(/^[0-9]+$/) === null) {
      return true;
    }
    return false
  }

  validatePaymentData() {
    var self = this;
    if (!self.paymentObj || this.invalidCardNumber() || !self.paymentObj.cardName || self.paymentObj.cardName.length < 3 || !self.paymentObj.cardNumber ||
      self.paymentObj.cardNumber.length != 16 || !self.paymentObj.expiryMonth || !self.paymentObj.expiryYear ||
      !self.paymentObj.cvc || this.paymentObj.cvc < 100 || self.paymentObj.cvc > 9999) {
      self.submitted = true;
      return false;
    } else {
      self.submitted = false;
      return true;
    }
  }

  confirmPayment() {
    var self = this;
    if (self.validatePaymentData()) {
      self.dataHelper.displayLoading = true;
      var card: any = {
        name: self.paymentObj.cardName,
        number: self.paymentObj.cardNumber,
        cvc: self.paymentObj.cvc,
        exp_month: self.paymentObj.expiryMonth,
        exp_year: self.paymentObj.expiryYear,
      }

      Stripe.card.createToken(card, (status, response) => {
        if (response.error) {
          self.dataHelper.displayLoading = false;
          self.dataHelper.publishSomeData({ showError: response.error.message });
          return '';
        } else {
          var token = response.id;
          var params: any = {
            email: self.userAuth.currentUser.email,
            token: token,
          }
          firebase.functions().httpsCallable('addCardToCustomer')(params)
            .then(res => {
              if (res.data.success) {
                this.chargeCustomer(res.data.data.customer_id);
              } else {
                self.zone.run(() => {
                  self.dataHelper.displayLoading = false;
                  self.dataHelper.publishSomeData({ showError: res.data.message.raw.message });
                });
                return '';
              }
            })
            .catch(err => {
              self.zone.run(() => {
                self.dataHelper.displayLoading = false;
                self.dataHelper.publishSomeData({ showError: err });
              });
              return '';
            })
        }
      });
    }
  }

  chargeCustomer(customerId) {
    var self = this;
    var description: any = self.userAuth.currentUser.email + ' ' + self.userAuth.currentUser.fullName +
      ', created for RM' + self.pakagePrice;

    firebase.functions().httpsCallable("chargeCustomer")({
      customerId: customerId,
      description: description,
      amount: self.pakagePrice * 100,
    }).then(res => {
      if (res.data.success) {
        self.updateAgencyProfile();
        self.dataHelper.displayLoading = false;
      } else {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: res.data.message.raw.message });
        return '';
      }
    });
  }


  getAgencyOwnerIfo(uid, check) {
    var userData = new iUser();
    userData = this.dataHelper.allUsers[uid];
    if (userData) {
      if (check == 'name') {
        return userData.fullName;
      } else if (check == 'phone') {
        return userData.phone;
      } else if (check == 'street' && userData.location) {
        return userData.location.streetAddress;
      } else if (check == 'city' && userData.location) {
        return userData.location.city;
        // } else if (check == 'state' && userData.location) {
        //   return userData.location.stateProvince;
        // } else if (check == 'country' && userData.location) {
        return userData.location.country;
      }
    }
    return '';
  }


  cancelHubRequest(hubId, uid, index) {
    var self = this;
    if (self.dataHelper.allAgencies[hubId]) {
      var userIndex = self.dataHelper.allAgencies[hubId].expertsInvitations.indexOf(uid);
      if (userIndex >= 0) {
        self.dataHelper.displayLoading = true;
        self.dataHelper.allAgencies[hubId].expertsInvitations.splice(userIndex, 1);
        firebase.database().ref().child(`/agencies/${hubId}/`)
          .set(self.dataHelper.allAgencies[hubId]).then(() => {
            self.dataHelper.displayLoading = false;
            self.dataHelper.getAllAgencies();
            self.myAgencyInvites.splice(index, 1);
            self.sendCancelHubJoinRequestNotification(hubId);
            self.dataHelper.publishSomeData({ showSuccess: 'Hub request cancelled successfully!' });
          });
      }
    }
  }


  sendCancelHubJoinRequestNotification(hubId: string) {
    const notificationObj = new iPushNotification();
    notificationObj.agencyUid = hubId;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = hubId;
    notificationObj.title = 'Hub Join Request Rejected';
    notificationObj.type = iStrings.HUB_JOIN_REJECTION;
    this.dataHelper.sendNotification(hubId, notificationObj);
  }


  approveHubRequest(hubId, uid, index) {
    var self = this;
    if (self.dataHelper.allAgencies[hubId]) {
      var userIndex = self.dataHelper.allAgencies[hubId].expertsInvitations.indexOf(uid);
      if (userIndex >= 0) {
        self.dataHelper.displayLoading = true;
        self.dataHelper.allAgencies[hubId].expertsInvitations.splice(userIndex, 1);
        if (!self.dataHelper.allAgencies[hubId].experts || !self.dataHelper.allAgencies[hubId].experts.length) {
          self.dataHelper.allAgencies[hubId].experts = [];
        }
        const expertObj: iAgencyExperts = {
          uid: uid,
          inviteDate: Number(new Date()),
          role: 'Expert',
          isSelected: false,
        }
        self.dataHelper.allAgencies[hubId].experts.push(expertObj);
        self.dataHelper.allUsers[uid].agencyId = hubId;
        firebase.database().ref().child(`/users/${uid}/agencyId`).set(hubId);
        firebase.database().ref().child(`/agencies/${hubId}/`)
          .set(self.dataHelper.allAgencies[hubId]).then(() => {
            self.dataHelper.displayLoading = false;
            self.dataHelper.getAllAgencies();
            self.joinedAgency = self.dataHelper.allAgencies[hubId];
            self.myAgencyInvites.splice(index, 1);
            self.sendAcceptHubJoinRequestNotification(hubId);
            self.dataHelper.publishSomeData({ showSuccess: 'Hub request approved successfully!' });
          }).catch(error => {
            self.dataHelper.displayLoading = false;
            self.dataHelper.getAllAgencies();
            self.dataHelper.publishSomeData({ showError: 'Hub joining request is not approved, Kindly try again!' });
          });
      }
    }
  }


  sendAcceptHubJoinRequestNotification(hubId: string) {
    const notificationObj = new iPushNotification();
    notificationObj.agencyUid = hubId;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = hubId;
    notificationObj.title = 'Hub Join Request Accepted';
    notificationObj.type = iStrings.HUB_JOIN_ACCEPTANCE;
    this.dataHelper.sendNotification(hubId, notificationObj);
  }


  leaveHubTeam(hubId, uid) {
    var self = this;
    if (self.dataHelper.allAgencies[hubId]) {
      var userIndex = self.dataHelper.allAgencies[hubId].experts.findIndex(obj => obj.uid == uid);
      if (userIndex >= 0) {
        self.dataHelper.displayLoading = true;
        self.dataHelper.allAgencies[hubId].experts.splice(userIndex, 1);

        self.dataHelper.allUsers[uid].agencyId = '';
        firebase.database().ref().child(`/users/${uid}/agencyId`).set(null);
        firebase.database().ref().child(`/agencies/${hubId}/`)
          .set(self.dataHelper.allAgencies[hubId]).then(() => {
            self.dataHelper.displayLoading = false;
            self.dataHelper.getAllAgencies();
            self.sendLeaveHubTeamNotification(hubId);
            self.joinedAgency = null;
            self.dataHelper.publishSomeData({ showSuccess: 'You left from Hub Team successfully!' });
          }).catch(error => {
            self.dataHelper.displayLoading = false;
            self.dataHelper.getAllAgencies();
            self.dataHelper.publishSomeData({ showError: 'You did not leave the Hub Team, Kindly try again!' });
          });
      }
    }
  }


  sendLeaveHubTeamNotification(hubId: string) {
    const notificationObj = new iPushNotification();
    notificationObj.agencyUid = hubId;
    notificationObj.sender = this.userAuth.currentUser.uid;
    notificationObj.receiver = hubId;
    notificationObj.title = 'Hub Left';
    notificationObj.type = iStrings.HUB_LEFT;
    this.dataHelper.sendNotification(hubId, notificationObj);
  }


  onChangeCsvFile(event: EventTarget) {
    const self = this;
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    let file = files[0];
    let fileReader: FileReader = new FileReader();

    fileReader.onloadend = () => {
      var data: any = fileReader.result;
      var data = data.replaceAll('\n', ',')
      self.expertsCsvEmailsList = data.split(',');
      self.sendHubInvitations();
    }
    fileReader.readAsText(file);
  }


  sendHubInvitations() {
    var self = this;
    var countExperts = 0;
    self.dataHelper.displayLoading = true;
    if (!self.expertsCsvEmailsList || !self.expertsCsvEmailsList.length) {
      return;
    }

    if (!self.myAgency.expertsInvitations || !self.myAgency.expertsInvitations.length) {
      self.myAgency.expertsInvitations = [];
    }

    for (var i = 0; i < self.expertsCsvEmailsList.length; i++) {
      if (self.expertsCsvEmailsList[i]) {
        var userIndex = self.dataHelper.allUsersList.findIndex(obj => obj.email == self.expertsCsvEmailsList[i]);
        if (userIndex >= 0 && !self.myAgency.expertsInvitations.includes(self.dataHelper.allUsersList[userIndex].uid)
          && !self.dataHelper.allUsersList[userIndex].myAgency && !self.dataHelper.allUsersList[userIndex].agencyId) {
          self.myAgency.expertsInvitations.push(self.dataHelper.allUsersList[userIndex].uid);
          countExperts++;
        }
      }
    }

    if (countExperts > 0) {
      const uid = localStorage.getItem('uid');
      firebase.database().ref().child(`/agencies/${uid}`)
        .set(self.dataHelper.myAgency).then(() => {
          self.dataHelper.displayLoading = false;
          self.dataHelper.publishSomeData({ showSuccess: 'Hub Team Joinning invitation sent to ' + countExperts + ' Experts successfully!' });
        });
    } else {
      self.dataHelper.displayLoading = false;
      self.dataHelper.publishSomeData({ showError: 'Invitaion is not sent to any expert from uploaded CSV File!' });
    }
  }


}
