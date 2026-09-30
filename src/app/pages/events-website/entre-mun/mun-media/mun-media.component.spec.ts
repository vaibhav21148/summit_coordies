import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunMediaComponent } from './mun-media.component';

describe('MunMediaComponent', () => {
  let component: MunMediaComponent;
  let fixture: ComponentFixture<MunMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MunMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
