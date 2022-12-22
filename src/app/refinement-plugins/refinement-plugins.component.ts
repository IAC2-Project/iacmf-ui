import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {KVEntity} from "../gen";
import {CreateCompliancejobDialogComponent} from "../compliancejobs/create-compliancejob-dialog/create-compliancejob-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfigureRefinementPluginComponent} from "./configure-refinement-plugin/configure-refinement-plugin.component";

export interface RefinementPluginDummy {
  id: string;
  parameters: KVEntity[];
}

@Component({
  selector: 'app-refinement-plugins',
  templateUrl: './refinement-plugins.component.html',
  styleUrls: ['./refinement-plugins.component.css']
})
export class RefinementPluginsComponent implements OnInit {


  ngOnInit(): void {
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  refinementCtrl = new FormControl('');
  filteredRefinedPlugins: Observable<RefinementPluginDummy[]>;
  addedRefinementPlugins: RefinementPluginDummy[] = [];
  // TODO this must be replaced by a proper representation of refinementplugins and their inputs


  allRefinmentPlugins2: RefinementPluginDummy[] = [{
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

  @ViewChild('refinementInput') refinemntInput: ElementRef<HTMLInputElement> | undefined;

  constructor(public dialog: MatDialog) {
    this.filteredRefinedPlugins = this.refinementCtrl.valueChanges.pipe(
      startWith(null),
      map((refinementPlugin: string | null) => (refinementPlugin ? this._filter(refinementPlugin) : this.allRefinmentPlugins2.slice()))
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.addedRefinementPlugins.push(this._filter(value)[0]);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.refinementCtrl.setValue(null);
  }

  remove(refinementPluginDummy: RefinementPluginDummy): void {
    const index = this.addedRefinementPlugins.indexOf(refinementPluginDummy);

    if (index >= 0) {
      this.addedRefinementPlugins.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    const plugin = this.allRefinmentPlugins2.filter(refinementPlugin => refinementPlugin.id.includes(value)).pop()
    if (plugin != undefined) {
      this.addedRefinementPlugins.push(plugin);
    }

    if (this.refinemntInput != undefined) {
      this.refinemntInput.nativeElement.value = '';
    }
    this.refinementCtrl.setValue(null);
  }

  private _filter(value: string): RefinementPluginDummy[] {
    const filterValue = value.toLowerCase();

    return this.allRefinmentPlugins2.filter(refinementPlugin => refinementPlugin.id.toLowerCase().includes(filterValue));
  }

  openConfigureRefinementPluginDialog(refinementPlugin: RefinementPluginDummy, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureRefinementPluginComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: refinementPlugin,
    });
  }
}
