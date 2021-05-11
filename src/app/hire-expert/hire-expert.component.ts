import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hire-expert',
  templateUrl: './hire-expert.component.html',
  styleUrls: ['./hire-expert.component.scss']
})
export class HireExpertComponent implements OnInit {

  faqs = [];

  applicationSkills = [
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


  constructor(
    public router: Router,
    public dataHelper: DataHelperService
  ) { }


  ngOnInit(): void {
    this.faqs = this.dataHelper.appData.faqs;

    this.dataHelper.getObservable().subscribe(data => {
      if (data.appDataFetched) {
        this.faqs = this.dataHelper.appData.faqs;
      }
    });
  }


  filterExperts(skill) {
    this.dataHelper.selectedSkill = skill.title;
    this.router.navigate(['/find-expert/' + skill.title]);
  }

}
