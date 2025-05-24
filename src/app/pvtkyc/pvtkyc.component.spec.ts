import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvtkycComponent } from './pvtkyc.component';

describe('PvtkycComponent', () => {
  let component: PvtkycComponent;
  let fixture: ComponentFixture<PvtkycComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PvtkycComponent]
    });
    fixture = TestBed.createComponent(PvtkycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
