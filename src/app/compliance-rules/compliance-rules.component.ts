import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {KVEntity} from "../gen";

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

  separatorKeysCodes: number[] = [ENTER, COMMA];
  complianceRulesCtrl = new FormControl('');
  filteredcomplianceRulesPlugins: Observable<complianceRulesPluginDummy[]>;
  addedcomplianceRulesPlugins: complianceRulesPluginDummy[] = [];
  // TODO this must be replaced by a proper representation of complianceRulesplugins and their inputs


  complianceRulesPluginDummies: complianceRulesPluginDummy[] = [{
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

  @ViewChild('complianceRulesInput') complianceRulesInput: ElementRef<HTMLInputElement> | undefined;

  constructor() {
    this.filteredcomplianceRulesPlugins = this.complianceRulesCtrl.valueChanges.pipe(
      startWith(null),
      map((complianceRulesPlugin: string | null) => (complianceRulesPlugin ? this._filter(complianceRulesPlugin) : this.complianceRulesPluginDummies.slice()))
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.addedcomplianceRulesPlugins.push(this._filter(value)[0]);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.complianceRulesCtrl.setValue(null);
  }

  remove(complianceRulesPluginDummy: complianceRulesPluginDummy): void {
    const index = this.addedcomplianceRulesPlugins.indexOf(complianceRulesPluginDummy);

    if (index >= 0) {
      this.addedcomplianceRulesPlugins.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    const plugin = this.complianceRulesPluginDummies.filter(complianceRulesPlugin => complianceRulesPlugin.id.includes(value)).pop()
    if (plugin != undefined) {
      this.addedcomplianceRulesPlugins.push(plugin);
    }

    if (this.complianceRulesInput != undefined) {
      this.complianceRulesInput.nativeElement.value = '';
    }
    this.complianceRulesCtrl.setValue(null);
  }

  private _filter(value: string): complianceRulesPluginDummy[] {
    const filterValue = value.toLowerCase();

    return this.complianceRulesPluginDummies.filter(complianceRulesPlugin => complianceRulesPlugin.id.toLowerCase().includes(filterValue));
  }

}
