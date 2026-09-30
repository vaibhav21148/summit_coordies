import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvervaultCardComponent } from './evervault-card.component';

describe('EvervaultCardComponent', () => {
  let component: EvervaultCardComponent;
  let fixture: ComponentFixture<EvervaultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvervaultCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvervaultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
