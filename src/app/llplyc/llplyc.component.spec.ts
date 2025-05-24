import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlplycComponent } from './llplyc.component';

describe('LlplycComponent', () => {
  let component: LlplycComponent;
  let fixture: ComponentFixture<LlplycComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LlplycComponent]
    });
    fixture = TestBed.createComponent(LlplycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
