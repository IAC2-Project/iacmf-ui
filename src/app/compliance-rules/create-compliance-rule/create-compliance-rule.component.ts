import { Component, OnInit } from '@angular/core';
import {ComplianceRulesService} from "../../gen";
import {KVEntity} from "iacmf-api";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-compliance-rule',
  templateUrl: './create-compliance-rule.component.html',
  styleUrls: ['./create-compliance-rule.component.css']
})
export class CreateComplianceRuleComponent implements OnInit {

  location = "";
  description = "";
  properties = new Array<KVEntity>;
  newPropName = "";

  constructor(public dialogRef: MatDialogRef<CreateComplianceRuleComponent>, public complianceRuleService : ComplianceRulesService) {

  }

  ngOnInit(): void {
  }

  createNewProperty() {
    this.properties.push({
      key: this.newPropName
    })
  }

  closeDialog(){
    this.dialogRef.close({event:'Closed', data: {
        location: this.location,
        isDeleted: false,
        description: this.description,
        properties: this.properties,
      }});
  }
}
