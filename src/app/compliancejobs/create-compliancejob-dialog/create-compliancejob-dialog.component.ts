import { Component, OnInit } from '@angular/core';
import {
  ComplianceJobService, ComplianceRuleConfigurationService,
  EntityModelComplianceRuleConfigurationEntity,
  EntityModelPluginUsageEntity, PluginUsageService
} from "iacmf-client";
import { ProductionSystemService } from "iacmf-client";

import { Utils } from "../../utils/utils";
import { MatDialogRef } from "@angular/material/dialog";
import { forkJoin } from 'rxjs';

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

  ngOnInit(): void {
  }

  constructor(private dialogRef: MatDialogRef<CreateCompliancejobDialogComponent>,
              private complianceJobService: ComplianceJobService,
              private productionSystemService: ProductionSystemService,
              private pluginUsageService: PluginUsageService,
              private complianceRuleConfigurationService: ComplianceRuleConfigurationService,
              public utils: Utils) {
  }

  productionSystemSelected($event: any) {
    this.selectedProductionSystem = $event;
  }

  complianceRulesSelected($event: any) {
    this.selectedComplianceRules = $event;
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

  saveCheckingPluginConfiguration($event: EntityModelPluginUsageEntity) {
    this.checkingPluginConfiguration = $event;
  }

  storeComplianceJob() {

    if (this.selectedProductionSystem == -1) {
      // TODO create a generic warning dialog and call it here with a meaningful message
      console.log("Select a production system")
      return;
    }

    if (this.selectedComplianceRules.length == 0) {
      console.log("Select atleast one compliance rule to check")
      return;
    }

    if (this.checkingPluginConfiguration == undefined) {
      console.log("Select checking plugin")
      return;
    }

    let plugin = this.checkingPluginConfiguration;

    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(resp => {
      resp._embedded?.productionSystemEntities
        ?.filter(val => Number(this.utils.getId(val)) == this.selectedProductionSystem)
        .forEach(resp => {
          let requestBody = {
            name: "someName",
            id: -1,
            productionSystem: this.utils.getLink("self", resp),
            checkingPluginUsage: this.utils.getLink("self", plugin),
            complianceRuleConfigurations: this.selectedComplianceRules.map((cr: EntityModelComplianceRuleConfigurationEntity) => this.utils.getLink("self", cr))
          };
          console.debug(requestBody);
          this.complianceJobService.postCollectionResourceCompliancejobentityPost(requestBody).subscribe(resp => {
            const complianceJobUrl = this.utils.getLink("self", resp);
            let requests: any[] = this.refinementPluginUsages.map(usage => {
              let body = {
                _links: {
                  "complianceJobRefinement": {
                    href: complianceJobUrl
                  }
                }
              };

              return this.pluginUsageService.createPropertyReferencePluginusageentityPut1(String(this.utils.getId(usage)), body);
            });

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
                this.dialogRef.close({ event: 'Closed', data: resp });
              });
            } else {
              this.dialogRef.close({ event: 'Closed', data: resp });
            }
          });
        });
    });

  }
}
