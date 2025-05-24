import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LtdkycComponent } from './ltdkyc.component';

describe('LtdkycComponent', () => {
  let component: LtdkycComponent;
  let fixture: ComponentFixture<LtdkycComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LtdkycComponent]
    });
    fixture = TestBed.createComponent(LtdkycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
