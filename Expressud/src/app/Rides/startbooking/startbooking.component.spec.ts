import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartbookingComponent } from './startbooking.component';

describe('StartbookingComponent', () => {
  let component: StartbookingComponent;
  let fixture: ComponentFixture<StartbookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartbookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
