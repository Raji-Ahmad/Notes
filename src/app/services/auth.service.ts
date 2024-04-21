import {inject, Injectable} from '@angular/core';
import {baseURL} from "../globals";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {
  LoginData,
  LoginResponse,
  RegistrationResponse,
  UserProfile,
  UserRegistrationData
} from "../users/users.interfaces";
import {firstValueFrom, map, Observable, of, tap, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ICustomError} from "./note-request.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = `${baseURL}/auth/users/`;
  private loginUrl = `${baseURL}/auth/token/login/`;
  private logOutUrl = `${baseURL}/auth/token/logout/`;
  private userMeUrl = `${baseURL}/auth/users/me/`;

  constructor(private http: HttpClient, private router: Router) {
  }

  async registerUser(userData: UserRegistrationData): Promise<string> {
    try {
      const response = await firstValueFrom(this.http.post<RegistrationResponse>(this.registerUrl, userData));
      return response.username;
    } catch (error) {
      throw error;
    }
  }

  getToken(): string {
    const token = localStorage.getItem('Token');
    return token ? token : '';
  }

  verifyToken(): Observable<boolean> {
    let snackBar = inject(MatSnackBar);
    const token = localStorage.getItem('Token');
    const router = inject(Router);

    if (token) {
      return this.http.get<UserProfile>(this.userMeUrl).pipe(
        map(res => !!res.id),

      );
    } else {
      return of(false);
    }
  }


  _handleHttpErrorResponse(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.status === 500) {
      errorMessage = 'Internal server error';
    } else {
      errorMessage = `An error occurred: ${error.message}`;
    }

    return throwError(
      () =>
        ({
          error,
          errorMessage,
        } as ICustomError)
    );
  }

  login(userLoginData: LoginData): Observable<boolean> {

    const formData = new FormData();

    for (const key in userLoginData) {
      if (userLoginData.hasOwnProperty(key)) {
        formData.append(key, userLoginData[key as keyof LoginData]);
      }
    }

    return this.http.post<LoginResponse>(this.loginUrl, formData).pipe(
      catchError(this._handleHttpErrorResponse
      ),
      tap(res => localStorage.setItem('Token', res.auth_token)),
      map(res => !!res.auth_token),
      catchError(error => {

        return of(false);
      })
    );
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(this.logOutUrl, {}));
      localStorage.removeItem('Token');
      this.router.navigate(['/login']);
    } catch (error) {
      throw 'An error occurred during logout. Please try again.';
    }
  }


}
