import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadermobileComponent } from './headermobile.component';

describe('HeadermobileComponent', () => {
  let component: HeadermobileComponent;
  let fixture: ComponentFixture<HeadermobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadermobileComponent]
    });
    fixture = TestBed.createComponent(HeadermobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
