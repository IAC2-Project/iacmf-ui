import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompliancejobsComponent } from './compliancejobs.component';

describe('CompliancejobsComponent', () => {
  let component: CompliancejobsComponent;
  let fixture: ComponentFixture<CompliancejobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompliancejobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompliancejobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
