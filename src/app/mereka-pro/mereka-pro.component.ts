import { Component, OnInit } from '@angular/core';
import { iPaymentPackage } from '../models/payment-package';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { PaymentsService } from '../services/payments.service';
import { iTransaction } from '../models/transaction';
import { iPayment } from '../models/payment';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-mereka-pro',
  templateUrl: './mereka-pro.component.html',
  styleUrls: ['./mereka-pro.component.scss']
})
export class MerekaProComponent implements OnInit {

  loading: boolean;
  appData: any = {};
  allPackages: iPaymentPackage[] = [];
  selectedPackage: iPaymentPackage;

  constructor(
    public router: Router,
    public paymentService: PaymentsService,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
  ) { }

  ngOnInit(): void {
    if (this.dataHelper.myAgency) {
      this.getPaymentPackages();
      this.getAppData();
    } else {
      this.router.navigate(['/home']);
    }
  }


  getAppData() {
    const self = this;
    self.loading = true;
    firebase.database().ref().child('appData')
      .on('value', (snapshot) => {
        self.appData = snapshot.val();
        if (!self.appData.faqs) {
          self.appData.faqs = [];
        }
      });
  }


  getPaymentPackages() {
    const self = this;
    firebase.database().ref().child('packages')
      .once('value', (snapshot) => {
        self.allPackages = [];
        const packages = snapshot.val();
        for (var key in packages) {
          self.allPackages.push(packages[key]);
        }
        self.loading = false;
      });
  }


  confirmPayment(paymentObj: iPayment) {
    const description = this.getPaymentDescription();
    this.paymentService.confirmPayment(paymentObj, this.selectedPackage.price, description).then(() => {
      this.createTransactionNode(this.paymentService.paymentRef);
      this.updatePackageOnFirebase();
    });
  }

  createTransactionNode(paymentRef: any) {
    const transaction = new iTransaction();
    transaction.transactionKey = firebase.database().ref().child('transactions').push().key;
    transaction.paymentFrom = localStorage.getItem('uid');
    transaction.workshopKey = null;
    transaction.jobKey = null;
    transaction.hubId = this.userAuth.currentUser.uid;
    transaction.paymentRef = paymentRef;
    transaction.timestamp = Number(new Date());
    transaction.amount = this.selectedPackage.price;
    firebase.database().ref().child(`/allTransactions/${transaction.transactionKey}`).set(transaction);
  }

  updatePackageOnFirebase() {
    this.dataHelper.myAgency.packageInfo = this.selectedPackage.packageTitle + ' RM' +
      this.selectedPackage.price + '/' + this.packageLimit(this.selectedPackage);
    this.dataHelper.myAgency.packagePrice = this.selectedPackage.price;
    firebase.database().ref().child(`/agencies/${this.dataHelper.myAgency.expertUid}`)
      .set(this.dataHelper.myAgency).then(() => {
        this.dataHelper.displayLoading = false;
        this.dataHelper.allAgencies[this.userAuth.currentUser.uid] = this.dataHelper.myAgency;
        document.getElementById('closeHubPaymentModal').click();
        this.router.navigate(['/hub-dashboard']);
      });
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


  getPaymentDescription(): string {
    let description: string;
    description = this.userAuth.currentUser.email + ' ' + this.userAuth.currentUser.fullName +
      ', upgraded their hub to pro with id ' + this.dataHelper.myAgency.expertUid + ' for RM' + this.selectedPackage.price;
    return description;
  }

}
