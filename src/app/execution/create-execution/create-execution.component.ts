import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {
  ComplianceJobService,
  EntityModelComplianceJobEntity, EntityModelKVEntity,
  EntityModelProductionSystemEntity,
  ExecutionService,
  PluginService,
  PluginUsageService
} from "iacmf-client";
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-create-execution',
  templateUrl: './create-execution.component.html',
  styleUrls: ['./create-execution.component.css']
})
export class CreateExecutionComponent implements OnInit {

  complianceJobEntities: EntityModelComplianceJobEntity[] = [];

  selected = -1;

  constructor(public dialogRef: MatDialogRef<CreateExecutionComponent>,
              public executionService: ExecutionService, public utils: Utils, public complianceJobService: ComplianceJobService) { }

  ngOnInit(): void {
    this.refreshComplianceJobs()
  }

  _filter(id: number | undefined) {
    return this.complianceJobEntities.filter(ps => Number(this.utils.getId(ps)) == id);
  }

  refreshComplianceJobs() {
    this.complianceJobEntities = []

    this.complianceJobService.getCollectionResourceCompliancejobentityGet1().subscribe(result => {
      result._embedded?.complianceJobEntities?.forEach(data => {
        this.complianceJobEntities.push(data)
      })
    })
  }

  closeDialog() {

    if (this.selected == -1) {
      throw new Error("Must select creation plugin")
    }

    this.executionService.executeComplianceJob(this.selected, false).subscribe(resp => {
      console.log(resp);
      this.dialogRef.close({
        event: 'Closed', data: resp
      });
    })
  }

}
