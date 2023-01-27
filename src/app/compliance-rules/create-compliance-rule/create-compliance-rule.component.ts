import { Component, OnInit } from '@angular/core';
import {
  ComplianceRuleParameterService,
  ComplianceRulesService,
  EntityModelComplianceRuleParameterEntity
} from "iacmf-client";
import {KVEntity} from "iacmf-client";
import {MatDialogRef} from "@angular/material/dialog";
import {Utils} from "../../utils/utils";
import {TestData} from "../../utils/tests/TestData";

@Component({
  selector: 'app-create-compliance-rule',
  templateUrl: './create-compliance-rule.component.html',
  styleUrls: ['./create-compliance-rule.component.css']
})
export class CreateComplianceRuleComponent implements OnInit {

  name = "";
  type = "";
  location = "";
  description = "";
  newComplianceRuleParameterName = "";
  newType:EntityModelComplianceRuleParameterEntity.TypeEnum = "STRING";

  complianceRuleParameters = new Array<EntityModelComplianceRuleParameterEntity>()

  constructor(public dialogRef: MatDialogRef<CreateComplianceRuleComponent>,
              public testData: TestData, public utils: Utils, public complianceRuleService : ComplianceRulesService, public complianceRuleParameterService : ComplianceRuleParameterService) {

  }

  fillTestData() {
    let testCompRule = this.testData.createUseCaseComplianceRules()[0];

    if (testCompRule.complianceRule?.name != undefined) {
      this.name = testCompRule.complianceRule?.name;
    }

    if (testCompRule.complianceRule?.type != undefined) {
      this.type = testCompRule.complianceRule?.type;
    }

    if (testCompRule.complianceRule?.location != undefined) {
      this.location = testCompRule.complianceRule?.location;
    }

    if (testCompRule.complianceRule?.description != undefined) {
      this.description = testCompRule.complianceRule?.description;
    }

    testCompRule.complianceRule?.parameters?.forEach(param => {
      this.complianceRuleParameters.push({
        name: param.name,
        type: param.type
      })
    })

  }

  ngOnInit(): void {
  }

  createNewProperty() {
    this.complianceRuleParameters.push({
      name: this.newComplianceRuleParameterName,
      type: this.newType
    })

  }

  closeDialog(){
    this.complianceRuleService.postCollectionResourceComplianceruleentityPost({
      id: -1,
      name: this.name,
      isDeleted: false,
      location: this.location,
      description: this.description,
      type: this.type,
    }).subscribe(resp => {
      this.complianceRuleParameters.forEach(param =>{
        this.complianceRuleParameterService.postCollectionResourceComplianceruleparameterentityPost({
          id: -1,
          name: param.name,
          type: param.type,
          complianceRule: String(this.utils.getLink("self", resp))
        }).subscribe(resp => {
          let body = {
            _links: {
              "complianceRule": {
                href: this.utils.getLink("self", resp)
              }
            }
          }
          this.complianceRuleParameterService.createPropertyReferenceComplianceruleparameterentityPut(String(this.utils.getId(param)), body)
        })
      })
      this.dialogRef.close({event:'Closed', data: {
          name: this.name,
          location: this.location,
          isDeleted: false,
          description: this.description,
          type: this.type,
          complianceRuleParameterEntities: this.complianceRuleParameters
        }});
    })
  }
}
