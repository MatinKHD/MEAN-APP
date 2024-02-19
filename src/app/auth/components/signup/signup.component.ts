import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

import { matchPasswords } from 'src/app/utilities/validators/match-password.validator';
import { existEmail } from 'src/app/utilities/validators/exist-email.validator';

@Component({
  selector: 'app-signup',
  templateUrl: `./signup.component.html`,
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  isLoading: boolean = false;

  form!: FormGroup;
  imagePreview!: string;

  ngOnInit(): void {
    this.initializeForm();
  }

  onFilePickerHandler(event: Event) {}

  onSignupHandler() {
    const user = {
      id: '',
      name: this.form.get('name')?.value,
      lastname: this.form.get('lastname')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('passwordGroup')?.get('password')?.value,
    };

    this.authService.createUser(user).subscribe({
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.form.reset();
        this.router.navigate(['auth/login']);
      },
    });
  }

  initializeForm() {
    this.form = this.fb.group({
      name: new FormControl('', { validators: Validators.required }),
      lastname: new FormControl('', {
        validators: Validators.required,
      }),
      email: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [existEmail(this.authService)],
        updateOn: 'blur',
      }),
      passwordGroup: this.fb.group(
        {
          password: new FormControl('', { validators: Validators.required }),
          confirmPassword: new FormControl('', {
            validators: Validators.required,
          }),
        },
        { validators: [matchPasswords] }
      ),
    });
  }
}
