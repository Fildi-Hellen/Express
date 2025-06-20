import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRidesComponent } from './user-rides.component';

describe('UserRidesComponent', () => {
  let component: UserRidesComponent;
  let fixture: ComponentFixture<UserRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRidesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
