import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ComplianceRuleParameterAssignmentService,
  ComplianceRulesService,
  EntityModelComplianceRuleEntity
} from "iacmf-client/index";
import { MatDialog } from "@angular/material/dialog";
import { Utils } from "../utils/utils";
import { ConfigureComplianceRuleComponent } from "./configure-compliance-rule/configure-compliance-rule.component";
import {
  CreateComplianceRuleComponent
} from "../compliance-rules/create-compliance-rule/create-compliance-rule.component";
import {
  ComplianceRuleConfigurationService,
  ComplianceRuleParameterEntity,
  EntityModelComplianceRuleConfigurationEntity, EntityModelComplianceRuleParameterAssignmentEntity,
  EntityModelComplianceRuleParameterEntity
} from "iacmf-client";
import { forkJoin, interval } from "rxjs";

@Component({
  selector: 'app-compliance-rule-configuration',
  templateUrl: './compliance-rule-configuration.component.html',
  styleUrls: ['./compliance-rule-configuration.component.css']
})
export class ComplianceRuleConfigurationComponent implements OnInit {

  ngOnInit(): void {
    this.complianceRulesService.getCollectionResourceComplianceruleentityGet1().subscribe(resp =>
      resp._embedded?.complianceRuleEntities?.forEach(compRule => {
        this.complianceRules.push(compRule);
      }));
    this.complianceRuleConfigurationService.getCollectionResourceComplianceruleconfigurationentityGet1().subscribe(resp => {
      resp._embedded?.complianceRuleConfigurationEntities?.forEach(compConf => {
        this.complianceRuleConfigurations.push(compConf);
      });
    });
  }

  addedComplianceRuleConfigurations = new Map<string, EntityModelComplianceRuleConfigurationEntity>();
  complianceRules: EntityModelComplianceRuleEntity[] = [];
  complianceRuleConfigurations: EntityModelComplianceRuleConfigurationEntity[] = [];

  selectedRule = undefined

  @Output("selectedComplianceRuleConfigurations") selectedComplianceRuleConfigurations = new EventEmitter();

  constructor(public dialog: MatDialog, public complianceRulesConfigurationService: ComplianceRuleConfigurationService,
              public complianceRuleParameterAssigmentService: ComplianceRuleParameterAssignmentService, public complianceRulesService: ComplianceRulesService, public complianceRuleConfigurationService: ComplianceRuleConfigurationService, public utils: Utils) {

  }

  createComplianceRuleConfiguration(complianceRule: number | undefined) {
    let rule = this._filter(complianceRule)[0];

    // create a cr configuration
    this.complianceRuleConfigurationService.postCollectionResourceComplianceruleconfigurationentityPost({
      complianceRule: this.utils.getLink("self", rule),
      id: -1,
      issueType: ''
    }).subscribe(resp => {
      // retrieve the parameters of the original rule
      this.complianceRulesService.followPropertyReferenceComplianceruleentityGet1(String(this.utils.getId(rule))).subscribe(params => {
        // for each parameter create and add a parameter assignment entity
        let createAssignmentRequests = params._embedded?.complianceRuleParameterEntities?.map(param => {
          let body = {
            id: -1,
            name: param.name,
            type: param.type,
            value: "",
            complianceRuleConfiguration: this.utils.getLink("self", resp),
            parameter: this.utils.getLink("self", (param as EntityModelComplianceRuleParameterEntity))
          };
          return this.complianceRuleParameterAssigmentService.postCollectionResourceComplianceruleparameterassignmententityPost(body);
        });

        if (createAssignmentRequests && createAssignmentRequests.length > 0) {
          forkJoin(createAssignmentRequests).subscribe(() => {
            this.addedComplianceRuleConfigurations.set(rule.name, resp);
            this.emitSelectedComplianceRules();
          });
        } else {
          this.addedComplianceRuleConfigurations.set(rule.name, resp);
          this.emitSelectedComplianceRules();
        }
      });
    });
  }

  removeComplianceRuleConfiguration(ruleOfConfiguration: string, complianceRuleConfiguration: EntityModelComplianceRuleConfigurationEntity) {
    if (ruleOfConfiguration != undefined) {
      // first we remove associated parameter assignments, then the configuration entity.
      this.complianceRuleConfigurationService.followPropertyReferenceComplianceruleconfigurationentityGet31(String(this.utils.getId(complianceRuleConfiguration))).subscribe(result => {
        console.log("%d assignments where detected!", result._embedded?.complianceRuleParameterAssignmentEntities?.length);
        let requests = result._embedded?.complianceRuleParameterAssignmentEntities
          ?.map(assignment => (assignment as EntityModelComplianceRuleParameterAssignmentEntity))
          .map(assignment => this.complianceRuleParameterAssigmentService.deleteItemResourceComplianceruleparameterassignmententityDelete(String(this.utils.getId(assignment))));

        if (requests && requests.length > 0) {
          forkJoin(requests).subscribe(() => {
            this.complianceRuleConfigurationService.deleteItemResourceComplianceruleconfigurationentityDelete(String(this.utils.getId(complianceRuleConfiguration)))
              .subscribe(() => {
                this.addedComplianceRuleConfigurations.delete(ruleOfConfiguration);
                // don't forget to inform the parent dialog
                this.emitSelectedComplianceRules();
              });
          });
        } else {
          this.complianceRuleConfigurationService.deleteItemResourceComplianceruleconfigurationentityDelete(String(this.utils.getId(complianceRuleConfiguration)))
            .subscribe(() => {
              this.addedComplianceRuleConfigurations.delete(ruleOfConfiguration);
              // don't forget to inform the parent dialog
              this.emitSelectedComplianceRules();
            });
        }

      });
    }
  }

  getRuleByName(ruleName: string) {
    return this.complianceRules.filter(r => r.name === ruleName)[0];
  }

  private _filter(value: number | undefined): EntityModelComplianceRuleEntity[] {
    return this.complianceRules.filter(complianceRule => this.utils.getId(complianceRule) != undefined).filter(complianceRule => Number(this.utils.getId(complianceRule)) == value);
  }

  openConfigureComplianceRuleDialog(complianceRuleConfigurationEntity: EntityModelComplianceRuleConfigurationEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ConfigureComplianceRuleComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: complianceRuleConfigurationEntity,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshSelectedList();
    });
  }

  refreshSelectedList() {
    if (this.addedComplianceRuleConfigurations.size > 0) {
      let updatedComplianceRuleConfs = new Map<string, EntityModelComplianceRuleConfigurationEntity>()
      let requests = new Map<string, any>;
      let ruleNames = Array.from(this.addedComplianceRuleConfigurations.keys());

      for (let key of ruleNames) {
        let conf = this.addedComplianceRuleConfigurations.get(key);
        if (conf) {
          requests.set(key, this.complianceRulesConfigurationService.getItemResourceComplianceruleconfigurationentityGet(String(this.utils.getId(conf))));
        }
      }

      forkJoin(Array.from(requests.values())).subscribe(newConfs => {
        for (let i = 0; i < newConfs.length; i++) {
          updatedComplianceRuleConfs.set(ruleNames[i], newConfs[i]);
        }
        this.addedComplianceRuleConfigurations = updatedComplianceRuleConfs;
        this.emitSelectedComplianceRules();
      });
    } else {
      this.emitSelectedComplianceRules();
    }
  }

  emitSelectedComplianceRules() {
    this.selectedComplianceRuleConfigurations.emit(this.addedComplianceRuleConfigurations);
  }
}
