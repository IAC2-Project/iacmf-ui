import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {
  ComplianceIssueEntity, EntityModelComplianceRuleConfigurationEntity, EntityModelComplianceRuleEntity,
  EntityModelIssueFixingConfigurationEntity, EntityModelPluginUsageEntity,
  IssueFixingConfigurationService
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
    this.refreshIssueFixingConfigurationEntities()
  }

  @Input("complianceRuleConfigurations") complianceRuleConfigurationEntities: EntityModelComplianceRuleConfigurationEntity[] = [];
  issueFixingConfigurations: EntityModelIssueFixingConfigurationEntity[] = [];
  selectedIssueFixingConfigurations: EntityModelIssueFixingConfigurationEntity[] = [];
  pluginConfiguration: EntityModelPluginUsageEntity | undefined

  constructor(public dialog: MatDialog, public issueFixingConfigurationService : IssueFixingConfigurationService, public utils : Utils) {

  }

  refreshIssueFixingConfigurationEntities() {
    this.issueFixingConfigurations = []
    this.issueFixingConfigurationService.getCollectionResourceIssuefixingconfigurationentityGet1().subscribe(resp => {
      resp._embedded?.issueFixingConfigurationEntities?.forEach(issue => {
        this.issueFixingConfigurations.push(issue)
      })
    })
  }

  savePluginConfiguration($event : EntityModelPluginUsageEntity) {
    this.pluginConfiguration = $event;
  }
}
