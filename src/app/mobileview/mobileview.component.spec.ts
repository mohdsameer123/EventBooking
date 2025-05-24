import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileviewComponent } from './mobileview.component';

describe('MobileviewComponent', () => {
  let component: MobileviewComponent;
  let fixture: ComponentFixture<MobileviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileviewComponent]
    });
    fixture = TestBed.createComponent(MobileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
