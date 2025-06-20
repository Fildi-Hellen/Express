import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRidesComponent } from './home-rides.component';

describe('HomeRidesComponent', () => {
  let component: HomeRidesComponent;
  let fixture: ComponentFixture<HomeRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRidesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
