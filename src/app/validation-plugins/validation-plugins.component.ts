import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {KVEntity} from "../gen";
import {ConfigureComlianceRuleComponent} from "../compliance-rules/configure-compliance-rule/configure-compliance-rule.component";
import {ConfigureValidationPluginComponent} from "./configure-validation-plugin/configure-validation-plugin.component";
import {MatDialog} from "@angular/material/dialog";

export interface ValidationPluginDummy {
  id: string;
  parameters: KVEntity[];
}

@Component({
  selector: 'app-validation-plugins',
  templateUrl: './validation-plugins.component.html',
  styleUrls: ['./validation-plugins.component.css']
})
export class ValidationPluginsComponent implements OnInit {


  ngOnInit(): void {
  }

  addedValidationPlugins: ValidationPluginDummy[] = [];
  // TODO this must be replaced by a proper representation of validationplugins and their inputs


  allValidationPlugins: ValidationPluginDummy[] = [{
    id : "ValidationPlugin1",
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
      id : "ValidationPlugin2",
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

  selected = this.allValidationPlugins[0].id;

  constructor(public dialog: MatDialog) {

  }

  private _filter(value: string): ValidationPluginDummy[] {
    const filterValue = value.toLowerCase();

    return this.allValidationPlugins.filter(validationPlugin => validationPlugin.id.toLowerCase().includes(filterValue));
  }

  addValidationPlugin(validationPluginDummy: string) {
    this.addedValidationPlugins.push(this._filter(validationPluginDummy)[0]);
  }

  removeValidationPlugin(validationPluginDummy: ValidationPluginDummy) {
    const index = this.addedValidationPlugins.indexOf(validationPluginDummy);

    if (index >= 0) {
      this.addedValidationPlugins.splice(index, 1);
    }
  }

  openConfigureValidationPlugin(complianceRuleEntity: ValidationPluginDummy, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureValidationPluginComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: complianceRuleEntity,
    });
  }

}
