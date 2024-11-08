import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroHeadingComponent } from './hero-heading.component';

describe('HeroHeadingComponent', () => {
  let component: HeroHeadingComponent;
  let fixture: ComponentFixture<HeroHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroHeadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
