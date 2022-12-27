import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {KVEntity} from "../gen";
import {ConfigureValidationPluginComponent} from "../validation-plugins/configure-validation-plugin/configure-validation-plugin.component";
import {ConfigureReportingPluginComponent} from "./configure-reporting-plugin/configure-reporting-plugin.component";
import {MatDialog} from "@angular/material/dialog";

export interface reportingPluginDummy {
  id: string;
  parameters: KVEntity[];
}

@Component({
  selector: 'app-reporting-plugins',
  templateUrl: './reporting-plugins.component.html',
  styleUrls: ['./reporting-plugins.component.css']
})
export class ReportingPluginsComponent implements OnInit {


  ngOnInit(): void {
  }

  addedReportingPlugins: reportingPluginDummy[] = [];
  // TODO this must be replaced by a proper representation of reportingplugins and their inputs


  reportingPluginDummies: reportingPluginDummy[] = [{
    id : "RefinmentPlugin1",
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
      id : "RefinmentPlugin1",
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

  selected = this.reportingPluginDummies[0].id;

  constructor(public dialog: MatDialog) {

  }

  private _filter(value: string): reportingPluginDummy[] {
    const filterValue = value.toLowerCase();

    return this.reportingPluginDummies.filter(reportingPlugin => reportingPlugin.id.toLowerCase().includes(filterValue));
  }

  addReportingPlugin(reportingPlugin: string) {
    this.addedReportingPlugins.push(this._filter(reportingPlugin)[0]);
  }

  removeReportingPlugin(reportingPlugin: reportingPluginDummy) {
    const index = this.addedReportingPlugins.indexOf(reportingPlugin);

    if (index >= 0) {
      this.addedReportingPlugins.splice(index, 1);
    }
  }

  openConfigureReportingPlugin(reportingPlugin: reportingPluginDummy, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureReportingPluginComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: reportingPlugin,
    });
  }
}
