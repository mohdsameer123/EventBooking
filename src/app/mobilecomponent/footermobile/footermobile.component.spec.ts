import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootermobileComponent } from './footermobile.component';

describe('FootermobileComponent', () => {
  let component: FootermobileComponent;
  let fixture: ComponentFixture<FootermobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FootermobileComponent]
    });
    fixture = TestBed.createComponent(FootermobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
