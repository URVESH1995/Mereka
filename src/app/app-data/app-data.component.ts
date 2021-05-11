import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataHelperService } from '../services/data-helper.service';

@Component({
  selector: 'app-app-data',
  templateUrl: './app-data.component.html',
  styleUrls: ['./app-data.component.scss']
})
export class AppDataComponent implements OnInit {

  displayData: any;
  loading: boolean;

  constructor(
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService
  ) {
    this.getAppData();
  }


  ngOnInit(): void {
    if (!this.dataHelper.dataFetching.appDataFetched) {
      this.loading = true;
    }

    this.dataHelper.getObservable().subscribe(data => {
      if (data.appDataFetched) {
        this.getAppData();
        this.loading = false;
      }
    });
  }


  getAppData() {
    const dataKey = this.activeRoute.snapshot.params.key;
    this.displayData = this.dataHelper.appData[dataKey] || '';
  }

}
