import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtmmComponent } from './ttmm.component';

describe('TtmmComponent', () => {
  let component: TtmmComponent;
  let fixture: ComponentFixture<TtmmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TtmmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TtmmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
