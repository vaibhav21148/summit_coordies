import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenNavbarComponent } from './full-screen-navbar.component';

describe('FullScreenNavbarComponent', () => {
  let component: FullScreenNavbarComponent;
  let fixture: ComponentFixture<FullScreenNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullScreenNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
