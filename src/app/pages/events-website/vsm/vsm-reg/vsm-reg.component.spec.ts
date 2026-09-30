import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsmRegComponent } from './vsm-reg.component';

describe('VsmRegComponent', () => {
  let component: VsmRegComponent;
  let fixture: ComponentFixture<VsmRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VsmRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VsmRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
