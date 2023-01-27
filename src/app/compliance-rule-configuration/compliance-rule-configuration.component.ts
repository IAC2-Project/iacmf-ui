import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ComplianceRulesService, EntityModelComplianceRuleEntity} from "iacmf-client/index";
import {MatDialog} from "@angular/material/dialog";
import {Utils} from "../utils/utils";
import {ConfigureComplianceRuleComponent} from "./configure-compliance-rule/configure-compliance-rule.component";
import {CreateComplianceRuleComponent} from "../compliance-rules/create-compliance-rule/create-compliance-rule.component";
import {ComplianceRuleConfigurationService, EntityModelComplianceRuleConfigurationEntity} from "iacmf-client";

@Component({
  selector: 'app-compliance-rule-configuration',
  templateUrl: './compliance-rule-configuration.component.html',
  styleUrls: ['./compliance-rule-configuration.component.css']
})
export class ComplianceRuleConfigurationComponent implements OnInit {

  ngOnInit(): void {
  }

  addedComplianceRuleConfigurations: EntityModelComplianceRuleConfigurationEntity[] = [];

  // TODO here we need to load the actual data from the API
  complianceRules: EntityModelComplianceRuleEntity[] = [];
  complianceRuleConfigurations: EntityModelComplianceRuleConfigurationEntity[] = [];

  issueType: string | undefined
  selectedRule = undefined
  selectedConfiguration = undefined

  @Output("selectedComplianceRuleConfigurations") selectedComplianceRuleConfigurations = new EventEmitter();

  constructor(public dialog: MatDialog, public complianceRulesService : ComplianceRulesService, public complianceRuleConfigurationService : ComplianceRuleConfigurationService, public utils: Utils) {
    this.complianceRulesService.getCollectionResourceComplianceruleentityGet1().subscribe(resp =>
      resp._embedded?.complianceRuleEntities?.forEach(compRule => {
        this.complianceRules.push(compRule)
      }))
    this.complianceRuleConfigurationService.getCollectionResourceComplianceruleconfigurationentityGet1().subscribe(resp => {
      resp._embedded?.complianceRuleConfigurationEntities?.forEach(compConf => {
        this.complianceRuleConfigurations.push(compConf)
      })
    })
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
      this.emitSelectedComplianceRules()
    })

  }

  addComplianceRuleConfiguration(complianceRuleConfiguration: number | undefined) {
    let rule = this._filterConfiguration(complianceRuleConfiguration)[0]

    this.addedComplianceRuleConfigurations.push(rule)
    this.emitSelectedComplianceRules();

  }

  deleteComplianceRule(complianceRule: EntityModelComplianceRuleEntity) {
    /// TODO THIS SHOULD DELETE THE RULE IN THE DATABASE

  }

  removeComplianceRuleConfiguration(complianceRule: EntityModelComplianceRuleConfigurationEntity) {
    const index = this.addedComplianceRuleConfigurations.indexOf(complianceRule);

    if (index >= 0) {
      this.addedComplianceRuleConfigurations.splice(index, 1);
    }
  }

  private _filter(value: number | undefined): EntityModelComplianceRuleEntity[] {
    return this.complianceRules.filter(complianceRule => this.utils.getId(complianceRule) != undefined).filter(complianceRule => Number(this.utils.getId(complianceRule)) == value);
  }

  private _filterConfiguration(value: number | undefined): EntityModelComplianceRuleConfigurationEntity[] {
    return this.complianceRuleConfigurations.filter(complianceRule => this.utils.getId(complianceRule) != undefined).filter(complianceRule => Number(this.utils.getId(complianceRule)) == value);
  }

  openConfigureComplianceRuleDialog(complianceRuleConfigurationEntity: EntityModelComplianceRuleConfigurationEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureComplianceRuleComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: complianceRuleConfigurationEntity,
    });
  }


  emitSelectedComplianceRules() {
    this.selectedComplianceRuleConfigurations.emit(this.addedComplianceRuleConfigurations);
  }


}
