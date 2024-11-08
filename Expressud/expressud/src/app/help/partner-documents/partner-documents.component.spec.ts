import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDocumentsComponent } from './partner-documents.component';

describe('PartnerDocumentsComponent', () => {
  let component: PartnerDocumentsComponent;
  let fixture: ComponentFixture<PartnerDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
