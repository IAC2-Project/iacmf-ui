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

export interface complianceRulesPluginDummy {
  id: string;
  parameters: KVEntity[];
}

@Component({
  selector: 'app-compliance-rules',
  templateUrl: './compliance-rules.component.html',
  styleUrls: ['./compliance-rules.component.css']
})
export class ComplianceRulesComponent implements OnInit {


  ngOnInit(): void {
  }

  addedcomplianceRulesPlugins: complianceRulesPluginDummy[] = [];

  // TODO this must be replaced by a proper representation of complianceRulesplugins and their inputs
  complianceRulesPluginDummies: complianceRulesPluginDummy[] = [{
    id : "ComplianceRUle1",
    parameters: [
      {
      key: "someKey",
      value: "someValue"
      },
      {
        key: "someKey",
        value: "someValue"
      },
      {
        key: "someKey",
        value: "someValue"
      }
    ]
  },
    {
      id : "ComplianceRUle1",
      parameters: [
        {
          key: "someKey",
          value: "someValue"
        },
        {
          key: "someKey",
          value: "someValue"
        },
        {
          key: "someKey",
          value: "someValue"
        }
      ]
    }];

  selected = this.complianceRulesPluginDummies[0].id;

  constructor(public dialog: MatDialog) {

  }

  addComplianceRule(complianceRuleDummy: string) {
    this.addedcomplianceRulesPlugins.push(this._filter(complianceRuleDummy)[0]);
  }

  removeComplianceRule(complianceRuleDummy: complianceRulesPluginDummy) {
    const index = this.addedcomplianceRulesPlugins.indexOf(complianceRuleDummy);

    if (index >= 0) {
      this.addedcomplianceRulesPlugins.splice(index, 1);
    }
  }

  private _filter(value: string): complianceRulesPluginDummy[] {
    const filterValue = value.toLowerCase();

    return this.complianceRulesPluginDummies.filter(complianceRulesPlugin => complianceRulesPlugin.id.toLowerCase().includes(filterValue));
  }

  openConfigureComplianceRuleDialog(complianceRuleEntity: complianceRulesPluginDummy, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureComlianceRuleComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: complianceRuleEntity,
    });
  }

}
