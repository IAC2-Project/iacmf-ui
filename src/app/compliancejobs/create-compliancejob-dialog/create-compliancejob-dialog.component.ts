import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {
  ComplianceJobService,
  ComplianceRuleEntity, EntityModelComplianceRuleConfigurationEntity,
  EntityModelComplianceRuleEntity, EntityModelPluginConfigurationEntity,
  EntityModelPluginUsageEntity
} from "iacmf-client";
import {ProductionSystemService} from "iacmf-client";
import {ProductionSystemsComponent} from "../../production-systems/production-systems.component";
import {Utils} from "../../utils/utils";
import {MatDialogRef} from "@angular/material/dialog";

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

  constructor(public dialogRef: MatDialogRef<CreateCompliancejobDialogComponent>, public complianceJobService : ComplianceJobService, public productionSystemService : ProductionSystemService, public utils: Utils) {}

  productionSystemSelected($event: any) {
    this.selectedProductionSystem = $event;
  }

  complianceRulesSelected($event : any) {
    this.selectedComplianceRules = $event;
  }

  refinementPluginAdded($event: EntityModelPluginUsageEntity) {
    this.refinementPluginUsages.push($event);
    console.debug($event);
  }

  refinementPluginRemoved($event: EntityModelPluginUsageEntity) {
    if ($event != undefined &&  $event.pluginIdentifier) {
      let toRemove = this.refinementPluginUsages.filter(usage => usage.pluginIdentifier === $event.pluginIdentifier)[0];
      let index = this.refinementPluginUsages.indexOf(toRemove);
      this.refinementPluginUsages.slice(index, 1);
    }

    console.debug($event);
  }

  saveCheckingPluginConfiguration($event : EntityModelPluginUsageEntity) {
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

    let plugin = this.checkingPluginConfiguration

    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(resp => {
      resp._embedded?.productionSystemEntities?.filter(val => Number(this.utils.getId(val)) == this.selectedProductionSystem).forEach(resp =>
      this.complianceJobService.postCollectionResourceCompliancejobentityPost({
        name: "someName",
        id: -1,
        productionSystem: this.utils.getLink("self", resp),
        checkingPluginUsage: this.utils.getLink("self", plugin),
        complianceRuleConfigurations: this.selectedComplianceRules.map((cr: EntityModelComplianceRuleConfigurationEntity) =>this.utils.getLink("self", cr))
      }).subscribe(resp => {
        console.log(resp);
        this.dialogRef.close({event:'Closed', data: resp});
      })
      )
    })

  }
}
