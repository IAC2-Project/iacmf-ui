import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {ConfigureRefinementPluginComponent} from "../refinement-plugins/configure-refinement-plugin/configure-refinement-plugin.component";
import {ComplianceRuleEntity, ComplianceRulesService, EntityModelComplianceRuleEntity} from "iacmf-client";
import {MatDialog} from "@angular/material/dialog";
import {ConfigureComplianceRuleComponent} from "../compliance-rule-configuration/configure-compliance-rule/configure-compliance-rule.component";
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

  // TODO here we need to load the actual data from the API
  complianceRules: EntityModelComplianceRuleEntity[] = [];

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

  deleteComplianceRule(complianceRule: EntityModelComplianceRuleEntity) {
    /// TODO THIS SHOULD DELETE THE RULE IN THE DATABASE

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

}
