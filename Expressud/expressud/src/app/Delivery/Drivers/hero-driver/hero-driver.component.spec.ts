import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDriverComponent } from './hero-driver.component';

describe('HeroDriverComponent', () => {
  let component: HeroDriverComponent;
  let fixture: ComponentFixture<HeroDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
