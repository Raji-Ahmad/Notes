import { TestBed } from '@angular/core/testing';

import { NoteRequestService } from './note-request.service';

describe('NoteRequestService', () => {
  let service: NoteRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
