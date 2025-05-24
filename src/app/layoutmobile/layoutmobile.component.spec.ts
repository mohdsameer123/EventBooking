import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutmobileComponent } from './layoutmobile.component';

describe('LayoutmobileComponent', () => {
  let component: LayoutmobileComponent;
  let fixture: ComponentFixture<LayoutmobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutmobileComponent]
    });
    fixture = TestBed.createComponent(LayoutmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
