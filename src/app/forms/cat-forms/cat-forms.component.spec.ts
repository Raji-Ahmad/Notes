import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatFormsComponent } from './cat-forms.component';

describe('CatFormsComponent', () => {
  let component: CatFormsComponent;
  let fixture: ComponentFixture<CatFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatFormsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
