import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunDashComponent } from './mun-dash.component';

describe('MunDashComponent', () => {
  let component: MunDashComponent;
  let fixture: ComponentFixture<MunDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MunDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});