import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreNotificationComponent } from './more-notification.component';

describe('MoreNotificationComponent', () => {
  let component: MoreNotificationComponent;
  let fixture: ComponentFixture<MoreNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoreNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
