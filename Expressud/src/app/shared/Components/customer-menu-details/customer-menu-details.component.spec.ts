import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMenuDetailsComponent } from './customer-menu-details.component';

describe('CustomerMenuDetailsComponent', () => {
  let component: CustomerMenuDetailsComponent;
  let fixture: ComponentFixture<CustomerMenuDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMenuDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerMenuDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
