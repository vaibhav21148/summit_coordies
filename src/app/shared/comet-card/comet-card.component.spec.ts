import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CometCardComponent } from './comet-card.component';

describe('CometCardComponent', () => {
  let component: CometCardComponent;
  let fixture: ComponentFixture<CometCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CometCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CometCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
