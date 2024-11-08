import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingStatusComponent } from './tracking-status.component';

describe('TrackingStatusComponent', () => {
  let component: TrackingStatusComponent;
  let fixture: ComponentFixture<TrackingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
