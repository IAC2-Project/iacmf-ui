import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ComplianceIssueEntity, PluginPojo} from "iacmf-client";
import {ConfigureFixingPluginComponent} from "../configure-fixing-plugin/configure-fixing-plugin.component";

@Component({
  selector: 'app-compliance-issue',
  templateUrl: './configure-compliance-issue.component.html',
  styleUrls: ['./configure-compliance-issue.component.css']
})
export class ConfigureComlianceIssueComponent implements OnInit {

  fixingPlugins: PluginPojo[] = this.getDummyFixingPluginData();
  addedFixingPlugins: PluginPojo[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ComplianceIssueEntity, public dialog: MatDialog) { }

  selected = this.fixingPlugins[0].identifier;

  ngOnInit(): void {
  }

  getDummyFixingPluginData() : PluginPojo[] {
    return [{
      identifier: "FixingPlugin1",
      pluginType: "ISSUE_FIXING",
      configurationEntryNames: [
        {name:"someKey"},
        {name:"someValue"},
        {name:"someKey2"}
      ]
    },
      {
        identifier: "FixingPlugin2",
        pluginType: "ISSUE_FIXING",
        configurationEntryNames: [
          {name:"someKey"},
          {name:"someValue"},
          {name:"someKey2"}
        ]
      }];
  }

  addFixingPlugin(fixingPlugin: string | undefined) {
    this.addedFixingPlugins.pop();
    this.addedFixingPlugins.push(this._filter(fixingPlugin)[0]);
  }

  removeFixingPlugin(fixingPlugin: PluginPojo) {
    const index = this.addedFixingPlugins.indexOf(fixingPlugin);

    if (index >= 0) {
      this.addedFixingPlugins.splice(index, 1);
    }
  }

  private _filter(value: string | undefined): PluginPojo[] {
    if (value == undefined) {
      return []
    }
    return this.fixingPlugins.filter(fixingPlugin => fixingPlugin.identifier != undefined && fixingPlugin.identifier.includes(value));
  }

  openConfigureFixingPluginDialog(fixingPlugin: PluginPojo, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureFixingPluginComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: fixingPlugin,
    });
  }
}
