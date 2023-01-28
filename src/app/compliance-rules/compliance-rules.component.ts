import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {async} from "rxjs";
import {ComplianceRulesService, EntityModelComplianceRuleEntity} from "iacmf-client";
import {MatDialog} from "@angular/material/dialog";
import {ConfigureComplianceRuleComponent} from "./configure-compliance-rule/configure-compliance-rule.component";
import {CreateComplianceRuleComponent} from "./create-compliance-rule/create-compliance-rule.component";
import {Utils} from "../utils/utils";

@Component({
  selector: 'app-compliance-rules',
  templateUrl: './compliance-rules.component.html',
  styleUrls: ['./compliance-rules.component.css']
})
export class ComplianceRulesComponent implements OnInit {


  ngOnInit(): void {
  }

  addedComplianceRules: EntityModelComplianceRuleEntity[] = [];

  // TODO here we need to load the actual data from the API
  complianceRules: EntityModelComplianceRuleEntity[] = [];

  selected = undefined;

  @Input("allowCreate") allowCreate: boolean = false;
  @Input("allowSelection") allowSelection: boolean = false;
  @Input("showAllRules") showAllRules: boolean = false;

  @Output("selectedComplianceRules") selectedComplianceRules = new EventEmitter();

  constructor(public dialog: MatDialog, public complianceRulesService : ComplianceRulesService, public utils: Utils) {
    this.complianceRulesService.getCollectionResourceComplianceruleentityGet1().subscribe(resp =>
    resp._embedded?.complianceRuleEntities?.forEach(compRule => {
      this.complianceRules.push(compRule)
    }))
  }

  updateComplianceRulesList() {
    this.complianceRules = []
    this.complianceRulesService.getCollectionResourceComplianceruleentityGet1().subscribe(resp =>
      resp._embedded?.complianceRuleEntities?.forEach(compRule => {
        this.complianceRules.push(compRule)
      }))
  }

  addComplianceRule(complianceRule: number | undefined) {
    this.addedComplianceRules.push(this._filter(complianceRule)[0]);
  }

  deleteComplianceRule(complianceRule: EntityModelComplianceRuleEntity) {
    /// TODO THIS SHOULD DELETE THE RULE IN THE DATABASE

  }

  removeComplianceRule(complianceRule: EntityModelComplianceRuleEntity) {
    const index = this.addedComplianceRules.indexOf(complianceRule);

    if (index >= 0) {
      this.addedComplianceRules.splice(index, 1);
    }
  }

  private _filter(value: number | undefined): EntityModelComplianceRuleEntity[] {
    return this.complianceRules.filter(complianceRule => this.utils.getId(complianceRule) != undefined).filter(complianceRule => Number(this.utils.getId(complianceRule)) == value);
  }

  openConfigureComplianceRuleDialog(complianceRuleEntity: EntityModelComplianceRuleEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureComplianceRuleComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: complianceRuleEntity,
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
      this.updateComplianceRulesList()
    });
  }

  emitSelectedComplianceRules() {
    this.selectedComplianceRules.emit(this.addedComplianceRules);
  }

}
