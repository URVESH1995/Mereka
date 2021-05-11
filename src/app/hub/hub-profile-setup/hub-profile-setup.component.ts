import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { iAgency, iAgencyLocation } from '../../models/agency';
import { DataHelperService } from '../../services/data-helper.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-hub-profile-setup',
  templateUrl: './hub-profile-setup.component.html',
  styleUrls: ['./hub-profile-setup.component.scss']
})
export class HubProfileSetupComponent implements OnInit {

  loading: boolean;
  agencyLogoPath: any;
  agencyBannerPath: any;
  newLogoFile: boolean;
  newCoverFile: boolean;

  hubTypesList: string[] = ['Creative', 'Social Enterprise'];
  myAgency: iAgency = new iAgency();
  @Output() updatedActiveTab = new EventEmitter<any>();

  constructor(
    public zone: NgZone,
    public router: Router,
    public dataHelper: DataHelperService
  ) { }


  ngOnInit(): void {
    this.getMyAgency();

    if (!this.dataHelper.dataFetching.allAgenciesFetched) {
      this.loading = true;
    }

    this.dataHelper.getObservable().subscribe(data => {
      if (data.allAgenciesFetched) {
        this.getMyAgency();
        this.loading = false;
      }
    });
  }


  getMyAgency() {
    this.zone.run(() => {
      this.myAgency = this.dataHelper.createAgencyData || new iAgency();
      this.agencyLogoPath = this.dataHelper.deepCloneData(this.myAgency.agencyLogo);
      this.agencyBannerPath = this.dataHelper.deepCloneData(this.myAgency.coverImage);
      if (!this.myAgency.location) {
        this.myAgency.location = new iAgencyLocation();
      }
    });
  }


  onChangeLogoFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    if (files[0]) {
      this.newLogoFile = true;
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.agencyLogoPath = event.target.result;
      });
      reader.readAsDataURL(files[0]);
    }
  }


  onChangeCoverFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    if (files[0]) {
      this.newCoverFile = true;
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.agencyBannerPath = event.target.result;
      });
      reader.readAsDataURL(files[0]);
    }
  }


  navigateBack() {
    this.router.navigate(['/add-hub']);
  }

  nextTab() {
    if (this.requiredFieldsAreFilled()) {
      if (this.newLogoFile) {
        this.dataHelper.displayLoading = true;
        this.saveImageOnFirebase();
      } else if (this.newCoverFile) {
        this.dataHelper.displayLoading = true;
        this.saveImageOnFirebase();
      } else {
        this.dataHelper.displayLoading = false;
        this.saveAndNextTab();
      }
    }
  }


  saveImageOnFirebase() {
    const self = this;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`hubImages/${filename}.jpg`);
    const imageFile = self.newLogoFile ? self.agencyLogoPath : self.agencyBannerPath;

    imageRef.putString(imageFile, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      firebase.storage().ref('hubImages/' + snapshot.metadata.name).getDownloadURL().then((url) => {
        if (self.newLogoFile) {
          self.newLogoFile = false;
          self.myAgency.agencyLogo = url;
        } else {
          self.newCoverFile = false;
          self.myAgency.coverImage = url;
        }
        self.nextTab();
      })
        .catch((e) => {
          self.dataHelper.publishSomeData({ showError: e.message });
        });
    })
      .catch((e) => {
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }


  saveAndNextTab() {
    this.dataHelper.createAgencyData = this.myAgency;
    this.updatedActiveTab.emit('Your Details');
  }


  requiredFieldsAreFilled(): boolean {
    let dataFilled: boolean = true;
    if (!this.myAgency.agencyName || !this.myAgency.companyType || !this.myAgency.location.city) {
      this.dataHelper.publishSomeData({ showError: 'Please fill out the basic details!' });
      dataFilled = false;
    } else if (!this.agencyLogoPath || !this.agencyBannerPath) {
      this.dataHelper.publishSomeData({ showError: 'Missing agency logo or cover image!' });
      dataFilled = false;
    }
    return dataFilled;
  }

}
