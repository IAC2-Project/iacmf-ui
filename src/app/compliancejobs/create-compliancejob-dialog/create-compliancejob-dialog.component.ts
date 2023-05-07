import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ComplianceJobService, ComplianceRuleConfigurationService,
  EntityModelComplianceRuleConfigurationEntity,
  EntityModelPluginUsageEntity, IssueFixingConfigurationEntityRequestBody,
  IssueFixingConfigurationService, PluginUsageService, ProductionSystemService
} from "iacmf-client";

import { Utils } from "../../utils/utils";
import { MatDialogRef } from "@angular/material/dialog";
import { forkJoin, Subject } from 'rxjs';
import { IssueFixingComponent } from '../../issue-fixing/issue-fixing.component';
import { RefinementPluginsComponent } from '../../refinement-plugins/refinement-plugins.component';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-compliancejob-dialog',
  templateUrl: './create-compliancejob-dialog.component.html',
  styleUrls: ['./create-compliancejob-dialog.component.css']
})
export class CreateCompliancejobDialogComponent implements OnInit {

  selectedProductionSystem = -1;
  selectedComplianceRules: EntityModelComplianceRuleConfigurationEntity[] = [];
  checkingPluginConfiguration: EntityModelPluginUsageEntity | undefined;
  refinementPluginUsages = new Array<EntityModelPluginUsageEntity>();
  reportingPluginConfiguration: EntityModelPluginUsageEntity | undefined;
  shareNewComplianceRuleConfigurationEvents: Subject<EntityModelComplianceRuleConfigurationEntity[]> = new Subject<EntityModelComplianceRuleConfigurationEntity[]>();
  issueFixingConfigurationsToCreate: IssueFixingConfigurationEntityRequestBody[] = [];

  @ViewChild('fixingComponent', { static: false }) fixingComponent: IssueFixingComponent | undefined;
  @ViewChild('refinementComponent', {static: false}) refinementComponent: RefinementPluginsComponent | undefined;

  ngOnInit(): void {
  }

  constructor(private dialogRef: MatDialogRef<CreateCompliancejobDialogComponent>,
              private complianceJobService: ComplianceJobService,
              private productionSystemService: ProductionSystemService,
              private pluginUsageService: PluginUsageService,
              private issueFixingConfigurationService: IssueFixingConfigurationService,
              private complianceRuleConfigurationService: ComplianceRuleConfigurationService,
              private snackBar: MatSnackBar,
              public utils: Utils) {
  }

  showNotification(message: string) {
    this.snackBar.open(message, "OK",{
      duration: 5 * 1000,
    });
  }

  productionSystemSelected($event: any) {
    this.selectedProductionSystem = $event;
  }

  complianceRulesSelected($event: EntityModelComplianceRuleConfigurationEntity[]) {
    this.selectedComplianceRules = $event;
    this.shareNewComplianceRuleConfigurationEvents.next($event);
  }

  refinementPluginAdded($event: EntityModelPluginUsageEntity) {
    this.refinementPluginUsages.push($event);
  }

  refinementPluginRemoved($event: EntityModelPluginUsageEntity) {
    console.debug($event);
    if ($event != undefined && $event.pluginIdentifier) {
      let toRemove = this.refinementPluginUsages.filter(usage => this.utils.getId(usage) === this.utils.getId($event))[0];
      let index = this.refinementPluginUsages.indexOf(toRemove);
      this.refinementPluginUsages.splice(index, 1);
    }
  }

  saveReportingPluginConfiguration($event: EntityModelPluginUsageEntity) {
    this.reportingPluginConfiguration = $event;
  }

  saveCheckingPluginConfiguration($event: EntityModelPluginUsageEntity) {
    this.checkingPluginConfiguration = $event;
  }

  saveIssueFixingConfigurations($event: IssueFixingConfigurationEntityRequestBody[]) {
    this.issueFixingConfigurationsToCreate = $event
  }

  storeComplianceJob() {

    if (this.selectedProductionSystem == -1) {
      this.showNotification("Select a production system!");
      return;
    }

    if (this.selectedComplianceRules.length == 0) {
      this.showNotification("Select at least one compliance rule to check!")
      return;
    }

    if (this.checkingPluginConfiguration == undefined) {
      this.showNotification("Select checking plugin!")
      return;
    }

    if (this.reportingPluginConfiguration == undefined) {
      this.showNotification("Select reporting plugin!")
      return;
    }

    if (this.issueFixingConfigurationsToCreate.length == 0) {
      this.showNotification("Warning: no issue fixing is configured!")
    }

    // the configuration entries of the fixing and refinement plugins need to updated their values.
    this.fixingComponent?.persistAssignments();
    this.refinementComponent?.persistAssignments();

    let checkingPlugin = this.checkingPluginConfiguration;
    let reportingPlugin = this.reportingPluginConfiguration;

    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(resp => {
      resp._embedded?.productionSystemEntities
        ?.filter(val => Number(this.utils.getId(val)) == this.selectedProductionSystem)
        .forEach(resp => {
          let requestBody = {
            name: "someName",
            id: -1,
            productionSystem: this.utils.getLink("self", resp),
            checkingPluginUsage: this.utils.getLink("self", checkingPlugin),
            reportingPlugin: this.utils.getLink("self", reportingPlugin),
            complianceRuleConfigurations: this.selectedComplianceRules.map((cr: EntityModelComplianceRuleConfigurationEntity) => this.utils.getLink("self", cr))
          };
          console.debug(requestBody);
          this.complianceJobService.postCollectionResourceCompliancejobentityPost(requestBody).subscribe(complianceJob => {
            const complianceJobUrl = this.utils.getLink("self", complianceJob);
            let requests: any[] = this.refinementPluginUsages.map(usage => {
              let body = {
                _links: {
                  "complianceJobRefinement": {
                    href: complianceJobUrl
                  }
                }
              };

              return this.pluginUsageService.createPropertyReferencePluginusageentityPut(String(this.utils.getId(usage)), body);
            });

            requests.push(...this.issueFixingConfigurationsToCreate.map(conf => {
              conf.complianceJob = complianceJobUrl;
              console.log("issue fixing configuration request");
              console.debug(conf);
              return this.issueFixingConfigurationService.postCollectionResourceIssuefixingconfigurationentityPost(conf);
            }));

            requests.push(...this.selectedComplianceRules.map(ruleConfiguration => {
              let body = {
                _links: {
                  "complianceJob": {
                    href: complianceJobUrl
                  }
                }
              };

              return this.complianceRuleConfigurationService.createPropertyReferenceComplianceruleconfigurationentityPut(String(this.utils.getId(ruleConfiguration)), body);
            }));

            if (requests.length > 0) {
              console.log("Creating associations between the %d refinement plugin usages and compliance rule configurations, and the compliance job.", requests.length);
              forkJoin(requests).subscribe(() => {
                console.log("Finished creating associations with the compliance job!");
                this.dialogRef.close({ event: 'Closed', data: complianceJob });
              });
            } else {
              this.dialogRef.close({ event: 'Closed', data: complianceJob });
            }
          });
        });
    });

  }
}
