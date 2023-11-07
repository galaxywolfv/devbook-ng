import { TestBed } from '@angular/core/testing';

import { PublishedBooksService } from './published-books.service';

describe('PublishedBooksService', () => {
  let service: PublishedBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublishedBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
