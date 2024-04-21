import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component'; // Import the RegistrationComponent
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { loginGuard,  mustLoginGuard} from '../shared/auth.guard';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent,canActivate: [loginGuard], data: { routeName: 'register' } },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard], data: { routeName: 'login' } },
  { path: 'logout', component: LogoutComponent, canActivate: [mustLoginGuard], data: { routeName: 'logout' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
