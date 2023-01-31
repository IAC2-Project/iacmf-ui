import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  ComplianceRuleConfigurationService,
  ComplianceRuleParameterAssignmentService,
  ComplianceRulesService,
  EntityModelComplianceRuleConfigurationEntity, EntityModelComplianceRuleEntity,
  EntityModelComplianceRuleParameterAssignmentEntity,

} from "iacmf-client";
import { Utils } from "../../utils/utils";
import { TestData } from "../../utils/tests/TestData";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-compliance-rule-plugin',
  templateUrl: './configure-compliance-rule.component.html',
  styleUrls: ['./configure-compliance-rule.component.css']
})
export class ConfigureComplianceRuleComponent implements OnInit {

  complianceRuleParameterAssignments: EntityModelComplianceRuleParameterAssignmentEntity[] = [];
  complianceRule: EntityModelComplianceRuleEntity;
  issueType: string = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: [EntityModelComplianceRuleEntity, EntityModelComplianceRuleConfigurationEntity],
              public dialogRef: MatDialogRef<ConfigureComplianceRuleComponent>,
              public testData: TestData,
              public complianceRulesConfigurationService: ComplianceRuleConfigurationService,
              public complianceRuleParameterAssigmentService: ComplianceRuleParameterAssignmentService,
              public utils: Utils,
              public dialog: MatDialog) {
    this.complianceRule = data[0];
  }

  fillInTestData() {
    let complianceRule = this.testData.createUseCaseComplianceRules()[0];
    this.issueType = complianceRule.issueType;
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
    this.complianceRulesConfigurationService.followPropertyReferenceComplianceruleconfigurationentityGet31(String(this.utils.getId(this.data[1])))
      .subscribe(assigns => {
        assigns._embedded?.complianceRuleParameterAssignmentEntities?.forEach(assign => {
          this.complianceRuleParameterAssignments.push(assign);
        })
      })
    this.issueType = this.data[1].issueType
  }

  storeComplianceRuleConfiguration() {
    this.complianceRulesConfigurationService.putItemResourceComplianceruleconfigurationentityPut(String(this.utils.getId(this.data[1])), {
      id: Number(this.utils.getId(this.data[1])),
      issueType: this.issueType
    }).subscribe(resp => {
      let requests = this.complianceRuleParameterAssignments.map(paramAssignment => {
        let req = {
          id: Number(this.utils.getId(paramAssignment)),
          value: paramAssignment.value,
          type: paramAssignment.type,
          complianceRuleConfiguration: this.utils.getLink("self", this.data[1]),
          name: paramAssignment.name,
          parameter: this.utils.getLink("complianceRuleParameterAssignmentEntity", paramAssignment)
        }
        return this.complianceRuleParameterAssigmentService.putItemResourceComplianceruleparameterassignmententityPut(String(this.utils.getId(paramAssignment)), req);
      });

      if (requests && requests.length > 0) {
        forkJoin(requests).subscribe(() => {
          this.dialogRef.close({ event: 'Closed', data: this.data });
        });
      } else {
        this.dialogRef.close({ event: 'Closed', data: this.data });
      }
    })
  }
}
