import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsummitComponent } from './isummit.component';

describe('IsummitComponent', () => {
  let component: IsummitComponent;
  let fixture: ComponentFixture<IsummitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsummitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsummitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
