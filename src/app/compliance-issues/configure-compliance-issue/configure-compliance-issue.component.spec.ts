import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureComlianceIssueComponent } from './configure-compliance-issue.component';

describe('ConfigureRefinementPluginComponent', () => {
  let component: ConfigureComlianceIssueComponent;
  let fixture: ComponentFixture<ConfigureComlianceIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureComlianceIssueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureComlianceIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
