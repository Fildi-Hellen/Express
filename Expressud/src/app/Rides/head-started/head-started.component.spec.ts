import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadStartedComponent } from './head-started.component';

describe('HeadStartedComponent', () => {
  let component: HeadStartedComponent;
  let fixture: ComponentFixture<HeadStartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadStartedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
