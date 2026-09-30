import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsBgComponent } from './events-bg.component';

describe('EventsBgComponent', () => {
  let component: EventsBgComponent;
  let fixture: ComponentFixture<EventsBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsBgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
