import { Component, inject, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';

import { User } from '../utilities/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  user$!: Observable<{ user: User | null; authStatus: boolean }>;

  ngOnInit(): void {
    this.user$ = this.authService.user$;
  }

  onLogoutClickHanlder() {
    this.authService.logout();
  }
}
