import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureComplianceRuleComponent } from './configure-compliance-rule.component';

describe('ConfigureRefinementPluginComponent', () => {
  let component: ConfigureComplianceRuleComponent;
  let fixture: ComponentFixture<ConfigureComplianceRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureComplianceRuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureComplianceRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
