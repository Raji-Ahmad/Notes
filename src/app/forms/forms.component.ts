import {Component} from '@angular/core';
import {baseURL} from "../globals";

type MyObjectType = {
  [key: string]: string;
};
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
  public baseUrl: string = baseURL ;

  otherDetails: MyObjectType = {
    'Note category': '/create-note-category',
    'Book category': '/create-book-category',
    'Tags': '/create-book-tag',
  }

  // constructor(private service: NoteRequestService) {
  // }
  //
  //   ngOnInit(): void {
  //   this.baseUrl = this.service.baseUrl;
  // }
}
