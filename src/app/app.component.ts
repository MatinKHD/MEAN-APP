import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <app-toolbar></app-toolbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  private authSerivice: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.authSerivice.autoAuthUser();
  }
}
