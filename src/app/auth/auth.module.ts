import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../utilities/angular-material.module';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginSignupGuard } from '../utilities/guards/login-signup.guard';

const ROUTES: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginSignupGuard] },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [LoginSignupGuard],
  },
];

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
})
export class AuthModule {}
