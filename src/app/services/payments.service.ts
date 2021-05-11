import { Injectable, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from './user-auth.service';
import * as firebase from 'firebase';

declare var Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  paymentRef: any;

  constructor(
    public zone: NgZone,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) {
    Stripe.setPublishableKey('pk_test_C4XRD7Rk8EueE0DTxTYAuFQD00slr8BFYU');
  }


  confirmPayment(paymentObj: any, amount: number, description: string) {
    var self = this;
    self.paymentRef = null;
    self.dataHelper.displayLoading = true;
    var card: any = {
      name: paymentObj.cardName,
      number: paymentObj.cardNumber,
      cvc: paymentObj.cvc,
      exp_month: paymentObj.expiryMonth,
      exp_year: paymentObj.expiryYear,
    }
    return self.createCardToken(card, amount, description);
  }


  createCardToken(card, amount: number, description: string) {
    return new Promise((resolve, reject) => {
      const self = this;
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
          return firebase.functions().httpsCallable('addCardToCustomer')(params)
            .then(res => {
              if (res.data.success) {
                resolve(this.chargeCustomer(res.data.data.customer_id, amount, description));
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
    });
  }


  chargeCustomer(customerId: string, amount: number, description: string) {
    var self = this;
    return firebase.functions().httpsCallable('chargeCustomer')({
      customerId: customerId,
      description: description,
      amount: amount * 100,
    }).then(res => {
      if (res.data.success) {
        return self.paymentRef = res.data.data;
      } else {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: res.data.message.raw.message });
        return '';
      }
    });
  }


}
