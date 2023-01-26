import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EntityModelComplianceJobEntity, ExecutionEntity, ExecutionService } from "iacmf-client";
import { MatDialog } from "@angular/material/dialog";
import { CreateExecutionComponent } from "./create-execution/create-execution.component";
import { Utils } from "../utils/utils";
import { interval } from "rxjs";
import { PluginUsageComponent } from '../plugin-usage/plugin-usage.component';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-executions',
  templateUrl: './executions.component.html',
  styleUrls: ['./executions.component.css']
})
export class ExecutionsComponent implements OnInit {

  POLLING_INTERVAL_MILLIS = 15000;
  executions: ExecutionEntity[] = [];

  @Input("complianceJob") complianceJobId: number | undefined;
  @ViewChild('executionsPanel', { static: false }) executionsPanel: MatExpansionPanel | undefined;

  constructor(public dialog: MatDialog, public executionService: ExecutionService, public utils: Utils) {
  }

  ngOnInit(): void {
    this.refreshExecutions()
    interval(this.POLLING_INTERVAL_MILLIS).subscribe(() => {
      this.refreshExecutions();
    })
  }

  refreshExecutions() {
    if (this.complianceJobId) {
      this.executionService.getAllExecutionsOfJob(this.complianceJobId).subscribe(resp => {
        resp.forEach(ex => {
          this.refreshExecution(ex);
        });
        // let's find the executions that were deleted in the backend (not really expected, but just in case!)
        let deletedExecutions = this.executions.filter(ex => resp.filter(exx => exx.id === ex.id).length === 0);
        deletedExecutions.forEach(ex => {
          const index = this.executions.indexOf(ex);
          this.executions.splice(index, 1);
        });
      });
    }
  }

  refreshExecution(newExecution: ExecutionEntity) {
    let oldExecution = this.executions.filter(e => e.id === newExecution.id);
    if (oldExecution.length === 0) {
      this.executions.push(newExecution);
    } else {
      oldExecution[0].description = newExecution.description;
      oldExecution[0].endTime = newExecution.endTime;
      oldExecution[0].startTime = newExecution.startTime;
      oldExecution[0].status = newExecution.status;
      oldExecution[0].complianceIssueEntities = newExecution.complianceIssueEntities;
      oldExecution[0].complianceJob = newExecution.complianceJob;
      oldExecution[0].currentStep = newExecution.currentStep;
      oldExecution[0].instanceModel = newExecution.instanceModel;
      oldExecution[0].violationsDetected = newExecution.violationsDetected;
      oldExecution[0].pluginUsageInstances = newExecution.pluginUsageInstances;
    }
  }

  executeComplianceJob(): void {
    if (this.complianceJobId) {
      this.executionService.executeComplianceJob(this.complianceJobId, false).subscribe(resp => {
        console.log(resp);
        this.refreshExecutions();
        this.executionsPanel?.open();
      });
    }
  }

  downloadInstanceModel(instanceModel: string, filename: string) {
    const blob = new Blob([atob(instanceModel)], { type: 'application/yaml' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }
  }

}
