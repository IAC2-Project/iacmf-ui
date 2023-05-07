import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { forkJoin, Observable, Subscription } from "rxjs";
import {
  EntityModelComplianceRuleConfigurationEntity, EntityModelIssueFixingConfigurationEntity,
  EntityModelPluginUsageEntity, IssueFixingConfigurationEntity, IssueFixingConfigurationEntityRequestBody,
  IssueFixingConfigurationService, PluginPojo, PluginService, PluginUsageService
} from "iacmf-client";
import { MatDialog } from "@angular/material/dialog";
import { Utils } from "../utils/utils";
import {
  PluginUsageConfigurationDialogComponent
} from '../plugin-usage/plugin-usage-configuration-dialog/plugin-usage-configuration-dialog.component';
import PluginTypeEnum = PluginPojo.PluginTypeEnum;
import { PluginUsageComponent } from '../plugin-usage/plugin-usage.component';

@Component({
  selector: 'app-issue-fixing',
  templateUrl: './issue-fixing.component.html',
  styleUrls: ['./issue-fixing.component.css']
})
export class IssueFixingComponent implements OnInit {
  issueFixingConfigurations: IssueFixingConfigurationEntityRequestBody[] = [];

  selectedPluginUsages: EntityModelPluginUsageEntity[] = [];

  selectedIssueType = undefined;
  selectedPluginId = undefined;

  issueTypeToPluginMap = new Map<string, string[]>();

  private complianceRuleConfSubscription: Subscription | undefined;
  @Input("complianceRuleConfigurationsSub") complianceRuleConfSub: Observable<EntityModelComplianceRuleConfigurationEntity[]> | undefined;

  @Output("configurationsChanged") configurationChangedEmitter = new EventEmitter();

  @ViewChildren('pluginUsages') components: QueryList<PluginUsageComponent> | undefined;

  ngOnInit(): void {
    if (this.complianceRuleConfSub != undefined) {
      this.complianceRuleConfSubscription = this.complianceRuleConfSub.subscribe(crConfigurations => {
        this.issueTypeToPluginMap.clear();

        crConfigurations.forEach(conf => {
          if (conf.issueType && conf.issueType.trim().length > 0) {
            // avoid duplicates
            if (!this.issueTypeToPluginMap.has(conf.issueType)) {
              this.pluginService.getAllPlugins("ISSUE_FIXING", undefined, undefined, conf.issueType).subscribe(plugins => {
                plugins.forEach(plugin => {
                  if (plugin.identifier != undefined) {
                    this.addToMap(conf.issueType, plugin.identifier);
                  }
                });
              });
            }
          }
        });
      });
    }
  }

  constructor(private dialog: MatDialog, public utils: Utils, private pluginService: PluginService) {

  }

  getPluginsByIssueType(issueType: string | undefined): string[] {
    if (issueType != undefined && this.issueTypeToPluginMap.has(issueType)) {
      // @ts-ignore
      return this.issueTypeToPluginMap.get(issueType);
    }

    return [];
  }

  addToMap(issueType: string, pluginId: string) {
    if (!this.issueTypeToPluginMap.has(issueType)) {
      this.issueTypeToPluginMap.set(issueType, [pluginId]);
    } else {
      let currentPlugins = this.issueTypeToPluginMap.get(issueType);

      if (currentPlugins && currentPlugins.indexOf(pluginId) < 0) {
        currentPlugins.push(pluginId);
      }
    }
  }

  createIssueFixingConfiguration() {
    if (!this.selectedIssueType || !this.selectedPluginId)
      return;

    this.issueFixingConfigurations.push({
      id: -1,
      issueType: this.selectedIssueType
    });

    this.selectedPluginUsages.push({
      pluginIdentifier: this.selectedPluginId
    });
  }

  pluginConfigurationCreated(resp: EntityModelPluginUsageEntity, index: number) {
    this.issueFixingConfigurations[index].pluginUsage = this.utils.getLink("self", resp);
    this.selectedPluginUsages[index] = resp;
    this.configurationChangedEmitter.emit(this.issueFixingConfigurations);
  }

  removeFixingConfiguration(pluginIndex: number) {
    if (pluginIndex >= 0) {
      this.utils.removePluginUsage(this.utils.getId(this.selectedPluginUsages[pluginIndex])).subscribe(() => {
        console.log("finished removing plugin identifier.");
        this.selectedPluginUsages.splice(pluginIndex, 1);
        this.issueFixingConfigurations.splice(pluginIndex, 1);
        this.configurationChangedEmitter.emit(this.issueFixingConfigurations);
      });
    }
  }

  persistAssignments() {
    let requests = this.components?.toArray().map(component=> {
      return component.updateAllPluginConfigurations();
    });

    if(requests && requests.length > 0) {
      forkJoin(requests).subscribe();
    }
  }

  isAddButtonDisabled(): boolean {
    if (!this.selectedIssueType || !this.selectedPluginId) {
      return true;
    }
    let index = this.issueFixingConfigurations.map(c => c.issueType).indexOf(this.selectedIssueType);
    if (index >= 0) {
      return index == this.selectedPluginUsages.map(u => u.pluginIdentifier).indexOf(this.selectedPluginId);
    }

    return false;
  }

}
