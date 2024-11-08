import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDriverComponent } from './setting-driver.component';

describe('SettingDriverComponent', () => {
  let component: SettingDriverComponent;
  let fixture: ComponentFixture<SettingDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
