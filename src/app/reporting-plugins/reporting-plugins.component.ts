import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {KVEntity} from "../gen";

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

  separatorKeysCodes: number[] = [ENTER, COMMA];
  reportingCtrl = new FormControl('');
  filteredReportingPlugins: Observable<reportingPluginDummy[]>;
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

  @ViewChild('reportingInput') reportingInput: ElementRef<HTMLInputElement> | undefined;

  constructor() {
    this.filteredReportingPlugins = this.reportingCtrl.valueChanges.pipe(
      startWith(null),
      map((reportingPlugin: string | null) => (reportingPlugin ? this._filter(reportingPlugin) : this.reportingPluginDummies.slice()))
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.addedReportingPlugins.push(this._filter(value)[0]);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.reportingCtrl.setValue(null);
  }

  remove(reportingPluginDummy: reportingPluginDummy): void {
    const index = this.addedReportingPlugins.indexOf(reportingPluginDummy);

    if (index >= 0) {
      this.addedReportingPlugins.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    const plugin = this.reportingPluginDummies.filter(reportingPlugin => reportingPlugin.id.includes(value)).pop()
    if (plugin != undefined) {
      this.addedReportingPlugins.push(plugin);
    }

    if (this.reportingInput != undefined) {
      this.reportingInput.nativeElement.value = '';
    }
    this.reportingCtrl.setValue(null);
  }

  private _filter(value: string): reportingPluginDummy[] {
    const filterValue = value.toLowerCase();

    return this.reportingPluginDummies.filter(reportingPlugin => reportingPlugin.id.toLowerCase().includes(filterValue));
  }

}
