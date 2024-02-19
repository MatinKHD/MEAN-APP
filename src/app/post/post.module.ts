import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../utilities/angular-material.module';

import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';

import { AuthGuard } from 'src/app/utilities/guards/auth.guard';

const ROUTES: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: CreateComponent, canActivate: [AuthGuard] },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  declarations: [CreateComponent, ListComponent],
})
export class PostModule {}
