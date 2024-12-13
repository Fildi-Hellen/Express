import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRequestsComponent } from './trip-requests.component';

describe('TripRequestsComponent', () => {
  let component: TripRequestsComponent;
  let fixture: ComponentFixture<TripRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
