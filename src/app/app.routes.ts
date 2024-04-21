import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NotesComponent} from "./notes/notes.component";
import { NgModule } from '@angular/core';
import {FormsComponent} from "./forms/forms.component";
import {NoteFormComponent} from "./forms/note-form/note-form.component";
import {BookFormComponent} from "./forms/book-form/book-form.component";
import {UsersModule} from "./users/users.module";
import {loginGuard, mustLoginGuard} from "./shared/auth.guard";

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload' // Reload the component when navigating to the same URL
};
export const routes: Routes = [
    {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full',
  },
  {
    path: 'notes',
    component: NotesComponent,
    canActivate: [mustLoginGuard],
  },
  {
    path: 'create',
    component: FormsComponent,
    canActivate: [mustLoginGuard],
    children: [
      {
        path: 'note',
        component: NoteFormComponent,
        canActivate: [mustLoginGuard]
      },
      { path: 'book',
        component: BookFormComponent,
      canActivate: [mustLoginGuard]
      },

    ],
  },
];




@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions), UsersModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
