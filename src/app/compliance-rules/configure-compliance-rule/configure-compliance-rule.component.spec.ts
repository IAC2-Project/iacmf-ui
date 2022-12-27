import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureComlianceRuleComponent } from './configure-compliance-rule.component';

describe('ConfigureRefinementPluginComponent', () => {
  let component: ConfigureComlianceRuleComponent;
  let fixture: ComponentFixture<ConfigureComlianceRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureComlianceRuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureComlianceRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
