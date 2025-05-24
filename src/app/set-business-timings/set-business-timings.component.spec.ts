import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBusinessTimingsComponent } from './set-business-timings.component';

describe('SetBusinessTimingsComponent', () => {
  let component: SetBusinessTimingsComponent;
  let fixture: ComponentFixture<SetBusinessTimingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetBusinessTimingsComponent]
    });
    fixture = TestBed.createComponent(SetBusinessTimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
