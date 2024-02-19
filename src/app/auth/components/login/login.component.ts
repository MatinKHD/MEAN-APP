import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private authService: AuthService = inject(AuthService);

  isLoading: boolean = false;
  email!: string;
  password!: string;

  ngOnInit(): void {}

  onLoginFormSubmitHandler() {
    this.authService
      .login(this.email, this.password)
      .pipe(take(1))
      .subscribe({
        error: (e: any) => console.log(e),
      });
  }
}
