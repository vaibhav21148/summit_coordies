import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorcardComponent } from './sponsorcard.component';

describe('SponsorcardComponent', () => {
  let component: SponsorcardComponent;
  let fixture: ComponentFixture<SponsorcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
