import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import { DataHelperService } from '../services/data-helper.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public router: Router,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
  }

  appData(dataKey: string) {
    this.router.navigate(['/app-data/' + dataKey]);
  }

  becomeVendor() {
    if (!this.userAuth.currentUser.uid) {
      this.dataHelper.openSpecificModal('loginModalOpener');
    } else {
      this.router.navigate(['/add-hub']);
    }
  }

}
