import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreItemPageComponent } from './store-item-page.component';

describe('StoreItemPageComponent', () => {
  let component: StoreItemPageComponent;
  let fixture: ComponentFixture<StoreItemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreItemPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
