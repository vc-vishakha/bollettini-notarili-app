import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  currentUser: User;
  private _unsubscribeServices: Subject<any> = new Subject();
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getDetails();
  }

  getDetails() {
    this.authService.userSessionSubject
      .pipe(takeUntil(this._unsubscribeServices))
      .subscribe((data) => {
        if (data !== null) {
          // console.log(data)
          this.currentUser = data;
        }
      });

  }


  ionViewDidLeave() {
    this.currentUser = null;
    this._unsubscribeServices.next();
    this._unsubscribeServices.complete();
  }

}

export interface User {
  status: string;
  passwordResetStatus: boolean;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  parentId: string;
  updatedAt: string;
  createdAt: string;
}