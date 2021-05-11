import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iExperience } from '../../models/experience';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-workshop-basic-details',
  templateUrl: './workshop-basic-details.component.html',
  styleUrls: ['./workshop-basic-details.component.scss']
})
export class WorkshopBasicDetailsComponent implements OnInit {

  myWorkshopObj: iExperience = new iExperience();

  activeTab: string = 'Your Page';
  expandTitle: boolean = true;
  expandDescription: boolean = true;
  expandPhotos: boolean = true;
  expandLearningOutcomes: boolean = true;
  expandInstructions: boolean = true;

  coverImagePath: string;
  additionalImagePaths: string[] = [];
  newImagePaths: string[] = [];

  tabButtons: any[] = [
    { title: 'Your Experience', navigatePage: 'create-workshop' },
    { title: 'Your Audience', navigatePage: 'workshop-audience' },
    { title: 'Additional Information', navigatePage: 'workshop-additional-info' },
    { title: 'Your Page', navigatePage: 'workshop-basic-details' },
    { title: 'Confirmation', navigatePage: 'workshop-preview' },
  ];

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    if (!this.dataHelper.createExperienceObj) {
      this.router.navigate(['/add-service']);
    } else {
      this.myWorkshopObj = this.dataHelper.createExperienceObj;
      this.coverImagePath = this.myWorkshopObj.coverImage;
      if (this.myWorkshopObj.additionalPhotos && this.myWorkshopObj.additionalPhotos.length) {
        this.additionalImagePaths = this.dataHelper.deepCloneData(this.myWorkshopObj.additionalPhotos);
      } else {
        this.myWorkshopObj.additionalPhotos = [];
        for (var i = 0; i < 3; i++) {
          this.additionalImagePaths.push('');
        }
      }

      if (!this.myWorkshopObj.materials) {
        this.emptyMaterialsArray();
      }
      if (!this.myWorkshopObj.bringList) {
        this.emptyBringlistsArray();
      }
    }
  }

  onChangeFile(event: EventTarget, index: number) {
    const self = this;
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    const selectedFileObject = files[0];
    if (selectedFileObject) {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        if (index >= 0) {
          self.additionalImagePaths[index] = event.target.result;
        } else {
          self.additionalImagePaths.push(event.target.result);
        }
      });
      reader.readAsDataURL(selectedFileObject);
    }
  }

  onChangeCoverFile(event: EventTarget) {
    const self = this;
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    const selectedFileObject = files[0];
    if (selectedFileObject) {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        self.coverImagePath = event.target.result;
      });
      reader.readAsDataURL(selectedFileObject);
    }
  }

  removeImage(index: number) {
    this.additionalImagePaths[index] = '';
  }

  emptyBringlistsArray() {
    this.myWorkshopObj.bringList = [];
  }

  emptyMaterialsArray() {
    this.myWorkshopObj.materials = [];
  }

  saveAndNext() {
    if (this.allFieldsAreFilled()) {
      if (!this.coverImagePath.match('https://firebasestorage')) {
        this.uploadCoverImagePath();
      } else {
        this.uploadAdditionalPhotos();
      }
    }
  }

  uploadCoverImagePath() {
    const self = this;
    self.dataHelper.displayLoading = true;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`workshopImages/${filename}.jpg`);

    imageRef.putString(self.coverImagePath, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      firebase.storage().ref('workshopImages/' + snapshot.metadata.name).getDownloadURL()
        .then((url: string) => {
          self.myWorkshopObj.coverImage = url;
          self.uploadAdditionalPhotos();
        })
        .catch((e) => {
          self.dataHelper.displayLoading = false;
          self.dataHelper.publishSomeData({ showError: e.message });
        });
    })
      .catch((e) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }

  uploadAdditionalPhotos() {
    this.myWorkshopObj.additionalPhotos = this.additionalImagePaths.filter(x => x.match('https://firebasestorage'))
    this.newImagePaths = this.additionalImagePaths.filter(x => !x.match('https://firebasestorage'))
    if (this.newImagePaths.length) {
      this.dataHelper.displayLoading = true;
      this.uploadImagesOnFirebase(this.newImagePaths[0], 0);
    } else {
      this.saveDataAndNavigateNext();
    }
  }

  uploadImagesOnFirebase(imagePath: string, index: number) {
    const self = this;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`workshopImages/${filename}.jpg`);

    imageRef.putString(imagePath, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      firebase.storage().ref('workshopImages/' + snapshot.metadata.name).getDownloadURL()
        .then((url: string) => {
          self.myWorkshopObj.additionalPhotos.push(url);
          if (index !== self.newImagePaths.length - 1) {
            self.uploadImagesOnFirebase(self.newImagePaths[index + 1], index + 1);
          } else {
            self.saveDataAndNavigateNext();
          }
        })
        .catch((e) => {
          self.dataHelper.displayLoading = false;
          self.dataHelper.publishSomeData({ showError: e.message });
        });
    })
      .catch((e) => {
        self.dataHelper.displayLoading = false;
        self.dataHelper.publishSomeData({ showError: e.message });
      });
  }

  saveDataAndNavigateNext() {
    this.dataHelper.displayLoading = false;
    this.dataHelper.createExperienceObj = this.myWorkshopObj;
    this.router.navigate(['/workshop-preview']);
  }

  allFieldsAreFilled(): boolean {
    let filedsAreFilled = true;
    if (!this.myWorkshopObj.experienceTitle || !this.myWorkshopObj.experienceDescription) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Missing title or description!' });
    } else if (!this.coverImagePath || !this.isAdditionalPhotosAttached()) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Attach cover image and 4 additional photos!' });
    } else if (!this.myWorkshopObj.learningOutcomes) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Explain learning outcomes!' });
    } else if (!this.myWorkshopObj.instructions) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Write some instructions for audience!' });
    } else if (this.myWorkshopObj.isMaterialsProvided && !this.myWorkshopObj.materials.length) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Add at least one material for your guests!' });
    } else if (this.myWorkshopObj.isBringlistRequired && !this.myWorkshopObj.bringList.length) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Add at least one item for your guests to bring!' });
    }
    return filedsAreFilled;
  }

  isAdditionalPhotosAttached(): boolean {
    const images = this.additionalImagePaths.filter(x => x !== '');
    return images.length < 4 ? false : true;
  }

  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

}
