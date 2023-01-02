import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComplianceRuleComponent } from './create-compliance-rule.component';

describe('CreateComplianceRuleComponent', () => {
  let component: CreateComplianceRuleComponent;
  let fixture: ComponentFixture<CreateComplianceRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateComplianceRuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateComplianceRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
