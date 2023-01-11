import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ComplianceIssuesComponent} from './compliance-issues.component';

describe('RefinementPluginsComponent', () => {
  let component: ComplianceIssuesComponent;
  let fixture: ComponentFixture<ComplianceIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceIssuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
