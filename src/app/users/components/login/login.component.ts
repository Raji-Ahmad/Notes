import {Component, inject} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public loginForm: FormGroup
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public snackBar = inject(MatSnackBar);

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private router: Router) {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  onInit() {
    this.auth.verifyToken().subscribe((isUserAuthenticated: boolean) => {
      if (isUserAuthenticated) {
        this.showSuccessToast('Already Logged In.');
        this.router.navigate(['/notes']);

      } else {
        this.router.navigate(['/login']);
      }
    })
  }



  login() {
    if (this.loginForm.valid) {
      const userLoginData = this.loginForm.value;
      // try {
      //   this.auth.login(userLoginData).then(
      //     (token: string|null) => {
      //       if (token) {
      //         this.router.navigate(['/notes']);
      //         this.showSuccessToast('Logged in successfully');
      //       } else {
      //         this.showErrorToast('Incorrect login credentials. Please try again.');
      //       }
      //     }
      //   )
      //
      // } catch (error) {
      //   this.showErrorToast('An error occurred during login. Please try again.');
      // }

      this.auth.login(userLoginData).subscribe({
          next: (res) => {
            if (res){this.router.navigate(['/notes']);
            this.showSuccessToast('Logged in successfully');
            }
            else {
              this.showSuccessToast('Login credentials not correct');
            }

          },
          error: (err) => {
            this.showErrorToast('Issue logging in');
          },
          complete: () => {

          }
        }
      )
    } else {
      this.showErrorToast('Please fill in all required fields.');
    }
  }

  /**
   * Displays a success toast message.
   * @param message - The success message to be displayed.
   */
  showSuccessToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  /**
   * Displays an error toast message.
   * @param message - The error message to be displayed.
   */
  showErrorToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }

  /**
   * Handles the actions to be taken on login failure.
   * @param message - The error message to be displayed.
   */
  handleLoginError(message: string) {
    this.showErrorToast(message);
  }
}
