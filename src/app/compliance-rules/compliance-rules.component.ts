import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { async, forkJoin } from "rxjs";
import {
  ComplianceRuleParameterService,
  ComplianceRulesService, EntityModelComplianceRuleEntity, EntityModelComplianceRuleParameterEntity
} from "iacmf-client";
import { MatDialog } from "@angular/material/dialog";
import {
  ConfigureComplianceRuleComponent
} from "../compliance-rule-configuration/configure-compliance-rule/configure-compliance-rule.component";
import { CreateComplianceRuleComponent } from "./create-compliance-rule/create-compliance-rule.component";
import { Utils } from "../utils/utils";
import {
  CollectionModelComplianceRuleParameterEntity
} from 'iacmf-client/model/collectionModelComplianceRuleParameterEntity';

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
  complianceRuleParameters: EntityModelComplianceRuleParameterEntity[][] = [];

  constructor(private dialog: MatDialog, private complianceRulesService: ComplianceRulesService, public utils: Utils) {

  }

  updateComplianceRulesList() {
    this.complianceRules = [];
    this.complianceRulesService.getCollectionResourceComplianceruleentityGet1().subscribe(resp => {
      let requests: any[] = [];
      resp._embedded?.complianceRuleEntities?.filter(e => !e.isDeleted).forEach(compRule => {
        this.complianceRules.push(compRule);
        requests.push(this.complianceRulesService.followPropertyReferenceComplianceruleentityGet1(String(this.utils.getId(compRule))));
      });

      if (requests.length > 0) {
        forkJoin(requests).subscribe(parameterGroups => {
          parameterGroups.forEach((collection: CollectionModelComplianceRuleParameterEntity) => {
            let parameters = collection._embedded?.complianceRuleParameterEntities;

            if (parameters === undefined) {
              parameters = [];
            }

            this.complianceRuleParameters.push(parameters);
          });
        });
      }
    });
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

    dialogRef.afterClosed().subscribe(() => {
      this.updateComplianceRulesList();
    });
  }

}
