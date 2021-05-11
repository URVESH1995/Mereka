import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { iUser } from '../../models/user';
import { Router } from '@angular/router';
import { iPostJob } from '../../models/post-job';

@Component({
  selector: 'app-post-job-menu',
  templateUrl: './post-job-menu.component.html',
  styleUrls: ['./post-job-menu.component.scss']
})
export class PostJobMenuComponent implements OnInit {

  postJobMenu = [
    { path: '/post-job', keyword: 'jobDetails', icon: '<i class="fas fa-file-alt"></i>', title: 'Job Details' },
    { path: '/post-job-step2', keyword: 'expertise', img: '/assets/imgs/expertise2.svg', title: 'Expertise' },
    { path: '/post-job-step3', keyword: 'budget', icon: '<i class="fas fa-dollar-sign"></i>', title: 'Budget' },
    { path: '/post-job-step4', keyword: 'preview', icon: '<i class="fas fa-check"></i>', title: 'Preview' },
  ];

  activeMenu: string;
  progress: number;
  remaining: number;

  expertUser: iUser;
  activeIndex: number;

  constructor(
    public router: Router,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) {
  }


  ngOnInit(): void {
    if (!this.dataHelper.postJobObj) {
      this.dataHelper.postJobObj = new iPostJob();
      this.router.navigate(['/post-job']);
    }
    this.getActiveIndex();
  }


  getActiveIndex() {
    const activePage = this.router.url;
    const activeObject = this.postJobMenu.filter(x => x.path === activePage)[0];
    this.activeIndex = this.postJobMenu.findIndex(x => x.path === activePage);

    this.activeMenu = activeObject.title;
    this.remaining = this.postJobMenu.length - (this.activeIndex + 1);
    this.progress = (this.activeIndex + 1) * 100 / this.postJobMenu.length;
  }


  navigateMenu(i) {
    if (this.postJobMenu[i].keyword === 'preview') {
      if (this.dataHelper.postJobObj.jobTitle && this.dataHelper.postJobObj.description
        && this.dataHelper.postJobObj.category && this.dataHelper.postJobObj.skills.length
        && this.dataHelper.postJobObj.jobType) {
        this.router.navigate([this.postJobMenu[i].path]);
      }
    } else if
      (this.isPropertyFilled(this.activeIndex) || this.isPropertyFilled(i)) {
      this.router.navigate([this.postJobMenu[i].path]);
    }
  }


  isPropertyFilled(index: number): boolean {
    if (this.dataHelper.postJobObj) {
      if (index === 0) {
        if (this.dataHelper.postJobObj.jobTitle && this.dataHelper.postJobObj.description
          && this.dataHelper.postJobObj.category) {
          return true;
        }
      }

      else if (index === 1) {
        if (this.dataHelper.postJobObj.skills.length) {
          return true;
        }
      }

      else if (index === 2) {
        if (this.dataHelper.postJobObj.jobType) {
          return true;
        }
      }

      else if (index === 3) {
        return true;
      }
    }
    return false;
  }

}
