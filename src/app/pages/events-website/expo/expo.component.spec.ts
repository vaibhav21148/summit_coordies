import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpoComponent } from './expo.component';

describe('ExpoComponent', () => {
  let component: ExpoComponent;
  let fixture: ComponentFixture<ExpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
