import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {

  @Input() displayFooter: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  // navigateToPage(page: string) {
  //   this.router.navigate(['/' + page]);
  // }
}
