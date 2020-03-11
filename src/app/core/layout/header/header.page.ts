import { Component, OnInit } from '@angular/core';
import { AppConstant } from './../../constants/app-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {

  appName = AppConstant.appName;
  constructor() { }

  ngOnInit() {
  }

}
