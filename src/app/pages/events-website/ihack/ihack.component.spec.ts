import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhackComponent } from './ihack.component';

describe('IhackComponent', () => {
  let component: IhackComponent;
  let fixture: ComponentFixture<IhackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IhackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IhackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
