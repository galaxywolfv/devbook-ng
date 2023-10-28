import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedBooksComponent } from './published-books.component';

describe('PublishedBooksComponent', () => {
  let component: PublishedBooksComponent;
  let fixture: ComponentFixture<PublishedBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishedBooksComponent]
    });
    fixture = TestBed.createComponent(PublishedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
