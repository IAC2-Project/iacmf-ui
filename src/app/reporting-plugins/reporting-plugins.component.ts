import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {ConfigureValidationPluginComponent} from "../validation-plugins/configure-validation-plugin/configure-validation-plugin.component";
import {ConfigureReportingPluginComponent} from "./configure-reporting-plugin/configure-reporting-plugin.component";
import {MatDialog} from "@angular/material/dialog";
import {PluginPojo} from "iacmf-api";



@Component({
  selector: 'app-reporting-plugins',
  templateUrl: './reporting-plugins.component.html',
  styleUrls: ['./reporting-plugins.component.css']
})
export class ReportingPluginsComponent implements OnInit {


  ngOnInit(): void {
  }

  addedReportingPlugins: PluginPojo[] = [];
  // TODO this must be replaced by a proper representation of reportingplugins and their inputs


  reportingPluginDummies: PluginPojo[] = [{
    identifier: "ReportingPlugin1",
    pluginType: "REPORTING",
    requiredConfigurationEntryNames: [
      "someKey",
      "someValue",
      "someKey2"
    ]
  },
    {
      identifier: "ReportingPlugin2",
      pluginType: "REPORTING",
      requiredConfigurationEntryNames: [
        "someKey",
        "someValue",
        "someKey2"
      ]
    }];

  selected = this.reportingPluginDummies[0].identifier;

  constructor(public dialog: MatDialog) {

  }

  private _filter(value: string | undefined): PluginPojo[] {
    if (value == undefined) {
      return []
    }
    const filterValue = value.toLowerCase();

    return this.reportingPluginDummies.filter(reportingPlugin => reportingPlugin.identifier != undefined && reportingPlugin.identifier.toLowerCase().includes(filterValue));
  }

  addReportingPlugin(reportingPlugin: string | undefined) {
    this.addedReportingPlugins.push(this._filter(reportingPlugin)[0]);
  }

  removeReportingPlugin(reportingPlugin: PluginPojo) {
    const index = this.addedReportingPlugins.indexOf(reportingPlugin);

    if (index >= 0) {
      this.addedReportingPlugins.splice(index, 1);
    }
  }

  openConfigureReportingPlugin(reportingPlugin: PluginPojo, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureReportingPluginComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: reportingPlugin,
    });
  }
}
