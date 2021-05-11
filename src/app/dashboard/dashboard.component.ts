import { Component, OnInit, NgZone } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iPostJob } from '../models/post-job';
import { Router, ActivatedRoute } from '@angular/router';
import { iAgencyExperts } from '../models/agency';
import { iBookWorkshop } from '../models/book-workshop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  myAgencyExperts: iAgencyExperts[];
  myAgencyExpertJobs: iPostJob[];
  myWorkShopBookings: iBookWorkshop[];
  myAgencySales: number = 0;

  public searchValue: string = '';
  public searchFields: any = ['jobTitle']

  constructor(
    public router: Router,
    public zone: NgZone,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService
  ) {
    this.getDashboardData();
  }


  ngOnInit(): void {
    this.dataHelper.getObservable().subscribe(data => {
      if (data.myAgencyFetched) {
        this.getDashboardData();
      }
    });
  }


  getDashboardData() {
    var self = this;
    self.myAgencyExperts = [];
    self.myAgencyExpertJobs = [];

    if (self.dataHelper.myAgency) {
      if (self.dataHelper.myAgency.experts && self.dataHelper.myAgency.experts.length) {
        self.myAgencyExperts = self.dataHelper.myAgency.experts;
        if (self.dataHelper.allJobs && self.dataHelper.allJobs.length) {
          self.getAgencyExpertsJobs();
        }
      }
    }

    if (self.dataHelper.myWorkshopBookingsList && self.dataHelper.myWorkshopBookingsList.length) {
      self.getWorkShopsBookings()
    }
  }


  getAgencyExpertsJobs() {
    var self = this;
    for (var i = 0; i < self.dataHelper.allJobs.length; i++) {
      if (self.dataHelper.allJobs[i].hired) {
        for (var j = 0; j < self.dataHelper.allJobs[j].hired.length; j++) {

          var tempExpertId = self.dataHelper.allJobs[i].hired[j];
          if (self.myAgencyExperts.findIndex(obj => obj.uid == tempExpertId) >= 0) {
            self.myAgencyExpertJobs.push(self.dataHelper.allJobs[i])
          }
        }
      }
    }
  }


  getWorkShopsBookings() {
    var self = this;
    for (var i = 0; i < self.dataHelper.myWorkshopBookingsList.length; i++) {
      self.myAgencySales = self.myAgencySales + self.dataHelper.myWorkshopBookingsList[i].price;
    }
  }

}
