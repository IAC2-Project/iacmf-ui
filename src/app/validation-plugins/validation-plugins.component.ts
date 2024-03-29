import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {
  ConfigureComplianceRuleComponent
} from "../compliance-rule-configuration/configure-compliance-rule/configure-compliance-rule.component";
import {ConfigureValidationPluginComponent} from "./configure-validation-plugin/configure-validation-plugin.component";
import {MatDialog} from "@angular/material/dialog";
import {PluginPojo} from "iacmf-client";

@Component({
  selector: 'app-validation-plugins',
  templateUrl: './validation-plugins.component.html',
  styleUrls: ['./validation-plugins.component.css']
})
export class ValidationPluginsComponent implements OnInit {


  ngOnInit(): void {
  }

  addedValidationPlugins: PluginPojo[] = [];
  // TODO this must be replaced by a proper representation of validationplugins and their inputs


  allValidationPlugins: PluginPojo[] = [{
    identifier: "NOOP",
    pluginType: "VALIDATION",
    configurationEntryNames: []
  }];

  selected = this.allValidationPlugins[0].identifier;

  constructor(public dialog: MatDialog) {

  }

  private _filter(value: string | undefined): PluginPojo[] {
    if (value == undefined) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.allValidationPlugins.filter(validationPlugin => validationPlugin.identifier != undefined && validationPlugin.identifier.toLowerCase().includes(filterValue));
  }

  addValidationPlugin(validationPlugin: string | undefined) {
    this.addedValidationPlugins.push(this._filter(validationPlugin)[0]);
  }

  removeValidationPlugin(validationPlugin: PluginPojo) {
    const index = this.addedValidationPlugins.indexOf(validationPlugin);

    if (index >= 0) {
      this.addedValidationPlugins.splice(index, 1);
    }
  }

}
