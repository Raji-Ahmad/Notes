import {NgModule} from "@angular/core";
import {RegistrationComponent} from "./components/registration/registration.component";
import {LoginComponent} from "./components/login/login.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {CommonModule} from "@angular/common";
import {UsersRoutingModule} from "./users-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RegistrationComponent,
    LoginComponent,
    LogoutComponent,
  ],
  providers: [],
})
export class UsersModule { }
