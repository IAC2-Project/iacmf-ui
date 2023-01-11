import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ComplianceJobsComponent} from './compliance-jobs.component';

describe('CompliancejobsComponent', () => {
  let component: ComplianceJobsComponent;
  let fixture: ComponentFixture<ComplianceJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
