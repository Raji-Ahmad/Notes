import {Component} from '@angular/core';
import {
  IAuthorId,
  ICategoryId,
  ICustomError,
  IResponse,
  NoteRequestService
} from "../../services/note-request.service";
import {baseURL} from "../../globals";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent {

  protected readonly baseUrl = baseURL;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  bookForm!: FormGroup;
  bookCats: ICategoryId[] = [];
  public authors: IAuthorId[] = [];
  file: File | null = null;
  private endpoint: string = "/create-source";

  constructor(private service: NoteRequestService, private http: HttpClient, private formBuilder: FormBuilder) {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: [''],
      link: [''],
      category: ['', Validators.required],
      datePublished: [''],
      image: ['']
    })
  }

  private _handleObservableError(error: ICustomError) {
    this.errorMessage = error.errorMessage;
    setInterval(() => {
      this.errorMessage = null;
    }, 4000);
  }

  ngOnInit(): void {
    this.service.getCat('book').subscribe((bookCats: ICategoryId[]) => {
      this.bookCats = bookCats;
    });

    // this.service.getAuthor().subscribe((authors: IAuthorId[]) => {
    //   this.authors = authors;
    // });

    this.service.getAuthor().subscribe(
      {
        next: (response: IAuthorId[]) => {
          this.authors = response
        },
        error: (err) => {
          // this._handleObservableError(err)
        },
        complete: () => {
          //

        },
      });

  }

  postForm() {
    const postData: { [key: string]: string | Blob } = {
      title: this.bookForm.get('title')?.value,
      author: this.bookForm.get('author')?.value,
      link: this.bookForm.get('link')?.value,
      category: this.bookForm.get('category')?.value,
      image: this.file as Blob
    };

    const formData = new FormData();
    for (const key in postData) {
      if (postData.hasOwnProperty(key)) {
        if (key == 'image' && this.file){
          formData.append(key, this.file as Blob, this.file?.name);
        }
        else{
          formData.append(key, postData[key]);
        }
      }
    }

    const headers = new HttpHeaders({});

    this.http.post<IResponse>(this.baseUrl + '/notes' + this.endpoint, formData, {headers})
      .subscribe({
        next: (response: IResponse) => {
          if (response.status == 'success') {
            this.bookForm.reset()
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

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.file = files[0];
      // console.log((this.file))
    }
  }


}
