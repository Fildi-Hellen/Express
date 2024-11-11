import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDriverComponent } from './filter-driver.component';

describe('FilterDriverComponent', () => {
  let component: FilterDriverComponent;
  let fixture: ComponentFixture<FilterDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
