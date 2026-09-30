import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLComponent } from './cl.component';

describe('CLComponent', () => {
  let component: CLComponent;
  let fixture: ComponentFixture<CLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CLComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
