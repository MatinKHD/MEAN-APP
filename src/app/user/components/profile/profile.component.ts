import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { User } from 'src/app/utilities/models/user.model';

import { mimeType } from 'src/app/utilities/validators/mime-type.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private id!: string;
  user!: User;
  form!: FormGroup;
  imagePreview!: string;
  isLoading!: boolean;
  ngOnInit(): void {
    this.getId();
    this.onFetchedUserProfile();
  }

  onFormSubmitHandler() {
    const user: User = {
      id: '',
      name: this.form.get('name')?.value,
      lastname: this.form.get('lastname')?.value,
      email: this.user.email,
      gender: this.form.get('gender')?.value,
      image: this.form.get('image')?.value,
      imagePath: '',
    };

    this.authService.updateUserProfile(this.id, user).subscribe({
      error: (e) => console.log(e),
    });
  }

  onFilePickerHandler(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      this.form.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  private onInitializeForm(user: User) {
    this.form = new FormGroup({
      name: new FormControl(user.name ? user.name : '', {
        validators: [Validators.required],
      }),
      lastname: new FormControl(user ? user.lastname : '', {
        validators: [Validators.required],
      }),
      gender: new FormControl(user.gender ? user.gender : '', {
        validators: [Validators.required],
      }),
      image: new FormControl(user ? user.imagePath : null, {
        validators: [Validators.required],
        asyncValidators: mimeType,
      }),
    });
    this.imagePreview = user?.imagePath;
  }

  private onFetchedUserProfile() {
    this.isLoading = true;
    this.authService.getUser(this.id).subscribe({
      next: ({ user }) => {
        this.user = user;
        this.onInitializeForm(user);
        this.isLoading = false;
      },
    });
  }
  private getId() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }
}
