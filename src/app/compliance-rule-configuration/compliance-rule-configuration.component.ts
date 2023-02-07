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
  ComplianceRuleConfigurationEntity,
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
      resp._embedded?.complianceRuleEntities?.filter(r => !r.isDeleted).forEach(compRule => {
        this.complianceRules.push(compRule);
      }));
    this.complianceRuleConfigurationService.getCollectionResourceComplianceruleconfigurationentityGet1().subscribe(resp => {
      resp._embedded?.complianceRuleConfigurationEntities?.forEach(compConf => {
        this.complianceRuleConfigurations.push(compConf);
      });
    });
  }

  addedComplianceRuleConfigurations: EntityModelComplianceRuleConfigurationEntity[] = [];
  rulesOfAddedRuleConfigurations: EntityModelComplianceRuleEntity[] = [];
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
            this.addedComplianceRuleConfigurations.push(resp);
            this.rulesOfAddedRuleConfigurations.push(rule);
            this.emitSelectedComplianceRules();
          });
        } else {
          this.addedComplianceRuleConfigurations.push(resp);
          this.rulesOfAddedRuleConfigurations.push(rule);
          this.emitSelectedComplianceRules();
        }
      });
    });
  }

  removeComplianceRuleConfiguration(complianceRuleConfiguration: EntityModelComplianceRuleConfigurationEntity) {
    if (complianceRuleConfiguration != undefined) {
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
                let index = this.addedComplianceRuleConfigurations.indexOf(complianceRuleConfiguration);
                this.addedComplianceRuleConfigurations.splice(index, 1);
                this.rulesOfAddedRuleConfigurations.splice(index, 1);
                // don't forget to inform the parent dialog
                this.emitSelectedComplianceRules();
              });
          });
        } else {
          this.complianceRuleConfigurationService.deleteItemResourceComplianceruleconfigurationentityDelete(String(this.utils.getId(complianceRuleConfiguration)))
            .subscribe(() => {
              let index = this.addedComplianceRuleConfigurations.indexOf(complianceRuleConfiguration);
              this.addedComplianceRuleConfigurations.splice(index, 1);
              this.rulesOfAddedRuleConfigurations.splice(index, 1);
              // don't forget to inform the parent dialog
              this.emitSelectedComplianceRules();
            });
        }

      });
    }
  }

  private _filter(value: number | undefined): EntityModelComplianceRuleEntity[] {
    return this.complianceRules
      .filter(complianceRule => this.utils.getId(complianceRule) != undefined)
      .filter(complianceRule => Number(this.utils.getId(complianceRule)) == value);
  }

  openConfigureComplianceRuleDialog(complianceRuleConfigurationEntity: EntityModelComplianceRuleConfigurationEntity,
                                    complianceRule: EntityModelComplianceRuleEntity,
                                    enterAnimationDuration: string,
                                    exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ConfigureComplianceRuleComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: [complianceRule, complianceRuleConfigurationEntity],
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshSelectedList();
    });
  }

  refreshSelectedList() {
      let updatedComplianceRuleConfs: Array<ComplianceRuleConfigurationEntity> = [];
      let requests: any[] = this.addedComplianceRuleConfigurations.map(config =>
        this.complianceRulesConfigurationService.getItemResourceComplianceruleconfigurationentityGet(this.utils.getId(config)));
      console.debug(requests);

    if (requests.length > 0) {
      forkJoin(requests).subscribe(newConfs => {
        newConfs.forEach(conf => {
          updatedComplianceRuleConfs.push(conf);
        });
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
