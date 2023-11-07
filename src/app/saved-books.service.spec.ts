import { TestBed } from '@angular/core/testing';

import { SavedBooksService } from './saved-books.service';

describe('SavedBooksService', () => {
  let service: SavedBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
