import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyServingComponent } from './pharmacy-serving.component';

describe('PharmacyServingComponent', () => {
  let component: PharmacyServingComponent;
  let fixture: ComponentFixture<PharmacyServingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyServingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PharmacyServingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
