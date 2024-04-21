import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {map, Observable, of, tap} from "rxjs";
import {catchError} from "rxjs/operators";


// export const registrationGuard: CanActivateFn = (): Observable<boolean> | boolean => {
//   let snackBar = inject(MatSnackBar);
//   const authService = inject(AuthService);
//   const router = inject(Router);
//
//   const token: string = authService.getToken()
//
//   if (!token) {
//     return false
//   }
//   return authService.verifyToken().pipe(
//     catchError(err => {
//       snackBar.open('You need to login', 'Close', {
//       duration: 3000
//     });;
//       router.navigate(['/login']);
//       return of(false);
//     }))
// };

export const loginGuard: CanActivateFn = ():Observable<boolean> | boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token: string = authService.getToken()
    if (!token) {
    return true
  }
  return authService.verifyToken().pipe(
    tap((res) => {
      if(res){
        router.navigate(['/logout'])
      }
    }),
    map(res => !res),
    catchError(err => {
      return of(true);
    }),
    )
};


// export const logOutGuard: CanActivateFn = (): Observable<boolean> | boolean => {
//
//     let snackBar = inject(MatSnackBar);
//   const authService = inject(AuthService);
//   const router = inject(Router);
//
//   const token: string = authService.getToken()
//
//   if (!token) {
//     return false
//   }
//   return authService.verifyToken().pipe(
//     catchError(err => {
//       snackBar.open('You need to login', 'Close', {
//       duration: 3000
//     });;
//       router.navigate(['/login']);
//       return of(false);
//     }))
// };

export const mustLoginGuard: CanActivateFn = (): Observable<boolean> | boolean => {

  let snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token: string = authService.getToken()

  if (!token) {
    snackBar.open('You need to login', 'Close', {
      duration: 3000
    });
      router.navigate(['/login']);
    return false
  }
  return authService.verifyToken().pipe(
    catchError(err => {
      snackBar.open('You need to login', 'Close', {
      duration: 3000
    });
      router.navigate(['/login']);
      return of(false);
    }))
};




