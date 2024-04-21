import {Component, Input} from '@angular/core';
import {baseURL} from "../../globals";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ICustomError, IResponse} from "../../services/note-request.service";

@Component({
  selector: 'app-cat-forms',
  templateUrl: './cat-forms.component.html',
  styleUrl: './cat-forms.component.css'
})
export class CatFormsComponent {
  @Input({required: true}) title: string = '';
  @Input({required: true}) endpoint: string = '';
  protected readonly baseUrl = baseURL;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  nameForm!: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.nameForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  private _handleObservableError(error: ICustomError) {
    this.errorMessage = error.errorMessage;
    setInterval(() => {
      this.errorMessage = null;
    }, 4000);
  }


  postForm() {
    const postData:  { [key: string]: string } = {
      name: this.nameForm.get('name')?.value
    };

    const formData = new URLSearchParams();
    for (const key in postData) {
      if (postData.hasOwnProperty(key)) {
        formData.set(key, postData[key]);
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post<IResponse>(this.baseUrl + '/notes' + this.endpoint, formData.toString(), {headers:headers})
      .subscribe({
        next: (response: IResponse) => {
          if (response.status == 'success') {
            this.nameForm.reset()
            this.successMessage = "Added successfully"

            setInterval(() => {
              this.successMessage = null;
            }, 4000);

            //this.getAllNotes();

          } else {
            this.errorMessage = "Add Failed"
            setInterval(() => {
              this.errorMessage = null;
            }, 4000);
          }
        },
        error: (err) => {
          this._handleObservableError(err)
        },
        complete: () => {

        },
      });
  }
}
