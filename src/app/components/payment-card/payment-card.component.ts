import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { iPayment } from '../../models/payment';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss']
})
export class PaymentCardComponent implements OnInit {

  submitted: boolean;
  paymentObj: iPayment = new iPayment();
  suggestedYears: number[] = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
  suggestedMonths: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  @Input() deductionAmount: number;
  @Output() onValidateCard = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }


  validatePaymentData() {
    var self = this;
    if (!self.paymentObj || self.invalidCardNumber() || !self.paymentObj.cardName || self.paymentObj.cardName.length < 3 || !self.paymentObj.cardNumber ||
      self.paymentObj.cardNumber.length != 16 || !self.paymentObj.expiryMonth || !self.paymentObj.expiryYear ||
      !self.paymentObj.cvc || self.paymentObj.cvc < 100 || self.paymentObj.cvc > 9999) {
      self.submitted = true;
      return false;
    } else {
      self.submitted = false;
      return true;
    }
  }


  invalidCardNumber() {
    if (this.paymentObj.cardNumber && this.paymentObj.cardNumber.match(/^[0-9]+$/) === null) {
      return true;
    }
    return false
  }


  confirmPayment() {
    if (this.validatePaymentData()) {
      this.onValidateCard.emit(this.paymentObj);
    }
  }

}
