import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  ComplianceIssueEntity, ComplianceRuleConfigurationService,
  ComplianceRuleEntity, ComplianceRuleParameterAssignmentService,
  ComplianceRuleParameterService,
  ComplianceRulesService, EntityModelComplianceRuleConfigurationEntity,
  EntityModelComplianceRuleEntity,
  EntityModelComplianceRuleParameterAssignmentEntity,
  EntityModelComplianceRuleParameterEntity, EntityModelPluginConfigurationEntity, EntityModelPluginUsageEntity,
  PluginPojo,
  PluginService
} from "iacmf-client";
import {Utils} from "../../utils/utils";
import {TestData} from "../../utils/tests/TestData";


@Component({
  selector: 'app-compliance-rule-plugin',
  templateUrl: './configure-compliance-rule.component.html',
  styleUrls: ['./configure-compliance-rule.component.css']
})
export class ConfigureComplianceRuleComponent implements OnInit {

  complianceRuleParameterAssignments: EntityModelComplianceRuleParameterAssignmentEntity[] = []
  issueType: string = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: EntityModelComplianceRuleConfigurationEntity,
              public dialogRef: MatDialogRef<ConfigureComplianceRuleComponent>,
              public testData: TestData,
              public complianceRulesConfigurationService: ComplianceRuleConfigurationService,
              public complianceRuleParameterAssigmentService: ComplianceRuleParameterAssignmentService, public utils: Utils, public dialog: MatDialog, public complianceRuleService: ComplianceRulesService, public pluginService: PluginService) {

  }

  selected = undefined;

  fillInTestData() {
    let complianceRule = this.testData.createUseCaseComplianceRules()[0];
    complianceRule.complianceRuleParameterAssignments?.forEach(paramAssignment => {
      this.complianceRuleParameterAssignments.filter(param => {
        if (paramAssignment.name != undefined) {
          return param.name?.includes(paramAssignment.name)
        } else {
          return false
        }
      }).forEach(param => {
        param.value = paramAssignment.value
      })
    })

  }

  ngOnInit(): void {
    this.complianceRulesConfigurationService.followPropertyReferenceComplianceruleconfigurationentityGet31(String(this.utils.getId(this.data))).subscribe(assigns => {
      assigns._embedded?.complianceRuleParameterAssignmentEntities?.forEach(assign => {
        this.complianceRuleParameterAssignments.push(assign)
      })
    })
    this.issueType = this.data.issueType
  }

  storeComplianceRuleConfiguration() {

    this.complianceRulesConfigurationService.putItemResourceComplianceruleconfigurationentityPut(String(this.utils.getId(this.data)), {
      id: Number(this.utils.getId(this.data)),
      issueType: this.issueType
    }).subscribe(resp => {
      this.complianceRuleParameterAssignments.forEach(paramAssignment => {
        let req = {
          id: Number(this.utils.getId(paramAssignment)),
          value: paramAssignment.value,
          type: paramAssignment.type,
          complianceRuleConfiguration: this.utils.getLink("self", this.data),
          name: paramAssignment.name,
          parameter: this.utils.getLink("complianceRuleParameterAssignmentEntity", paramAssignment)
        }
        this.complianceRuleParameterAssigmentService.putItemResourceComplianceruleparameterassignmententityPut(String(this.utils.getId(paramAssignment)), req).subscribe(resp => {
          console.log(resp)
        })
      })
      this.dialogRef.close({event:'Closed', data: this.data});
    })
  }
}
