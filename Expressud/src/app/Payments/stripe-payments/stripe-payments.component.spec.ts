import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripePaymentsComponent } from './stripe-payments.component';

describe('StripePaymentsComponent', () => {
  let component: StripePaymentsComponent;
  let fixture: ComponentFixture<StripePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripePaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StripePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
