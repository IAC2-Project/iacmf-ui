import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
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

  checkingPluginConfiguration: EntityModelPluginUsageEntity | undefined;

  complianceRuleParameters: EntityModelComplianceRuleParameterEntity[] = []
  complianceRuleParameterAssignments: EntityModelComplianceRuleParameterAssignmentEntity[] = []
  @Output("createdComplianceRuleConfiguration") complianceRuleConfigurationEmitter = new EventEmitter();

  issueType: string = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: EntityModelComplianceRuleConfigurationEntity,
              public testData : TestData,
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
    this.complianceRulesConfigurationService.followPropertyReferenceComplianceruleconfigurationentityGet21(String(this.utils.getId(this.data))).subscribe(comRule => {
      this.complianceRuleService.followPropertyReferenceComplianceruleentityGet1(String(this.utils.getId(comRule))).subscribe(resp => {
        resp._embedded?.complianceRuleParameterEntities?.forEach(param => {
          this.complianceRuleParameters.push(param)
        })
      })
    })

  }


  findComplianceRuleParameter(assignmentName: string | undefined) {
    if (assignmentName == undefined) {
      throw new Error("AssigmentName must be defined")
    }
    return this.complianceRuleParameters.filter(param => param.name.includes(assignmentName))[0]
  }

  emitComplianceRuleConfiguration( conf : EntityModelComplianceRuleConfigurationEntity) {
    this.complianceRuleConfigurationEmitter.emit(conf);
  }

  storeComplianceRuleConfiguration() {
      this.complianceRuleParameterAssignments.forEach(ass => {
        this.complianceRuleParameterAssigmentService.postCollectionResourceComplianceruleparameterassignmententityPost({
          id: -1,
          name: ass.name,
          type: ass.type,
          value: ass.value,
          complianceRuleConfiguration: this.utils.getLink("self", this.data),
          parameter: this.utils.getLink("self", this.findComplianceRuleParameter(ass.name))
        }).subscribe(assResp => {
          let body = {
            _links: {
              "complianceRuleConfiguration": {
                href: this.utils.getLink("self", this.data)
              }
            }
          }
          this.complianceRuleParameterAssigmentService.createPropertyReferenceComplianceruleparameterassignmententityPut(String(this.utils.getId(assResp)), body).subscribe(resp2 => {
            this.emitComplianceRuleConfiguration(this.data);
          })
        })
      })

  }
}
