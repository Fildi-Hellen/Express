import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsTitleComponent } from './about-us-title.component';

describe('AboutUsTitleComponent', () => {
  let component: AboutUsTitleComponent;
  let fixture: ComponentFixture<AboutUsTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsTitleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutUsTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
