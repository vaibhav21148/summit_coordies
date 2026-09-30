import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsmComponent } from './vsm.component';

describe('VsmComponent', () => {
  let component: VsmComponent;
  let fixture: ComponentFixture<VsmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VsmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
