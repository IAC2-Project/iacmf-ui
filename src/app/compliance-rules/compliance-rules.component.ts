import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { async } from "rxjs";
import { ComplianceRulesService, EntityModelComplianceRuleEntity } from "iacmf-client";
import { MatDialog } from "@angular/material/dialog";
import {
  ConfigureComplianceRuleComponent
} from "../compliance-rule-configuration/configure-compliance-rule/configure-compliance-rule.component";
import { CreateComplianceRuleComponent } from "./create-compliance-rule/create-compliance-rule.component";
import { Utils } from "../utils/utils";

@Component({
  selector: 'app-compliance-rules',
  templateUrl: './compliance-rules.component.html',
  styleUrls: ['./compliance-rules.component.css']
})
export class ComplianceRulesComponent implements OnInit {

  ngOnInit(): void {
    this.updateComplianceRulesList();
  }

  complianceRules: EntityModelComplianceRuleEntity[] = [];

  constructor(public dialog: MatDialog, public complianceRulesService: ComplianceRulesService, public utils: Utils) {

  }

  updateComplianceRulesList() {
    this.complianceRules = [];
    this.complianceRulesService.getCollectionResourceComplianceruleentityGet1().subscribe(resp =>
      resp._embedded?.complianceRuleEntities?.filter(e => !e.isDeleted).forEach(compRule => {
        this.complianceRules.push(compRule);
      }))
  }

  deleteComplianceRule(complianceRule: EntityModelComplianceRuleEntity) {
    let body = {
      id: Number(this.utils.getId(complianceRule)),
      name: complianceRule.name,
      type: complianceRule.type,
      location: complianceRule.location,
      isDeleted: true
    };
    this.complianceRulesService.patchItemResourceComplianceruleentityPatch(String(this.utils.getId(complianceRule)), body)
      .subscribe(() => {
        this.updateComplianceRulesList();
      });

  }

  openCreateComplianceRuleDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CreateComplianceRuleComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateComplianceRulesList();
    });
  }

}
