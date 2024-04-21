import {ChangeDetectorRef, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {NavigationComponent} from "./navigation/navigation.component";
import {NotesComponent} from "./notes/notes.component";
import {AppRoutingModule} from "./app.routes";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsComponent} from "./forms/forms.component";
import {BookFormComponent} from "./forms/book-form/book-form.component";
import {NoteFormComponent} from "./forms/note-form/note-form.component";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {CatFormsComponent} from "./forms/cat-forms/cat-forms.component";
import {NameFormComponent} from "./forms/name-form/name-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatIcon} from "@angular/material/icon";
import {ShowMoreTextComponent} from "./show-more-text/show-more-text.component";
import { SplitPanelComponent } from './split-panel/split-panel.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {AuthInterceptor} from "./shared/auth.interceptor";
import {SafeHtmlWithNewlinesPipePipe} from "./pipes/TextPipes";



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    NotesComponent,
    FormsComponent,
    BookFormComponent,
    NoteFormComponent,
    CatFormsComponent,
    NameFormComponent,
    ShowMoreTextComponent,
    SplitPanelComponent,
    SafeHtmlWithNewlinesPipePipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ConfirmDialogComponent,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatFormFieldModule,
    MatIcon,
    MatToolbarModule,
    MatSidenavModule,
    MatIconButton,
  ],

  bootstrap: [AppComponent],

  providers: [
    provideAnimationsAsync(),
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    provideNativeDateAdapter(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }


  ],
})
export class AppModule {
}
