import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishComponent } from './publish.component';

describe('PublishComponent', () => {
  let component: PublishComponent;
  let fixture: ComponentFixture<PublishComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishComponent]
    });
    fixture = TestBed.createComponent(PublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
