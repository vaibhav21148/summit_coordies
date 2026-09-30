import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopRegComponent } from './workshop-reg.component';

describe('WorkshopRegComponent', () => {
  let component: WorkshopRegComponent;
  let fixture: ComponentFixture<WorkshopRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
