import { Component, OnInit, Input } from '@angular/core';
import { iLearnerProfile } from '../../models/user';

@Component({
  selector: 'app-learner-general-profile',
  templateUrl: './learner-general-profile.component.html',
  styleUrls: ['./learner-general-profile.component.scss']
})
export class LearnerGeneralProfileComponent implements OnInit {

  @Input() hideBottomViews: boolean;
  @Input() learnerProfile: iLearnerProfile = new iLearnerProfile();

  constructor() { }

  ngOnInit(): void {
  }

}
