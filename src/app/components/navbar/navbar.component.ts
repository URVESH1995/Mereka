import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../../services/data-helper.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  activeSwitch: string = 'online';

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
  ) { }


  ngOnInit(): void {
  }

  profileViewMode(): string {
    return localStorage.getItem('profileViewMode') || 'learner';
  }

  updateViewMode(mode: string) {
    localStorage.setItem('profileViewMode', mode);
    if (mode === 'expert') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/learner-dashboard']);
    }
  }

  toggleWorkshopFilters() {
    if (this.router.url !== '/home') {
      this.router.navigate(['/workshops']);
    }
  }


}
