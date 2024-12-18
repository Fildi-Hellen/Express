import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAuthComponent } from './driver-auth.component';

describe('DriverAuthComponent', () => {
  let component: DriverAuthComponent;
  let fixture: ComponentFixture<DriverAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriverAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
