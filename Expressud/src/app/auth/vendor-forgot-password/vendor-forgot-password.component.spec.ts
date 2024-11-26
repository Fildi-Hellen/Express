import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorForgotPasswordComponent } from './vendor-forgot-password.component';

describe('VendorForgotPasswordComponent', () => {
  let component: VendorForgotPasswordComponent;
  let fixture: ComponentFixture<VendorForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorForgotPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
