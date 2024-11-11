import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OoflineSupportComponent } from './oofline-support.component';

describe('OoflineSupportComponent', () => {
  let component: OoflineSupportComponent;
  let fixture: ComponentFixture<OoflineSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OoflineSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OoflineSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
