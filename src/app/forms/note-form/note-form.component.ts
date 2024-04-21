import {Component, inject} from '@angular/core';
import {

  IBookId,
  ICategoryId,
  ICustomError,
  IResponse,
  NoteRequestService
} from "../../services/note-request.service";

import {baseURL} from "../../globals";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {LoaderService} from "../../services/loader.service";
import {forkJoin, Observable} from "rxjs";



@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.css'
})
export class NoteFormComponent {

  protected readonly baseUrl = baseURL;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  noteForm!: FormGroup;
  books: IBookId[] = [];
  noteCats: ICategoryId[] = [];
  tags: ICategoryId[] = []
  private endpoint: string = "/create";

  isLoading:boolean = false

  constructor(private service: NoteRequestService, private http: HttpClient,
              private formBuilder: FormBuilder) {
    this.noteForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      bookLink: [''],
      category: ['', Validators.required],
      tags: ['', Validators.required],
    })

  }

    ngAfterViewInit(){

  }
  ngOnInit(): void {
    this.isLoading = true

        const requests:Observable<any>[] = [
      this.service.getBook(),
      this.service.getCat('note'),
      this.service.getCat('tag')
    ];

    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        // Responses array contains the response data from each request
        this.books = responses[0]
        this.noteCats = responses[1];
        this.tags = responses [2];
        this.isLoading = false

        console.log(responses);
        console.log('All requests completed:', responses);

        // Perform action when all requests are completed
        // For example, update UI or trigger another action
      },
      error: (error: any) => {
        // Handle error if any of the requests fail
        console.error('Error:', error);
      }
    });


  }

  private _handleObservableError(error: ICustomError) {
    this.errorMessage = error.errorMessage;
    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
  }

  postForm() {
    const selectedTags: string[] = this.noteForm.get('tags')?.value || [];

    const postData: { [key: string]: string } = {
      title: this.noteForm.get('title')?.value,
      description: this.noteForm.get('description')?.value,
      category: this.noteForm.get('category')?.value,
      // tags: this.noteForm.get('tags')?.value

    };

    if(this.noteForm.get('bookLink')?.value){
      postData['bookLink'] = this.noteForm.get('bookLink')?.value
    }


     let formData:FormData = new FormData();
    for (const key in postData) {
      if (postData.hasOwnProperty(key)) {
        formData.append(key, postData[key]);
      }
    }

     selectedTags.forEach(_tag =>{
       formData.append('tags', _tag)
     })




    const headers = new HttpHeaders({});

    this.http.post<IResponse>(this.baseUrl + '/notes' + this.endpoint, formData, {headers})
      .subscribe({
        next: (response: IResponse) => {
          if (response.status == 'success') {
            this.noteForm.reset()
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
