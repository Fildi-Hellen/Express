import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCourierComponent } from './hero-courier.component';

describe('HeroCourierComponent', () => {
  let component: HeroCourierComponent;
  let fixture: ComponentFixture<HeroCourierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCourierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
