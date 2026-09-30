import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VantaBgComponent } from './vanta-bg.component';

describe('VantaBgComponent', () => {
  let component: VantaBgComponent;
  let fixture: ComponentFixture<VantaBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VantaBgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VantaBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
