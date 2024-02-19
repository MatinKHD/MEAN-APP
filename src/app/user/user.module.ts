import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from '../utilities/guards/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../utilities/angular-material.module';

const ROUTES: Routes = [
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    AngularMaterialModule,
  ],
})
export class UserModule {}
