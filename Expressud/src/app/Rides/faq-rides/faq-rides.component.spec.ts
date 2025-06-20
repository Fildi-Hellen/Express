import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqRidesComponent } from './faq-rides.component';

describe('FaqRidesComponent', () => {
  let component: FaqRidesComponent;
  let fixture: ComponentFixture<FaqRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqRidesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaqRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
