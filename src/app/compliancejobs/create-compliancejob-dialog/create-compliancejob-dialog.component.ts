import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ComplianceJobService, ComplianceRuleEntity} from "iacmf-api";
import {ProductionSystemService} from "iacmf-api";
import {ProductionSystemsComponent} from "../../production-systems/production-systems.component";
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-create-compliancejob-dialog',
  templateUrl: './create-compliancejob-dialog.component.html',
  styleUrls: ['./create-compliancejob-dialog.component.css']
})
export class CreateCompliancejobDialogComponent implements OnInit {

  selectedProductionSystem = -1;
  selectedComplianceRules: ComplianceRuleEntity[] = [];

  ngOnInit(): void {
  }

  constructor(public complianceJobService : ComplianceJobService, public productionSystemService : ProductionSystemService, public utils: Utils) {}

  productionSystemSelected($event: any) {
    this.selectedProductionSystem = $event;
  }

  complianceRulesSelected($event : any) {
    this.selectedComplianceRules = $event;
  }

  storeComplianceJob() {

    if (this.selectedProductionSystem == -1) {
      // TODO create a generic warning dialog and call it here with a meaningful message
      console.log("Select a production system")
      return;
    }

    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(resp => {
      resp._embedded?.productionSystemEntities?.filter(val => this.utils.toProductionSystemEntity(val).id == this.selectedProductionSystem).forEach(resp =>
      this.complianceJobService.postCollectionResourceCompliancejobentityPost({
        productionSystem: this.utils.getLinkProductionSystem(resp)
      }).subscribe(resp => {
        console.log(resp)
      })
      )
    })

  }
}
