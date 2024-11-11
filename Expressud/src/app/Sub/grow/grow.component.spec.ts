import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowComponent } from './grow.component';

describe('GrowComponent', () => {
  let component: GrowComponent;
  let fixture: ComponentFixture<GrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
