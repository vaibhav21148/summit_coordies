import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompiComponent } from './compi.component';

describe('CompiComponent', () => {
  let component: CompiComponent;
  let fixture: ComponentFixture<CompiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
