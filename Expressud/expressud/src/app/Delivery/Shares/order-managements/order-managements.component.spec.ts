import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManagementsComponent } from './order-managements.component';

describe('OrderManagementsComponent', () => {
  let component: OrderManagementsComponent;
  let fixture: ComponentFixture<OrderManagementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderManagementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
