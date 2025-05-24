import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatealertComponent } from './ratealert.component';

describe('RatealertComponent', () => {
  let component: RatealertComponent;
  let fixture: ComponentFixture<RatealertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatealertComponent]
    });
    fixture = TestBed.createComponent(RatealertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
