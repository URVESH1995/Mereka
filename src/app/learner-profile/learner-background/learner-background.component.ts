import { Component, OnInit, Input } from '@angular/core';
import { iLearnerProfile } from '../../models/user';

@Component({
  selector: 'app-learner-background',
  templateUrl: './learner-background.component.html',
  styleUrls: ['./learner-background.component.scss']
})
export class LearnerBackgroundComponent implements OnInit {

  @Input() learnerProfile: iLearnerProfile = new iLearnerProfile();

  constructor() { }

  ngOnInit(): void {
  }

}
