import { env } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap, BehaviorSubject, take } from 'rxjs';
import { User } from 'src/app/utilities/models/user.model';
import { UserForm } from 'src/app/utilities/models/user-form.model';
import { ActivatedRoute, Params, Router } from '@angular/router';

const URL = env.apiUrl + '/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private user = new BehaviorSubject<{
    user: User | null;
    authStatus: boolean;
  }>({ user: null, authStatus: false });

  user$: Observable<{ user: User | null; authStatus: boolean }> =
    this.user.asObservable();

  private token!: string | null;
  private tokenTimer!: any;

  getToken(): string | null {
    return this.token;
  }

  getUser(id: string): Observable<{ message: string; user: User }> {
    return this.http.get<{ message: string; user: User }>(URL + `/${id}`);
  }

  updateUserProfile(
    id: string,
    data: User
  ): Observable<{ message: string; user: User }> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('lastname', data.lastname);
    formData.append('email', data.email);
    formData.append('gender', data.gender);
    data.image && formData.append('image', data.image, data.name);
    return this.http
      .put<{
        message: string;
        user: User;
        token: string;
        expiresIn: string;
      }>(URL + `/update/${id}`, formData)
      .pipe(
        tap(({ user, token, expiresIn }) => {
          const now = new Date().getTime();
          const expirationDate = new Date(now + parseInt(expiresIn));
          this.setAuthData(token, expirationDate, user);
          this.autoAuthUser();
          this.router.navigate(['/list']);
        }),
        map(({ user, message }) => ({ user, message }))
      );
  }

  createUser(user: UserForm): Observable<User> {
    return this.http
      .post<{ message: string; user: User }>(URL + `/signup`, user)
      .pipe(
        map((userData) => userData.user),
        tap((user) => this.user.next({ user, authStatus: false }))
      );
  }

  existEmail(email: string): Observable<boolean> {
    return this.http.get<{ message: string; users: User[] }>(URL).pipe(
      map((userData) => {
        const userExistance = !!userData.users.find(
          (users) => users.email === email
        );
        return userExistance;
      })
    );
  }

  login(
    email: string,
    password: string
  ): Observable<{ message: string; user: User }> {
    return this.http
      .post<{ message: string; token: string; user: User; expiresIn: number }>(
        URL + '/login',
        {
          email,
          password,
        }
      )
      .pipe(
        tap(({ token, user, expiresIn }) => {
          this.token = token;
          token && this.user.next({ user, authStatus: true });
          const now = new Date().getTime();
          const expirationDate = new Date(now + expiresIn);
          this.setAuthData(token, expirationDate, user);
          this.tokenTimer = setTimeout(() => this.logout(), expiresIn);
          this.route.queryParams.pipe(take(1)).subscribe((params: Params) => {
            const returnUrl: string = params['returnUrl'];
            returnUrl
              ? this.router.navigate([returnUrl])
              : this.router.navigate(['/list']);
          });
        }),
        map(({ message, user }) => ({ message, user }))
      );
  }

  logout(): void {
    this.token = null;
    this.user.next({ user: null, authStatus: false });
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/list']);
    this.clearAuthData();
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    const now = new Date();
    let expiresIn;
    if (authInformation?.expirationDate) {
      expiresIn = authInformation?.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.user.next({ user: authInformation.user, authStatus: true });
        this.tokenTimer = setTimeout(() => this.logout(), expiresIn);
      }
    }
  }

  private setAuthData(token: string, expirationDate: Date, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('user');
  }

  private getAuthData():
    | { token: string; expirationDate: Date; user: User }
    | undefined {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const user = localStorage.getItem('user');
    if (!token || !expirationDate || !user) return;
    return {
      token,
      expirationDate: new Date(expirationDate),
      user: JSON.parse(user),
    };
  }
}
