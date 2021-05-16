import { Component, OnInit, Input } from '@angular/core';
import { DataHelperService } from '../../../services/data-helper.service';
import { iAgency, iWithdrawal, iAgencyBank } from '../../../models/agency';
import { UserAuthService } from '../../../services/user-auth.service';
import { iTransaction } from '../../../models/transaction';
import { iExperience } from '../../../models/experience';
import { ExportToCsv } from 'export-to-csv';
import * as firebase from 'firebase';

@Component({
  selector: 'app-hub-billing-information',
  templateUrl: './hub-billing-information.component.html',
  styleUrls: ['./hub-billing-information.component.scss']
})
export class HubBillingInformationComponent implements OnInit {

  @Input() hubTotalSales: number;
  loading: boolean;
  myAgency: iAgency = new iAgency();
  selectedMonth: string;
  selectedYear: number;
  selectedType: string;
  years: number[] = [];
  myTransactions: iTransaction[] = [];
  displayTransactions: iTransaction[] = [];
  myWorkshops: iExperience[] = [];
  transactionTypes: string[] = ['Experiences', 'Spaces'];
  agencyWithdraws: iWithdrawal[] = [];
  totalWithdraws: number;
  hubAvailabledBalance: number = 0;
  withdrawAmount: number;
  myAllWithdraws: iWithdrawal[] = [];
  lastWithdraw: iWithdrawal = new iWithdrawal();
  description: string;
  workshopsKeysByAgency: string[] = [];

  constructor(
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit(): void {
    this.myAgency = this.dataHelper.myAgency;
    this.getMyWorkshops();
    this.getMyWithdrawRequests();
    this.getYearsAndDates();
    this.getMyTransactions();
  }

  getMyWorkshops() {
    this.workshopsKeysByAgency = [];
    const allWorkshops = this.dataHelper.allWorkshopList || [];
    allWorkshops.forEach(x => {
      if (x.uid === this.userAuth.currentUser.uid) {
        this.workshopsKeysByAgency.push(x.workshopKey);
      }
    });
    this.getPaymentsAgainstMyWorkshops();
  }

  getPaymentsAgainstMyWorkshops() {
    this.dataHelper.allTransactions.forEach((x: any) => {
      if (this.workshopsKeysByAgency.includes(x.workshopKey)) {
        const transaction = x;
        transaction.paymentPurpose = this.getPaymentPurpose(transaction);
        transaction.entityTitle = this.getEntityTitle(transaction);
        this.myTransactions.push(transaction);
        this.displayTransactions.push(transaction);
        this.displayTransactions.sort((a, b) => b.timestamp - a.timestamp);
      }
    });
  }

  getMyWithdrawRequests() {
    if (!this.myAgency.bankDetails) {
      this.myAgency.bankDetails = new iAgencyBank();
    }

    this.totalWithdraws = 0;
    firebase.database().ref().child(`/withdrawals/`)
      .orderByChild('agencyId').equalTo(this.myAgency.expertUid)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};
        for (var key in data) {
          const withdraw: iWithdrawal = data[key];
          if (!withdraw.status || withdraw.status === 'approved') {
            this.totalWithdraws += withdraw.withdrawAmount;
          }
          this.myAllWithdraws.push(withdraw);
        }
        if (!this.hubTotalSales) {
          this.hubTotalSales = 0;
        }
        this.hubAvailabledBalance = this.hubTotalSales - this.totalWithdraws;
        this.myAllWithdraws.sort((a, b) => b.timestamp - a.timestamp);
        this.lastWithdraw = this.myAllWithdraws[0] ? this.myAllWithdraws[0] : new iWithdrawal();
      });
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
          self.myTransactions.push(transaction);
          self.displayTransactions.push(transaction);
        }
        self.displayTransactions.sort((a, b) => b.timestamp - a.timestamp);
        self.loading = false;
      });
  }

  getPaymentPurpose(transaction: iTransaction): string {
    let returnMsg: string;
    if (transaction.paymentFrom === this.userAuth.currentUser.uid) {
      if (transaction.workshopKey) {
        returnMsg = `You paid ${this.getHubNameByWorkshop(transaction.workshopKey)} for workshop booking.`
      } else if (transaction.jobKey) {
        returnMsg = `You paid for your job.`
      } else if (transaction.hubId) {
        returnMsg = `You upgraded your hub to pro.`
      }
    } else {
      const paidBy = this.dataHelper.allUsers[transaction.paymentFrom] || {};
      returnMsg = `${paidBy.fullName || 'N/A'} booked your workshop.`
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

  saveBankDetails() {
    if (this.myAgency.bankDetails.accountNumber && this.myAgency.bankDetails.bankName &&
      this.myAgency.bankDetails.country) {
      this.myAgency.bankDetails.dateAdded = Number(new Date());
      firebase.database().ref().child(`/agencies/${this.myAgency.expertUid}/bankDetails`)
        .set(this.myAgency.bankDetails).then(() => {
          this.dataHelper.publishSomeData({ showSuccess: 'Bank details saved!' });
          document.getElementById('closeBankDetailsModal').click();
        });
    } else {
      this.dataHelper.publishSomeData({ showError: 'Please fill out the required fields!' });
    }
  }

  submitWithdrawRequest() {
    if (this.isValidAmountEntered()) {
      document.getElementById('closeAmountModal').click();
      const withdrawObj = new iWithdrawal();
      withdrawObj.timestamp = Number(new Date());
      withdrawObj.agencyId = this.myAgency.expertUid;
      withdrawObj.withdrawAmount = this.withdrawAmount;
      withdrawObj.description = this.description;
      withdrawObj.key = firebase.database().ref().child(`/withdrawals/`).push().key;
      firebase.database().ref().child(`/withdrawals/${withdrawObj.key}`)
        .set(withdrawObj).then(() => {
          this.hubAvailabledBalance -= this.withdrawAmount;
          this.withdrawAmount = 0;
          this.description = '';
          this.lastWithdraw = withdrawObj;
          this.dataHelper.publishSomeData({ showSuccess: 'Withdraw request submitted successfully!' });
        });
    }
  }

  isValidAmountEntered(): boolean {
    let validAmount: boolean = true;
    if (this.withdrawAmount < 0 || this.withdrawAmount > this.hubAvailabledBalance) {
      validAmount = false;
      this.dataHelper.publishSomeData({ showError: 'Please enter valid withdrawable amount!' });
    }
    return validAmount;
  }

  exportCsv() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      filename: `Transactions-${new Date().toLocaleDateString()}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.exportableList());
  }

  exportableList() {
    const exportableTransactionList = [];
    this.displayTransactions.forEach((x: any) => {
      exportableTransactionList.push({
        'Date': new Date(x.timestamp).toLocaleString(),
        'Transaction ID': this.removeFirstCharacter(x.transactionKey),
        'Title': x.entityTitle,
        'Description': x.paymentPurpose,
        'Amount RM': `${x.amount}`,
      });
    });
    return exportableTransactionList;
  }

  removeFirstCharacter(transactionKey: string): string {
    let str = transactionKey.substring(1);
    return str;
  }

  getMerekaFee(): number {
    let merekaWithdrawFeePercentage = 20;
    const merekaAmount = (this.withdrawAmount * merekaWithdrawFeePercentage) / 100;
    return merekaAmount;
  }

}