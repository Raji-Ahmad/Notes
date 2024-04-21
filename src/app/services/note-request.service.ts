import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {baseURL} from "../globals";

@Injectable({
  providedIn: 'root'
})
export class NoteRequestService {
  public apiUrl = baseURL
  private mapping: { [key: string]: string } = {
    'note': '/create-note-category',
    'book': '/create-book-category',
    'tag': '/create-book-tag'
  }

  constructor(private http: HttpClient) {
  }

  _handleHttpErrorResponse(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.status === 500) {
      errorMessage = 'Internal server error';
    } else {
      errorMessage = `An error occurred: ${error.message}`;
    }

    return throwError(
      () =>
        ({
          error,
          errorMessage,
        } as ICustomError)
    );
  }

  getNotes(): Observable<INote[]> {
    return this.http
      .get<INote[]>(this.apiUrl + '/notes/getnotes.json')
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  deleteNote(id: bigint): Observable<IResponse> {
    return this.http
      .delete<IResponse>(this.apiUrl + `/notes/delete/${id}`)
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  getNoteForm(): Observable<string> {
    return this.http
      .get<string>(this.apiUrl + '/notes/create?form=true', {responseType: 'text' as 'json'})
      .pipe(
        map((template: string) => this.modifyFormAction(template))
      )
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  getBookForm(): Observable<string> {
    return this.http
      .get<string>(this.apiUrl + '/notes/create-source?form=true', {responseType: 'text' as 'json'})
      .pipe(
        map((template: string) => this.modifyFormAction(template))
      )
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  private modifyFormAction(template: string): string {
    // Use DOMParser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(template, 'text/html');

    // Modify the form's action attribute
    const formElement = doc.querySelector('form');
    if (formElement) {
      formElement.setAttribute('action', baseURL + formElement.getAttribute('action'));
    }

    // Serialize the modified HTML back to a string
    return new XMLSerializer().serializeToString(doc);
  }

  getCat(type: 'note' | 'book' | 'tag'): Observable<ICategoryId[]> {

    return this.http
      .get<ICategoryId[]>(this.apiUrl + '/notes' + this.mapping[type])
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  getAuthor(): Observable<IAuthorId[]> {

    return this.http
      .get<IAuthorId[]>(this.apiUrl + '/notes' + '/create-author')
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  getBook(): Observable<IBookId[]> {

    return this.http
      .get<IBookId[]>(this.apiUrl + '/notes' + '/create-source')
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  getFilterNotes(params: { [p: string]: string }): Observable<INote[]> {

    const urlList: string[] = [];

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== null) {
        urlList.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]!));
      }
    }
    const urlParams:string = urlList.join('&')

    return this.http
      .get<INote[]>(this.apiUrl + '/notes/search?' + urlParams)
      .pipe(catchError(this._handleHttpErrorResponse));
  }
}

export interface INote {
  id: bigint;
  title: string;
  description: string;
  category: ICategory;
  tags: ICategory[];
  modified_at: string;
}

export interface ICategory {
  name: string;
}

export interface ICategoryId {
  id: bigint;
  name: string;
}

export interface IBookId {
  id: bigint;
  title: string;
}

export interface IAuthorId {
  id: bigint;
  fullName: string;
}


export interface ICustomError {
  error: HttpErrorResponse;
  errorMessage: string;
}

export interface IResponse {
  status: string
}
