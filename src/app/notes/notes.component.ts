import {Component, inject} from '@angular/core';
import {ICustomError, INote, IResponse, NoteRequestService} from "../services/note-request.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {ActivatedRoute} from "@angular/router";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  public notes: INote[] = [];
  public filteredNotes: INote[] = [];
  filtered:boolean = false
  public page: number = 1;
  public pageSize: number = 6;
  public totalPageCount: number = 0;

  public fetchNoteData: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  public noteMessage:{s:string|null, e:string|null}[] = []


  private f_title: string = ''
  private f_tag: string = ''
  private f_cat: string = ''
  textLength: number = 200;

  private breakpointObserver = inject(BreakpointObserver);

  private isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );



  constructor(private serverRequest: NoteRequestService, public dialog: MatDialog,
              private route: ActivatedRoute) {
    this.isHandset$.subscribe(isHandset => {
      this.textLength = isHandset ? 200 : 400; // Set textLength based on screen size
    });
  }

  openDeleteDialog(id: bigint, enterAnimationDuration: string, exitAnimationDuration: string, statusCast:{s:string|null, e:string|null}): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      hasBackdrop: true,
      data: {question: 'Do you want to delete this note?'},
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result == true) {
        // console.log('The dialog was closed with true');
        this.deleteNote(id, statusCast)
      }
    });
  }

  private _handleObservableError(error: ICustomError) {
    this.errorMessage = error.errorMessage;
    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
  }

  private _handleObservableComplete(msg: string) {
    // this.deletionInProcessUserId = 0;
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }



  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap) => {

      this.f_title = paramMap.get('t') ?? '';
      this.f_cat = paramMap.get('cat') ?? '';
      this.f_tag = paramMap.get('tag') ?? '';
      if (this.f_title || this.f_cat || this.f_tag) {
        this.getFilterNotes(true)
      } else {
        this.getAllNotes(true);
      }
    });


  }

  getAllNotes(init:boolean): void {
    // this.errorMessage = null;

    this.fetchNoteData = true;

    this.serverRequest.getNotes().subscribe({
      next: (response) => {
        this.notes = response;
        this.filteredNotes = [...this.notes];
        this.fetchNoteData = false;
        this.totalPageCount = response.length;

        // this.successMessage = "Fetch successful"


        setTimeout(() => {
          this.successMessage = null;
        }, 4000)
        if(init){this.initializeNoteMessage()}
      },
      error: (err) => {
        this._handleObservableError(err)
      },
      complete: () => {
        this.fetchNoteData = false;

      },
    });

    this.filtered = false


  }

  getFilterNotes(init:boolean): void {
    // this.errorMessage = null;

    this.fetchNoteData = true;

    const params: { [key: string]: string } = {
      t: this.f_title,
      cat: this.f_cat,
      tag: this.f_tag
    }

    this.serverRequest.getFilterNotes(params).subscribe({
      next: (response) => {
        this.notes = response;
        this.filteredNotes = [...this.notes];
        this.fetchNoteData = false;
        this.totalPageCount = response.length;

        // this.successMessage = "Fetch successful"
        if(init){this.initializeNoteMessage()}
        setTimeout(() => {
          this.successMessage = null;
        }, 4000)
      },
      error: (err) => {
        this._handleObservableError(err)
      },
      complete: () => {
        this.fetchNoteData = false;

      },
    });

    this.filtered = true;


  }

  initializeNoteMessage(): void {
    // Push initial values to noteMessage array
    for (let i = 0; i < this.notes.length; i++) {
      this.noteMessage.push({ s: null, e: null });
    }
  }

  deleteNote(id: bigint, statusCast:{s:string|null, e:string|null}) {
    this.errorMessage = null;
    this.serverRequest.deleteNote(id).subscribe({
      next: (response: IResponse) => {
        if (response.status == 'success') {
          // this.successMessage = "Delete successful"

          statusCast.s = "Delete successful";

          setTimeout(() => {
            // this.successMessage = null;
            statusCast.s = null
          }, 4000);

          if (this.filtered){
            this.getFilterNotes(false);
          }
          else{this.getAllNotes(false);}

        } else {
          // this.errorMessage = "Delete Failed"
          statusCast.e = "Delete Failed";
          setTimeout(() => {
            // this.errorMessage = null;
            statusCast.e = null
          }, 4000);
        }
      },
      error: (err) => {
        this._handleObservableError(err)
      },
      complete: () => {
        this.fetchNoteData = false;
      },
    });
  }

  protected readonly length = length;
}
