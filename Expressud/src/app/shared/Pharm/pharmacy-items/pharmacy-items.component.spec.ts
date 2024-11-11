import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyItemsComponent } from './pharmacy-items.component';

describe('PharmacyItemsComponent', () => {
  let component: PharmacyItemsComponent;
  let fixture: ComponentFixture<PharmacyItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PharmacyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
