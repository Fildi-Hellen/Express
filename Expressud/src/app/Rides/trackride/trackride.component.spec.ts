import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackRideComponet } from './trackride.component'; // Adjust the import path as necessary

describe('TrackRideComponet', () => {
  let component: TrackRideComponet;
  let fixture: ComponentFixture<TrackRideComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackRideComponet]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackRideComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
