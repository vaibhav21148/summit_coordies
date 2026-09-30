import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderingQuestionComponent } from './ordering-question.component';

describe('OrderingQuestionComponent', () => {
  let component: OrderingQuestionComponent;
  let fixture: ComponentFixture<OrderingQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderingQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderingQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
