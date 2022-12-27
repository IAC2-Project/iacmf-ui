import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {CreateCompliancejobDialogComponent} from "../compliancejobs/create-compliancejob-dialog/create-compliancejob-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfigureRefinementPluginComponent} from "./configure-refinement-plugin/configure-refinement-plugin.component";
import {KVEntity} from "iacmf-api";

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
        key: "someKey2",
        value: "someValue"
      },
      {
        key: "someKey3",
        value: "someValue"
      }
    ]
  },
    {
      id : "RefinmentPlugin2",
      parameters: [
        {
          key: "someKey",
          value: "someValue"
        },
        {
          key: "someKey5",
          value: "someValue"
        },
        {
          key: "someKey4",
          value: "someValue"
        }
      ]
    }];
  selected = this.allRefinmentPlugins2[0].id;

  constructor(public dialog: MatDialog) {

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

  addRefinementPlugin(refinementPluginDummy: string) {
    this.addedRefinementPlugins.push(this._filter(refinementPluginDummy)[0]);
  }

  deleteMatCard(refinementPluginDummy: RefinementPluginDummy) {
    const index = this.addedRefinementPlugins.indexOf(refinementPluginDummy);

    if (index >= 0) {
      this.addedRefinementPlugins.splice(index, 1);
    }
  }
}
