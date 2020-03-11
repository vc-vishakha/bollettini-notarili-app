import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {

  @Input() displayFooter: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.changeDetectRef.detectChanges();
  }

}
