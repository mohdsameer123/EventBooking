import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoacteusComponent } from './loacteus.component';

describe('LoacteusComponent', () => {
  let component: LoacteusComponent;
  let fixture: ComponentFixture<LoacteusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoacteusComponent]
    });
    fixture = TestBed.createComponent(LoacteusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
