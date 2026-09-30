import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClDashComponent } from './cl-dash.component';

describe('ClDashComponent', () => {
  let component: ClDashComponent;
  let fixture: ComponentFixture<ClDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
