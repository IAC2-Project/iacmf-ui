import { Component, OnInit } from '@angular/core';
import {
  ComplianceJobService,
  EntityModelComplianceRuleEntity,
  EntityModelPluginUsageEntity
} from "iacmf-client";
import { ProductionSystemService } from "iacmf-client";

import { Utils } from "../../utils/utils";
import { MatDialogRef } from "@angular/material/dialog";

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

  constructor(public dialogRef: MatDialogRef<CreateCompliancejobDialogComponent>, public complianceJobService: ComplianceJobService, public productionSystemService: ProductionSystemService, public utils: Utils) {
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
    if ($event != undefined && $event.pluginIdentifier) {
      let toRemove = this.refinementPluginUsages.filter(usage => usage.pluginIdentifier === $event.pluginIdentifier)[0];
      let index = this.refinementPluginUsages.indexOf(toRemove);
      this.refinementPluginUsages.slice(index, 1);
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
    let refinementStrategy: any[] = [];

    if (this.refinementPluginUsages && this.refinementPluginUsages.length > 0) {
      refinementStrategy = this.refinementPluginUsages.map((usage) => this.utils.getLink("self", usage));
    }

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
            modelRefinementStrategy: refinementStrategy
          };
          console.debug(requestBody);
          this.complianceJobService.postCollectionResourceCompliancejobentityPost(requestBody).subscribe(resp => {
            console.log(resp);
            this.dialogRef.close({ event: 'Closed', data: resp });
          });
        });
    });

  }
}
