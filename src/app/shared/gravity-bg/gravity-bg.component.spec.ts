import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityBgComponent } from './gravity-bg.component';

describe('GravityBgComponent', () => {
  let component: GravityBgComponent;
  let fixture: ComponentFixture<GravityBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GravityBgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GravityBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
