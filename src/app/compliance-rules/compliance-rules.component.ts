import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {KVEntity} from "../gen";
import {ConfigureRefinementPluginComponent} from "../refinement-plugins/configure-refinement-plugin/configure-refinement-plugin.component";
import {ComplianceRuleEntity} from "iacmf-api";
import {MatDialog} from "@angular/material/dialog";
import {ConfigureComlianceRuleComponent} from "./configure-compliance-rule/configure-compliance-rule.component";

@Component({
  selector: 'app-compliance-rules',
  templateUrl: './compliance-rules.component.html',
  styleUrls: ['./compliance-rules.component.css']
})
export class ComplianceRulesComponent implements OnInit {


  ngOnInit(): void {
  }

  addedcomplianceRulesPlugins: ComplianceRuleEntity[] = [];

  // TODO here we need to load the actual data from the API
  complianceRules: ComplianceRuleEntity[] = this.getDummyComplianceRulesData();

  selected = this.complianceRules[0].id;

  constructor(public dialog: MatDialog) {

  }

  addComplianceRule(complianceRule: number) {
    this.addedcomplianceRulesPlugins.push(this._filter(complianceRule)[0]);
  }

  removeComplianceRule(complianceRule: ComplianceRuleEntity) {
    const index = this.addedcomplianceRulesPlugins.indexOf(complianceRule);

    if (index >= 0) {
      this.addedcomplianceRulesPlugins.splice(index, 1);
    }
  }

  private _filter(value: number): ComplianceRuleEntity[] {
    return this.complianceRules.filter(complianceRule => complianceRule.id != undefined).filter(complianceRule => complianceRule.id == value);
  }

  openConfigureComplianceRuleDialog(complianceRuleEntity: ComplianceRuleEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureComlianceRuleComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: complianceRuleEntity,
    });
  }

  getDummyComplianceRulesData() : ComplianceRuleEntity[] {
    return [{
      id : 1,
      type : "someType",
      location : "somewhere",
      isDeleted : false,
      parameters: [
        {
          name: "someKey",
          type: "INT"
        },
        {
          name: "someKey",
          type: "DECIMAL"
        },
        {
          name: "someKey",
          type: "STRING"
        }
      ]
    },
      {
        id : 2,
        type : "someType",
        location : "somewhere",
        isDeleted : false,
        parameters: [
          {
            name: "someKey",
            type: "STRING_LIST"
          },
          {
            name: "someKey",
            type: "BOOLEAN"
          },
          {
            name: "someKey",
            type: "INT"
          }
        ]
      }];
  }

}
