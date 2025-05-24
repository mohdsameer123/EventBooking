import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldbharatgoldratesComponent } from './goldbharatgoldrates.component';

describe('GoldbharatgoldratesComponent', () => {
  let component: GoldbharatgoldratesComponent;
  let fixture: ComponentFixture<GoldbharatgoldratesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldbharatgoldratesComponent]
    });
    fixture = TestBed.createComponent(GoldbharatgoldratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
