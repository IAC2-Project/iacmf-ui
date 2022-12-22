import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {KVEntity} from "../gen";

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

  separatorKeysCodes: number[] = [ENTER, COMMA];
  validationCtrl = new FormControl('');
  filteredValidationPlugins: Observable<ValidationPluginDummy[]>;
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

  @ViewChild('validationInput') validationInput: ElementRef<HTMLInputElement> | undefined;

  constructor() {
    this.filteredValidationPlugins = this.validationCtrl.valueChanges.pipe(
      startWith(null),
      map((validationPlugin: string | null) => (validationPlugin ? this._filter(validationPlugin) : this.allValidationPlugins.slice()))
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.addedValidationPlugins.push(this._filter(value)[0]);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.validationCtrl.setValue(null);
  }

  remove(validationPluginDummy: ValidationPluginDummy): void {
    const index = this.addedValidationPlugins.indexOf(validationPluginDummy);

    if (index >= 0) {
      this.addedValidationPlugins.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    const plugin = this.allValidationPlugins.filter(validationPlugin => validationPlugin.id.includes(value)).pop()
    if (plugin != undefined) {
      this.addedValidationPlugins.push(plugin);
    }

    if (this.validationInput != undefined) {
      this.validationInput.nativeElement.value = '';
    }
    this.validationCtrl.setValue(null);
  }

  private _filter(value: string): ValidationPluginDummy[] {
    const filterValue = value.toLowerCase();

    return this.allValidationPlugins.filter(validationPlugin => validationPlugin.id.toLowerCase().includes(filterValue));
  }

}
