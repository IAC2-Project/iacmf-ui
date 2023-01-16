import { Component, OnInit } from '@angular/core';
import {
  ComplianceRuleParameterService,
  ComplianceRulesService,
  EntityModelComplianceRuleParameterEntity
} from "iacmf-client";
import {KVEntity} from "iacmf-client";
import {MatDialogRef} from "@angular/material/dialog";
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-create-compliance-rule',
  templateUrl: './create-compliance-rule.component.html',
  styleUrls: ['./create-compliance-rule.component.css']
})
export class CreateComplianceRuleComponent implements OnInit {

  type = "";
  location = "";
  description = "";
  newComplianceRuleParameterName = "";
  newType:EntityModelComplianceRuleParameterEntity.TypeEnum = "STRING";

  complianceRuleParameters = new Array<EntityModelComplianceRuleParameterEntity>()

  constructor(public dialogRef: MatDialogRef<CreateComplianceRuleComponent>, public utils: Utils, public complianceRuleService : ComplianceRulesService, public complianceRuleParameterService : ComplianceRuleParameterService) {

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
      name: "someName",
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
          complianceRule: this.utils.getLink("self", resp)
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

    })

    this.dialogRef.close({event:'Closed', data: {
        location: this.location,
        isDeleted: false,
        description: this.description,
        type: this.type,
        complianceRuleParameterEntities: this.complianceRuleParameters
      }});
  }
}
