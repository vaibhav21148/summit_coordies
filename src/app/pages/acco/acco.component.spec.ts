import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoComponent } from './acco.component';

describe('AccoComponent', () => {
  let component: AccoComponent;
  let fixture: ComponentFixture<AccoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
