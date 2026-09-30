import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerSummitComponent } from './influencer-summit.component';

describe('InfluencerSummitComponent', () => {
  let component: InfluencerSummitComponent;
  let fixture: ComponentFixture<InfluencerSummitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerSummitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluencerSummitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
