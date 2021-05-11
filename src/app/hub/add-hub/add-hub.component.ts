import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hub',
  templateUrl: './add-hub.component.html',
  styleUrls: ['./add-hub.component.scss']
})
export class AddHubComponent implements OnInit {

  featureBlocks: any[] = [
    {
      imageUrl: '/assets/imgs/elLab.png',
      title: 'Experience',
      shortDescription: 'Write a short description here write a short description here'
    },
    {
      imageUrl: '/assets/imgs/elLab.png',
      title: 'Space',
      shortDescription: 'Write a short description here write a short description here'
    },
    {
      imageUrl: '/assets/imgs/elLab.png',
      title: 'Experts',
      shortDescription: 'Write a short description here write a short description here'
    },
  ];

  constructor(
    public router: Router,
    public userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    if (!this.userAuth.currentUser.uid) {
      this.router.navigate(['/home']);
    }
  }

}
