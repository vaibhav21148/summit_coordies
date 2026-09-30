import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IjfComponent } from './ijf.component';

describe('IjfComponent', () => {
  let component: IjfComponent;
  let fixture: ComponentFixture<IjfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IjfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IjfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
