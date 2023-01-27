import { Component, OnInit } from '@angular/core';
import {
  ComplianceJobService,
  EntityModelComplianceRuleEntity,
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
  selectedComplianceRules: EntityModelComplianceRuleEntity[] = [];
  checkingPluginConfiguration: EntityModelPluginUsageEntity | undefined;
  refinementPluginUsages = new Array<EntityModelPluginUsageEntity>();

  ngOnInit(): void {
  }

  constructor(private dialogRef: MatDialogRef<CreateCompliancejobDialogComponent>, private complianceJobService: ComplianceJobService, private productionSystemService: ProductionSystemService, private pluginUsageService: PluginUsageService, private utils: Utils) {
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
            complianceRuleConfigurations: this.selectedComplianceRules.map((cr: EntityModelComplianceRuleEntity) => this.utils.getLink("self", cr)),
          };
          console.debug(requestBody);
          this.complianceJobService.postCollectionResourceCompliancejobentityPost(requestBody).subscribe(resp => {
            console.log(resp);
            let strategyLinks:any[] = [];

            this.refinementPluginUsages.forEach((usage, index) => {
              strategyLinks.push(this.utils.getLink("self", usage));
            });

            if (strategyLinks.length > 0) {
              this.complianceJobService.createPropertyReferenceCompliancejobentityPut3(String(this.utils.getId(resp)), {
                _links: strategyLinks
              })
            } else {
              this.dialogRef.close({ event: 'Closed', data: resp });
            }
          });
        });
    });

  }
}
