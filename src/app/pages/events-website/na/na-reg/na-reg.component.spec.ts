import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaRegComponent } from './na-reg.component';

describe('NaRegComponent', () => {
  let component: NaRegComponent;
  let fixture: ComponentFixture<NaRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
