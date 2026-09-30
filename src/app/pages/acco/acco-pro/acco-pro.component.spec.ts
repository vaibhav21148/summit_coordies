import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoProComponent } from './acco-pro.component';

describe('AccoProComponent', () => {
  let component: AccoProComponent;
  let fixture: ComponentFixture<AccoProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccoProComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccoProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
