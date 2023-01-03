import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {ConfigureRefinementPluginComponent} from "../refinement-plugins/configure-refinement-plugin/configure-refinement-plugin.component";
import {ComplianceRuleEntity, ComplianceRulesService, EntityModelComplianceRuleEntity} from "iacmf-api";
import {MatDialog} from "@angular/material/dialog";
import {ConfigureComplianceRuleComponent} from "./configure-compliance-rule/configure-compliance-rule.component";
import {Utils} from "../utils/utils";
import {CreateComplianceRuleComponent} from "./create-compliance-rule/create-compliance-rule.component";

@Component({
  selector: 'app-compliance-rules',
  templateUrl: './compliance-rules.component.html',
  styleUrls: ['./compliance-rules.component.css']
})
export class ComplianceRulesComponent implements OnInit {


  ngOnInit(): void {
  }

  addedComplianceRules: ComplianceRuleEntity[] = [];

  // TODO here we need to load the actual data from the API
  complianceRules: ComplianceRuleEntity[] = [];

  selected = undefined;

  @Input("allowCreate") allowCreate: boolean = false;
  @Input("allowSelection") allowSelection: boolean = false;
  @Input("showAllRules") showAllRules: boolean = false;

  @Output("selectedComplianceRules") selectedComplianceRules = new EventEmitter();

  constructor(public dialog: MatDialog, public complianceRulesService : ComplianceRulesService, public utils: Utils) {
    this.complianceRulesService.getCollectionResourceComplianceruleentityGet1().subscribe(resp =>
    resp._embedded?.complianceRuleEntities?.forEach(compRule => {
      this.complianceRules.push(this.utils.toComplianceRuleEntity(compRule))
    }))
  }



  addComplianceRule(complianceRule: number | undefined) {
    this.addedComplianceRules.push(this._filter(complianceRule)[0]);
  }

  deleteComplianceRule(complianceRule: ComplianceRuleEntity) {
    /// TODO THIS SHOULD DELETE THE RULE IN THE DATABASE

  }

  removeComplianceRule(complianceRule: ComplianceRuleEntity) {
    const index = this.addedComplianceRules.indexOf(complianceRule);

    if (index >= 0) {
      this.addedComplianceRules.splice(index, 1);
    }
  }

  private _filter(value: number | undefined): ComplianceRuleEntity[] {
    return this.complianceRules.filter(complianceRule => complianceRule.id != undefined).filter(complianceRule => complianceRule.id == value);
  }

  openConfigureComplianceRuleDialog(complianceRuleEntity: ComplianceRuleEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
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
        this.complianceRulesService.postCollectionResourceComplianceruleentityPost({
          isDeleted: false,
          location: result.data.location,
          description: result.data.description,
          type: result.data.type,
        }).subscribe(resp => {
          this.complianceRules.push(this.utils.toComplianceRuleEntity(resp))
        })
    });
  }

  toComplianceRuleEntity(complianceRule : EntityModelComplianceRuleEntity) : ComplianceRuleEntity {
    return {
      type: complianceRule.type,
      isDeleted: complianceRule.isDeleted,
      description: complianceRule.description,
      location: complianceRule.location,
      id: Number(this.utils.getLinkComplianceRule(complianceRule).split("/").slice(-1)[0]),
    }
  }
  emitSelectedComplianceRules() {
    this.selectedComplianceRules.emit(this.addedComplianceRules);
  }

}
