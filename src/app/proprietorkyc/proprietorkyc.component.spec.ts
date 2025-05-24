import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprietorkycComponent } from './proprietorkyc.component';

describe('ProprietorkycComponent', () => {
  let component: ProprietorkycComponent;
  let fixture: ComponentFixture<ProprietorkycComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProprietorkycComponent]
    });
    fixture = TestBed.createComponent(ProprietorkycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
