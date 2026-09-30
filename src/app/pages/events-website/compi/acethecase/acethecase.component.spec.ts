import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcethecaseComponent } from './acethecase.component';

describe('AcethecaseComponent', () => {
  let component: AcethecaseComponent;
  let fixture: ComponentFixture<AcethecaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcethecaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcethecaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
