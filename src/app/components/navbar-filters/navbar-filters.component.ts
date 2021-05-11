import { Component, OnInit } from '@angular/core';
import { iExperienceFilters } from '../../models/workshop-filters';
import { DataHelperService } from '../../services/data-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-filters',
  templateUrl: './navbar-filters.component.html',
  styleUrls: ['./navbar-filters.component.scss']
})
export class NavbarFiltersComponent implements OnInit {

  userSettings = {
    showSearchButton: false,
    inputPlaceholderText: 'Location',
    inputString: ''
  };

  workshopCategories: string[] = [];
  workshopFilters: iExperienceFilters = new iExperienceFilters();

  constructor(
    public router: Router,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.workshopCategories = this.dataHelper.deepCloneData(this.dataHelper.workshopCategories);
  }

  autoCompleteCallback(selectedData: any) {
    var Data = selectedData.data;
    if (Data) {
      this.userSettings.inputString = Data.description;
      var geometry = Data.geometry;
      var Location = geometry.location;
      this.workshopFilters.lat = Location.lat;
      this.workshopFilters.lng = Location.lng;
      this.workshopFilters.location = Data.description;
    }
  }

  switchWorkshopAccessibility(accessibility: string) {
    this.workshopFilters.accessibility = accessibility;
  }

  searchWorkshops() {
    if (!this.isAnyInputMissing()) {
      const el: any = document.getElementById('search_places');
      if (!el.value) {
        this.workshopFilters.location = null;
        this.workshopFilters.lat = null;
        this.workshopFilters.lng = null;
      }
      this.dataHelper.workshopFilters = this.workshopFilters;
      this.router.navigate(['/workshops']);
    }
  }

  isAnyInputMissing(): boolean {
    return (!this.workshopFilters.category && !this.workshopFilters.date
      && !this.workshopFilters.lat)
      ? true : false;
  }

}
