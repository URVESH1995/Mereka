import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iTransaction } from '../../models/transaction';
import * as firebase from 'firebase';

@Component({
  selector: 'app-learner-transaction-history',
  templateUrl: './learner-transaction-history.component.html',
  styleUrls: ['./learner-transaction-history.component.scss']
})
export class LearnerTransactionHistoryComponent implements OnInit {

  loading: boolean;
  selectedMonth: string;
  selectedYear: number;
  selectedType: string;
  years: number[] = [];
  myTransactions: iTransaction[] = [];
  displayTransactions: iTransaction[] = [];
  transactionTypes: string[] = ['Experiences', 'Spaces'];

  constructor(
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit(): void {
    this.getYearsAndDates();
    this.getMyTransactions();
  }

  getYearsAndDates() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 70; i--) {
      this.years.push(i);
    }
  }


  getMyTransactions() {
    const self = this;
    self.loading = true;
    const myUid = this.userAuth.currentUser.uid;
    firebase.database().ref().child(`/allTransactions/`)
      .orderByChild('paymentFrom').equalTo(myUid)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};
        for (var key in data) {
          const transaction = data[key];
          transaction.paymentPurpose = self.getPaymentPurpose(transaction);
          transaction.entityTitle = self.getEntityTitle(transaction);
          self.myTransactions.push(data[key]);
          self.displayTransactions.push(data[key]);
        }
        self.myTransactions.sort((a, b) => b.timestamp - a.timestamp);
        self.loading = false;
      });
  }

  getPaymentPurpose(transaction: iTransaction): string {
    let returnMsg: string;
    if (transaction.workshopKey) {
      returnMsg = `You paid ${this.getHubNameByWorkshop(transaction.workshopKey)} for workshop booking.`
    } else if (transaction.jobKey) {
      returnMsg = `You paid for your job.`
    } else if (transaction.hubId) {
      returnMsg = `You upgraded your hub to pro.`
    }
    return returnMsg;
  }

  getEntityTitle(transaction: iTransaction): string {
    let returnMsg: string = 'N/A';
    if (transaction.workshopKey) {
      const workshop = this.dataHelper.allWorkshopList.filter(x => x.workshopKey === transaction.workshopKey);
      if (workshop && workshop[0]) {
        returnMsg = workshop[0].experienceTitle;
      }
    } else if (transaction.jobKey) {
      const job = this.dataHelper.allJobs.filter(x => x.key === transaction.jobKey);
      if (job && job[0]) {
        returnMsg = job[0].jobTitle;
      }
    } else {
      returnMsg = this.userAuth.currentUser.myAgency;
    }
    return returnMsg;
  }

  getHubNameByWorkshop(workshopKey: string): string {
    let hubName: string = 'N/A';
    const workshop = this.dataHelper.allWorkshopList.filter(x => x.workshopKey === workshopKey);
    if (workshop && workshop[0]) {
      const workshopOwner = workshop[0].uid;
      if (this.dataHelper.allUsers[workshopOwner].agencyId) {
        const agencyId = this.dataHelper.allUsers[workshopOwner].agencyId;
        hubName = this.dataHelper.allAgencies[agencyId].agencyName;
      } else {
        hubName = this.dataHelper.allAgencies[workshopOwner].agencyName;
      }
    }
    return hubName;
  }

  filterTransaction() {
    this.displayTransactions = this.myTransactions.filter(x =>
      this.isYearMatched(x) && this.isMonthMatched(x) && this.isTypeMatched(x)
    );
  }

  isYearMatched(transaction: iTransaction): boolean {
    let yearMatched: boolean = true;
    if (this.selectedYear) {
      yearMatched = Number(new Date(transaction.timestamp).getFullYear()) === this.selectedYear;
    }
    return yearMatched;
  }

  isMonthMatched(transaction: iTransaction): boolean {
    let monthMatched: boolean = true;
    if (this.selectedMonth) {
      const selectedMonthIndex = this.dataHelper.months.indexOf(this.selectedMonth);
      monthMatched = Number(new Date(transaction.timestamp).getMonth()) === selectedMonthIndex;
    }
    return monthMatched;
  }

  isTypeMatched(transaction: iTransaction): boolean {
    let typeMatched: boolean = true;
    if (this.selectedType) {
      if (this.selectedType === 'Experience') {
        typeMatched = transaction.workshopKey ? true : false;
      } else if (this.selectedType === 'Job') {
        typeMatched = transaction.jobKey ? true : false;
      } else if (this.selectedType === 'Hub') {
        typeMatched = transaction.hubId ? true : false;
      }
    }
    return typeMatched;
  }

  clearFilters() {
    this.selectedMonth = null;
    this.selectedYear = null;
    this.selectedType = null;
    this.filterTransaction();
  }

}
