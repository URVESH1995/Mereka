import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataHelperService } from './services/data-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Mereka';
  toastTimeout: number = 3000;

  constructor(
    public dataHelper: DataHelperService,
    private toastr: ToastrService
  ) {

    this.dataHelper.getObservable().subscribe(data => {
      if (data.showError) {
        this.showErrorToast(data.showError);
      } else if (data.showSuccess) {
        this.showSuccessToast(data.showSuccess);
      }
    });
  }


  showErrorToast(message: string) {
    this.toastr.error(message, '', { timeOut: this.toastTimeout });
  }

  showSuccessToast(message: string) {
    this.toastr.success(message, '', { timeOut: this.toastTimeout });
  }

  onActivate(event) {
    window.scroll(0, 0);
  }
}
