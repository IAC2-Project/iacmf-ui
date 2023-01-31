import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable, Subscription} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {
  ComplianceIssueEntity, EntityModelComplianceRuleConfigurationEntity, EntityModelComplianceRuleEntity,
  EntityModelIssueFixingConfigurationEntity, EntityModelPluginUsageEntity, IssueFixingConfigurationEntity,
  IssueFixingConfigurationService, PluginPojo, PluginService, PluginUsageService
} from "iacmf-client";
import {MatDialog} from "@angular/material/dialog";
import {Utils} from "../utils/utils";

@Component({
  selector: 'app-issue-fixing',
  templateUrl: './issue-fixing.component.html',
  styleUrls: ['./issue-fixing.css']
})
export class IssueFixingComponent implements OnInit {

  ngOnInit(): void {
    if (this.complianceRuleConfSub != undefined) {
      this.complianceRuleConfSubscription = this.complianceRuleConfSub.subscribe(conf => {
        this.issueTypes.push(conf.issueType)
        this.pluginService.getAllPlugins("ISSUE_FIXING", undefined, undefined, conf.issueType).subscribe(plugins => {
          plugins.forEach(plugin => {
            this.plugins.push(plugin)
            if (plugin.identifier != undefined) {
              if (this.isIssueTypeInMap(conf.issueType)) {
                this.addToMap(conf.issueType, plugin.identifier)
              } else {
                this.addEmptyEntryToMap(conf.issueType)
                this.addToMap(conf.issueType, plugin.identifier)
              }
            }
          })
        })
      })
    }
  }

  complianceRuleConfigurationEntities: EntityModelComplianceRuleConfigurationEntity[] = [];
  issueFixingConfigurations: IssueFixingConfigurationEntity[] = [];

  @Input("complianceRuleConfigurationsSub") complianceRuleConfSub: Observable<EntityModelComplianceRuleConfigurationEntity> | undefined;
  private complianceRuleConfSubscription: Subscription | undefined;

  @Output("issueFixingConfigurationsToCreate") issueFixingConfigurationsToCreateEmitter = new EventEmitter();

  issueTypes: string[] = []
  selectedIssueType = undefined
  selectedPluginId = undefined
  plugins: PluginPojo[] = []
  issueTypeToPluginMap = [{
    issueType: "dummyType",
    identifiers: ["dummyId1", "dummyId2"]
  }]

  constructor(public dialog: MatDialog, public issueFixingConfigurationService : IssueFixingConfigurationService, public utils : Utils, public pluginService: PluginService, public pluginUsageService: PluginUsageService) {

  }

  getPluginsByIssueType(issueType: string | undefined) : string[] {
    let result: string[] = []
    if (issueType != undefined) {
      for (let entry of this.issueTypeToPluginMap) {
        if (entry.issueType.includes(issueType)) {
          return entry.identifiers
        }
      }
    }
    return result
  }

  addEmptyEntryToMap(issueType:string) {
    this.issueTypeToPluginMap.push({
      issueType: issueType,
      identifiers: []
    })
  }

  addToMap(issueType:string, pluginId:string) {
    this.issueTypeToPluginMap.filter(entry => entry.issueType.includes(issueType)).forEach(entry => {
      if (!entry.identifiers.includes(pluginId)) {
        entry.identifiers.push(pluginId)
      }
    })
  }

  isIssueTypeInMap(issueType:string) : boolean {
    for (let entry of this.issueTypeToPluginMap) {
      if (entry.issueType.includes(issueType)) {
        return true;
      }
    }
    return false;
  }

  createIssueFixingConfiguration() {
    if (this.selectedIssueType == null)
      return
    if (this.selectedPluginId == null)
      return

    this.issueFixingConfigurations.push({
      id: -1,
      issueType: this.selectedIssueType,
      pluginUsage: {
        id: -1,
        pluginIdentifier: this.selectedPluginId
      }
    })

    this.issueFixingConfigurationsToCreateEmitter.emit(this.issueFixingConfigurations)
  }

  savePluginConfiguration($event : EntityModelPluginUsageEntity, fixingConfiguration: IssueFixingConfigurationEntity) {
    fixingConfiguration.pluginUsage = {
      id: Number(this.utils.getId($event)),
      pluginIdentifier: $event.pluginIdentifier
    }
  }
}
