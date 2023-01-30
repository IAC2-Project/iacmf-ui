import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  ComplianceRuleParameterAssignmentService,
  ComplianceRulesService,
  EntityModelComplianceRuleEntity
} from "iacmf-client/index";
import {MatDialog} from "@angular/material/dialog";
import {Utils} from "../utils/utils";
import {ConfigureComplianceRuleComponent} from "./configure-compliance-rule/configure-compliance-rule.component";
import {CreateComplianceRuleComponent} from "../compliance-rules/create-compliance-rule/create-compliance-rule.component";
import {
  ComplianceRuleConfigurationService,
  ComplianceRuleParameterEntity,
  EntityModelComplianceRuleConfigurationEntity, EntityModelComplianceRuleParameterEntity
} from "iacmf-client";
import {interval} from "rxjs";

@Component({
  selector: 'app-compliance-rule-configuration',
  templateUrl: './compliance-rule-configuration.component.html',
  styleUrls: ['./compliance-rule-configuration.component.css']
})
export class ComplianceRuleConfigurationComponent implements OnInit {

  POLLING_INTERVAL_MILLIS = 15000;

  ngOnInit(): void {
    this.complianceRulesService.getCollectionResourceComplianceruleentityGet1().subscribe(resp =>
      resp._embedded?.complianceRuleEntities?.forEach(compRule => {
        this.complianceRules.push(compRule)
      }))
    this.complianceRuleConfigurationService.getCollectionResourceComplianceruleconfigurationentityGet1().subscribe(resp => {
      resp._embedded?.complianceRuleConfigurationEntities?.forEach(compConf => {
        this.complianceRuleConfigurations.push(compConf)
      })
    })

    // somehow the list doesn't properly update the issue type in the mat card element, I have no idea why, but this helps...
    interval(this.POLLING_INTERVAL_MILLIS).subscribe(() => {
      this.refreshSelectedList()
    })
  }

  addedComplianceRuleConfigurations: EntityModelComplianceRuleConfigurationEntity[] = [];

  // TODO here we need to load the actual data from the API
  complianceRules: EntityModelComplianceRuleEntity[] = [];
  complianceRuleConfigurations: EntityModelComplianceRuleConfigurationEntity[] = [];

  issueType: string | undefined
  selectedRule = undefined

  @Output("selectedComplianceRuleConfigurations") selectedComplianceRuleConfigurations = new EventEmitter();

  constructor(public dialog: MatDialog, public complianceRulesConfigurationService: ComplianceRuleConfigurationService,
              public complianceRuleParameterAssigmentService: ComplianceRuleParameterAssignmentService, public complianceRulesService: ComplianceRulesService, public complianceRuleConfigurationService: ComplianceRuleConfigurationService, public utils: Utils) {

  }

  createComplianceRuleConfiguration(complianceRule: number | undefined) {
    let rule = this._filter(complianceRule)[0]

    if (this.issueType == undefined) {
      throw new Error("Please give an issueType")
    }

    this.complianceRuleConfigurationService.postCollectionResourceComplianceruleconfigurationentityPost({
      complianceRule: this.utils.getLink("self", rule),
      id: -1,
      issueType: this.issueType
    }).subscribe(resp => {
      this.addedComplianceRuleConfigurations.push(resp)
      this.complianceRulesService.followPropertyReferenceComplianceruleentityGet1(String(this.utils.getId(rule))).subscribe(params => {
        params._embedded?.complianceRuleParameterEntities?.forEach(param => {
          this.complianceRulesService.followPropertyReferenceComplianceruleentityGet1(String(this.utils.getId(rule))).subscribe(param1 => {
            this.complianceRuleParameterAssigmentService.postCollectionResourceComplianceruleparameterassignmententityPost({
              id: -1,
              name: param.name,
              type: param.type,
              value: "",
              complianceRuleConfiguration: this.utils.getLink("self", resp),
              parameter: this.utils.getLink("self", (param as EntityModelComplianceRuleParameterEntity))
            }).subscribe(assResp => {
              let body = {
                _links: {
                  "complianceRuleConfiguration": {
                    href: this.utils.getLink("self", resp)
                  }
                }
              }
              this.complianceRuleParameterAssigmentService.createPropertyReferenceComplianceruleparameterassignmententityPut(String(this.utils.getId(assResp)), body).subscribe(resp2 => {
              })
            })
          })

        })
      })
      this.emitSelectedComplianceRules()
    })

  }

  removeComplianceRuleConfiguration(complianceRule: EntityModelComplianceRuleConfigurationEntity) {
    const index = this.addedComplianceRuleConfigurations.indexOf(complianceRule);

    if (index >= 0) {
      this.addedComplianceRuleConfigurations.splice(index, 1).forEach(compConf => {
        this.complianceRuleConfigurationService.deleteItemResourceComplianceruleconfigurationentityDelete(String(this.utils.getId(compConf)))
      });
    }
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

    dialogRef.afterClosed().subscribe(result => {
      this.refreshSelectedList()
    });
  }

  refreshSelectedList() {
    let updatedComplianceRuleConfs: EntityModelComplianceRuleConfigurationEntity[] = [];
    let oldComplianceRuleConfs = this.addedComplianceRuleConfigurations;
    this.addedComplianceRuleConfigurations = []
    oldComplianceRuleConfs.forEach(conf => {
      this.complianceRulesConfigurationService.getItemResourceComplianceruleconfigurationentityGet(String(this.utils.getId(conf))).subscribe(updConf => {
        updatedComplianceRuleConfs.push(updConf)
      })
    })
    this.addedComplianceRuleConfigurations = updatedComplianceRuleConfs;
    this.emitSelectedComplianceRules();
  }

  emitSelectedComplianceRules() {
    this.selectedComplianceRuleConfigurations.emit(this.addedComplianceRuleConfigurations);
  }
}
