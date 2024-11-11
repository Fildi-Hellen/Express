import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DFaqComponent } from './d-faq.component';

describe('DFaqComponent', () => {
  let component: DFaqComponent;
  let fixture: ComponentFixture<DFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DFaqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
