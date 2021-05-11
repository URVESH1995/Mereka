import { Component, OnInit, Input } from '@angular/core';
import { iUser } from '../../models/user';

@Component({
  selector: 'app-expert-general-profile',
  templateUrl: './expert-general-profile.component.html',
  styleUrls: ['./expert-general-profile.component.scss']
})
export class ExpertGeneralProfileComponent implements OnInit {

  @Input() expertProfile: iUser = new iUser();
  dummyItems: number[] = [1, 2, 3, 4];

  constructor() { }

  ngOnInit(): void {
  }

}
