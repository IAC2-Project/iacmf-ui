import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {
  ComplianceJobService,
  ComplianceRuleEntity,
  EntityModelComplianceRuleEntity, EntityModelPluginConfigurationEntity,
  EntityModelPluginUsageEntity
} from "iacmf-client";
import {ProductionSystemService} from "iacmf-client";
import {ProductionSystemsComponent} from "../../production-systems/production-systems.component";
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-create-compliancejob-dialog',
  templateUrl: './create-compliancejob-dialog.component.html',
  styleUrls: ['./create-compliancejob-dialog.component.css']
})
export class CreateCompliancejobDialogComponent implements OnInit {

  selectedProductionSystem = -1;
  selectedComplianceRules: EntityModelComplianceRuleEntity[] = [];
  checkingPluginConfiguration: EntityModelPluginUsageEntity | undefined;

  ngOnInit(): void {
  }

  constructor(public complianceJobService : ComplianceJobService, public productionSystemService : ProductionSystemService, public utils: Utils) {}

  productionSystemSelected($event: any) {
    this.selectedProductionSystem = $event;
  }

  complianceRulesSelected($event : any) {
    this.selectedComplianceRules = $event;
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
        complianceRuleConfigurations: this.selectedComplianceRules.map((cr: EntityModelComplianceRuleEntity) =>this.utils.getLink("self", cr))
      }).subscribe(resp => {
        console.log(resp)
        this
      })
      )
    })

  }
}
