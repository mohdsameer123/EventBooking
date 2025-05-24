import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldratehistoryComponent } from './goldratehistory.component';

describe('GoldratehistoryComponent', () => {
  let component: GoldratehistoryComponent;
  let fixture: ComponentFixture<GoldratehistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldratehistoryComponent]
    });
    fixture = TestBed.createComponent(GoldratehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
