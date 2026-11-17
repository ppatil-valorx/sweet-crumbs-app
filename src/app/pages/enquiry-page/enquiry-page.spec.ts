import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnquiryPage } from './enquiry-page';

describe('EnquiryPage', () => {
  let component: EnquiryPage;
  let fixture: ComponentFixture<EnquiryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
