import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ComplianceIssueEntity, ComplianceRuleEntity, PluginPojo, PluginService} from "iacmf-api";
import {ConfigureCheckingPluginComponent} from "../configure-checking-plugin/configure-checking-plugin.component";

@Component({
  selector: 'app-compliance-rule-plugin',
  templateUrl: './configure-compliance-rule.component.html',
  styleUrls: ['./configure-compliance-rule.component.css']
})
export class ConfigureComplianceRuleComponent implements OnInit {

  checkingPlugins: PluginPojo[] = [];
  addedCheckingPlugins: PluginPojo[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ComplianceRuleEntity, public dialog: MatDialog,public pluginService: PluginService) {
    this.pluginService.getAllPlugins("ISSUE_CHECKING").forEach(result => result.forEach(pojo => this.checkingPlugins.push(pojo)));
  }

  selected = undefined;

  ngOnInit(): void {
  }


  addCheckingPlugin(checkingPlugin: string | undefined) {
    this.addedCheckingPlugins.pop();
    this.addedCheckingPlugins.push(this._filter(checkingPlugin)[0]);
  }

  removeCheckingPlugin(checkingPlugin: PluginPojo) {
    const index = this.addedCheckingPlugins.indexOf(checkingPlugin);

    if (index >= 0) {
      this.addedCheckingPlugins.splice(index, 1);
    }
  }

  private _filter(value: string | undefined): PluginPojo[] {
    if (value == undefined) {
      return []
    }
    return this.checkingPlugins.filter(checkingPlugin => checkingPlugin.identifier != undefined && checkingPlugin.identifier.includes(value));
  }

  openConfigureCheckingPluginDialog(checkingPlugin: PluginPojo, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureCheckingPluginComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: checkingPlugin,
    });
  }
}
