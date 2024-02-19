import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AngularMaterialModule } from './utilities/angular-material.module';

import { AuthInterceptor } from './utilities/interceptors/auth.interceptor';
import { ErrorInterceptor } from './utilities/interceptors/error.interceptor';
import { PostInterceptor } from './utilities/interceptors/post.interceptor';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./post/post.module').then((m) => m.PostModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
];

@NgModule({
  declarations: [AppComponent, ToolbarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    AngularMaterialModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PostInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
