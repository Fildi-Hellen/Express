import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidesudComponent } from './ridesud.component';

describe('RidesudComponent', () => {
  let component: RidesudComponent;
  let fixture: ComponentFixture<RidesudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidesudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RidesudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
