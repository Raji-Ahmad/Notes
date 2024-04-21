import {Component, inject} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
private snackBar = inject(MatSnackBar);
  constructor(private auth:AuthService, private router: Router) {
  }

  async onLogout() {
    try {
      this.auth.logout();
      this.showSuccessToast('You have been logged out successfully');
      this.router.navigate(['/login']);
    } catch (error) {
      this.showErrorToast('Logout failed. Please try again.');
    }
  }
 showSuccessToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }

  /**
   * Displays an error toast message using MatSnackBar.
   * @param message - The error message to be displayed.
   */
  showErrorToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
