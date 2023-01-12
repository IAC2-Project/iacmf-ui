import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {CreateCompliancejobDialogComponent} from "../compliancejobs/create-compliancejob-dialog/create-compliancejob-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfigureRefinementPluginComponent} from "./configure-refinement-plugin/configure-refinement-plugin.component";
import {KVEntity, PluginPojo} from "iacmf-api";

@Component({
  selector: 'app-refinement-plugins',
  templateUrl: './refinement-plugins.component.html',
  styleUrls: ['./refinement-plugins.component.css']
})
export class RefinementPluginsComponent implements OnInit {


  ngOnInit(): void {
  }

  addedRefinementPlugins: PluginPojo[] = [];
  // TODO this must be replaced by a proper representation of refinementplugins and their inputs


  allRefinmentPlugins2: PluginPojo[] = [{
    identifier: "RefinmentPlugin1",
    pluginType: "MODEL_REFINEMENT",
    configurationEntryNames: [
      {name:"someKey"},
      {name: "someValue"},
      {name:"someKey2"}
    ]
  },
    {
      identifier: "RefinmentPlugin2",
      pluginType: "MODEL_REFINEMENT",
      configurationEntryNames: [
        {name:"someKey"},
        {name: "someValue"},
        {name:"someKey2"}
      ]
    }];
  selected = this.allRefinmentPlugins2[0].identifier;

  constructor(public dialog: MatDialog) {

  }


  private _filter(value: string | undefined): PluginPojo[] {
    if (value == undefined) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.allRefinmentPlugins2.filter(refinementPlugin =>
      refinementPlugin.identifier != undefined && refinementPlugin.identifier.toLowerCase().includes(filterValue)
    );
  }

  openConfigureRefinementPluginDialog(refinementPlugin: PluginPojo, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureRefinementPluginComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: refinementPlugin,
    });
  }

  addRefinementPlugin(refinementPluginDummy: string | undefined) {
    this.addedRefinementPlugins.push(this._filter(refinementPluginDummy)[0]);
  }

  removeRefinementPlugin(refinementPluginDummy: PluginPojo) {
    const index = this.addedRefinementPlugins.indexOf(refinementPluginDummy);

    if (index >= 0) {
      this.addedRefinementPlugins.splice(index, 1);
    }
  }
}
