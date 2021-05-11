import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { iUser } from '../models/user';
import { iExpertise } from '../models/user';
import { Location } from '@angular/common';
import { iPostJob } from '../models/post-job';

@Component({
  selector: 'app-find-expert',
  templateUrl: './find-expert.component.html',
  styleUrls: ['./find-expert.component.scss']
})
export class FindExpertComponent implements OnInit {

  selectedSkill: string;
  allExperts: iUser[] = [];
  displayExperts: iUser[] = [];
  searchQuery: string;
  loading: boolean;
  myPostedJobs: iPostJob[] = [];

  constructor(
    public router: Router,
    public location: Location,
    public activeRoute: ActivatedRoute,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) {
    this.myPostedJobs = this.dataHelper.myPostedJobs;
  }


  ngOnInit(): void {
    if (this.dataHelper.dataFetching.allUsersFetched || this.dataHelper.selectedSkill) {
      this.getAllExperts();
    } else {
      this.loading = true;
    }

    this.dataHelper.getObservable().subscribe(data => {
      if (data.allUsersFetched) {
        this.dataHelper.selectedSkill = this.activeRoute.snapshot.params.selectedSkill;
        this.getAllExperts();
        this.loading = false;
      } else if (data.myPostedJobsFetched) {
        this.myPostedJobs = this.dataHelper.myPostedJobs;
      }
    });
  }


  getAllExperts() {
    this.selectedSkill = this.dataHelper.selectedSkill;
    if (this.selectedSkill) {
      this.location.replaceState('/find-expert/' + this.selectedSkill);
    }

    this.allExperts = [];
    this.displayExperts = [];
    const users = this.dataHelper.allUsers;
    for (var uid in users) {
      const user: iUser = users[uid];
      if (user.isExpert && user.uid !== this.userAuth.currentUser.uid &&
        user.expertProfile && user.expertProfile.expertise) {
        if (this.selectedSkill && this.isExpertCategoryMatched(user.expertProfile.expertise)) {
          if (this.selectedSkill) {
            this.allExperts.push(user);
            this.displayExperts.push(user);
          } else if (!this.selectedSkill) {
            this.allExperts.push(user);
            this.displayExperts.push(user);
          }
        }
      }
    }
  }


  isExpertCategoryMatched(expertise: iExpertise): boolean {
    let categoryMatched: boolean;
    if (expertise.title.toLowerCase().match(this.selectedSkill.toLowerCase())) {
      categoryMatched = true;
    }
    return categoryMatched;
  }


  inviteExpertToThisJob(expert: iUser, job: iPostJob) {
    if (this.dataHelper.alreadyInvitedOrApplied(expert, job)) {
      if (!job.invites) {
        job.invites = [];
      }
      job.invites.push(expert.uid);
      this.dataHelper.inviteExpertToJob(expert, job);
    } else {
      this.dataHelper.publishSomeData({ showError: 'Expert already invited, or applied to this job!' });
    }
  }


  searchExperts() {
    this.displayExperts = this.allExperts.filter(x =>
      x.fullName.toLowerCase().match(this.searchQuery.toLowerCase()) ||
      (x.myAgency && x.myAgency.toLowerCase().match(this.searchQuery.toLowerCase())) ||
      (x.agencyId && this.dataHelper.allUsers[x.agencyId].myAgency.toLowerCase().match(this.searchQuery.toLowerCase()))
    );
  }


  getAllSkills(expert: iUser): string[] {
    let skills: string[] = [];
    skills = expert.expertProfile.expertise.skills;
    return skills;
  }


  inviteExpert(expert: iUser) {
    this.dataHelper.inviteExpertToAgency(expert);
  }


  userDetails(expert: iUser) {
    this.dataHelper.expertDetails = expert;
    this.router.navigate(['/general-profile/']);
  }


  getExpertAgency(expert: iUser): string {
    return this.dataHelper.getExpertAgency(expert);
  }

}
