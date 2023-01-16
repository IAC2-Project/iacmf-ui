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

  constructor(@Inject(MAT_DIALOG_DATA) public data: EntityModelComplianceRuleEntity,
              public complianceRulesConfigurationService: ComplianceRuleConfigurationService,
              public complianceRuleParameterAssigmentService: ComplianceRuleParameterAssignmentService, public utils: Utils, public dialog: MatDialog, public complianceRuleService: ComplianceRulesService, public pluginService: PluginService) {

  }

  selected = undefined;

  ngOnInit(): void {
    this.complianceRuleService.followPropertyReferenceComplianceruleentityGet1(String(this.utils.getId(this.data))).subscribe(resp => {
      resp._embedded?.complianceRuleParameterEntities?.forEach(param => {
        this.complianceRuleParameters.push(param)
        this.complianceRuleParameterAssignments.push({
          name: param.name,
          type: param.type,
          value: ""
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
    this.complianceRulesConfigurationService.postCollectionResourceComplianceruleconfigurationentityPost({
      id: -1,
      issueType: this.data.type,
      complianceRule: this.utils.getLink("self", this.data),
    }).subscribe(resp => {
      this.complianceRuleParameterAssignments.forEach(ass => {
        this.complianceRuleParameterAssigmentService.postCollectionResourceComplianceruleparameterassignmententityPost({
          id: -1,
          name: ass.name,
          type: ass.type,
          value: ass.value,
          complianceRuleConfiguration: this.utils.getLink("self", resp),
          parameter: this.utils.getLink("self", this.findComplianceRuleParameter(ass.name))
        }).subscribe(assResp => {
          let body = {
            _links: {
              "complianceRuleConfiguration": {
                href: this.utils.getLink("self", resp)
              }
            }
          }
          this.complianceRuleParameterAssigmentService.createPropertyReferenceComplianceruleparameterassignmententityPut(String(this.utils.getId(assResp)), body).subscribe(resp2 => {
            this.emitComplianceRuleConfiguration(resp);
          })
        })
      })
    })
  }
}
