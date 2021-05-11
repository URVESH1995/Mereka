import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../../services/data-helper.service';
import { iAgencyExperts } from '../../../models/agency';
import { iUser } from '../../../models/user';

@Component({
  selector: 'app-hub-experts',
  templateUrl: './hub-experts.component.html',
  styleUrls: ['./hub-experts.component.scss']
})
export class HubExpertsComponent implements OnInit {

  mainSkillset: string;
  subSkill: string;

  subSkills: any[] = [];
  hubExperts: iAgencyExperts[] = [];
  skills: string[] = ['Developer', 'Designer'];

  mainSkills: string[] = [
    'Web, Mobile & Software Development', 'Design & Creative', 'Sales & Marketing', 'Writing',
    'Admin Support', 'Engineering & Architecture', 'Data Science & Analytics', 'IT & Networking',
    'Customer Service'
  ];

  constructor(
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    this.getHubExperts();
    this.getAllSkills();
  }

  getHubExperts() {
    this.hubExperts = [];
    const experts = this.dataHelper.myAgency.experts || [];
    experts.forEach(x => {
      x.profile = this.dataHelper.allUsers[x.uid] || new iUser();
      this.hubExperts.push(x);
    });
    this.filterExperts();
  }

  getAllSkills() {
    for (var key in this.dataHelper.jobCategoriesData) {
      const data = this.dataHelper.jobCategoriesData[key];
      this.subSkills = this.subSkills.concat(data.specialities);
    }
  }

  filterExperts() {
    this.hubExperts = this.hubExperts.filter(x =>
      this.isMainSkillsetMatched(x) && this.isMainSubskillMatched(x)
    );
  }

  isMainSkillsetMatched(hubExpert: iAgencyExperts): boolean {
    let dataMatched: boolean;
    if (!this.mainSkillset) {
      dataMatched = true;
    } else {
      dataMatched = hubExpert.profile.expertProfile.expertise.title === this.mainSkillset;
    }
    return dataMatched;
  }

  isMainSubskillMatched(hubExpert: iAgencyExperts): boolean {
    let dataMatched: boolean;
    if (!this.subSkill) {
      dataMatched = true;
    } else if (hubExpert.profile.expertProfile.expertise.skillTypes.includes(this.subSkill)) {
      dataMatched = true;
    }
    return dataMatched;
  }

  clearFilters() {
    this.mainSkillset = null;
    this.subSkill = null;
    this.getHubExperts();
  }

}
