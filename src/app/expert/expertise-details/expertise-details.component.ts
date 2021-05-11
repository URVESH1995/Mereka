import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { iExpertProfile, iExpertise } from '../../models/user';

@Component({
  selector: 'app-expertise-details',
  templateUrl: './expertise-details.component.html',
  styleUrls: ['./expertise-details.component.scss']
})
export class ExpertiseDetailsComponent implements OnInit {

  expandSkillsets: boolean = true;
  expandSkills: boolean = true;
  activeTab: string = 'Your Expertise';

  tabButtons: any[] = [
    { title: 'Your Expertise', navigatePage: 'expertise-details' },
    { title: 'Profile Page', navigatePage: 'expert-overview' },
    { title: 'Your Details', navigatePage: 'expert-portfolios' },
    { title: 'Confirmation', navigatePage: 'expert-profile-confirmation' },
  ];

  allSkillsets: any[] = [
    { title: 'Web, Mobile & Software Development', icon: '/assets/imgs/web.png' },
    { title: 'Design & Creative', icon: '/assets/imgs/design-creativity.png' },
    { title: 'Sales & Marketing', icon: '/assets/imgs/sales-digital-marketing.png' },
    { title: 'Writing', icon: '/assets/imgs/writing.png' },
    { title: 'Admin Support', icon: '/assets/imgs/administration.png' },
    { title: 'Engineering & Architecture', icon: '/assets/imgs/engineering.png' },
    { title: 'Data Science & Analytics', icon: '/assets/imgs/data-science.png' },
    { title: 'IT & Networking', icon: '/assets/imgs/electronics.png' },
    { title: 'Customer Service', icon: '/assets/imgs/web.png' },
  ];

  categorySpecilities: any[] = [];
  selectedSkillTypes: any[] = [];
  selectedCategorySkills: any[] = [];
  expertProfile: iExpertProfile = new iExpertProfile();

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }


  ngOnInit(): void {
    if (!this.dataHelper.expertProfile) {
      this.router.navigate(['/add-service']);
    } else {
      this.getAllCategories();
      this.expertProfile = this.dataHelper.deepCloneData(this.dataHelper.expertProfile);
      if (!this.expertProfile.expertise) {
        this.expertProfile.expertise = new iExpertise();
      } else {
        const selectedCategory = this.allSkillsets.filter(x => x.title === this.expertProfile.expertise.title);
        this.categorySpecilities = selectedCategory[0].specialities;
        this.getSelectedCategorySkills();
      }

      if (!this.expertProfile.skills) {
        this.expertProfile.skills = [];
      }
    }
  }


  getAllCategories() {
    const allCategories = this.dataHelper.jobCategoriesData;
    for (const key in allCategories) {
      const data = allCategories[key];
      const index = this.allSkillsets.findIndex(x => x.title === data.category);
      this.allSkillsets[index].specialities = data.specialities;
    }
  }


  getSelectedCategorySkills() {
    let categories = [];
    this.expertProfile.expertise.skillTypes.forEach(x => {
      this.categorySpecilities.forEach(y => {
        if (x === y.name) {
          categories = categories.concat(y);
        }
      });
    });
    this.updateSkillsArray(categories);
  }


  updateExpertiseTitle(category: any) {
    this.expertProfile.expertise.title = category.title;
    this.categorySpecilities = category.specialities;
    this.expertProfile.expertise.skillTypes = [];
    this.expertProfile.expertise.skills = [];
  }


  emptySelectedSkills() {
    this.expertProfile.expertise.skills = [];
  }


  updateSkillsArray(selectedCategories: any[]) {
    this.selectedCategorySkills = [];
    selectedCategories.forEach(x => {
      x.skills.forEach(y => {
        this.selectedCategorySkills.push(y);
      });
    });
  }


  saveAndExit() {
    if (this.allFieldsAreFilled()) {
      this.userAuth.currentUser.expertProfile = this.expertProfile;
      this.dataHelper.saveExpertProfileNode(this.userAuth.currentUser);
    }
  }


  saveAndNext() {
    if (this.allFieldsAreFilled()) {
      this.dataHelper.expertProfile = this.expertProfile;
      this.router.navigate(['/expert-overview']);
    }
  }


  allFieldsAreFilled(): boolean {
    let filedsAreFilled = true;
    if (!this.expertProfile.expertise.title || !this.expertProfile.expertise.skills.length
      || !this.expertProfile.expertise.skillTypes.length || !this.expertProfile.skills.length) {
      filedsAreFilled = false;
      this.dataHelper.publishSomeData({ showError: 'Fill required data!' });
    }
    return filedsAreFilled;
  }


  navigatePage(pageUrl: string) {
    this.router.navigate([pageUrl]);
  }

}
