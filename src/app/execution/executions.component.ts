import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ComplianceIssueEntity, ExecutionEntity, ExecutionService } from "iacmf-client";
import { MatDialog } from "@angular/material/dialog";
import { Utils } from "../utils/utils";
import { interval } from "rxjs";

@Component({
  selector: 'app-executions',
  templateUrl: './executions.component.html',
  styleUrls: ['./executions.component.css']
})
export class ExecutionsComponent implements OnInit {
  POLLING_INTERVAL_MILLIS = 15000;
  executions: ExecutionEntity[] = [];

  @Input("complianceJob") complianceJobId: number | undefined;


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

  /**
   * Refresh the list of executions.
   * We use assignments of the properties of an old execution instead of simply replacing it, because this maintains
   * the expanded state of expansion panels.
   * @param newExecution
   */
  refreshExecution(newExecution: ExecutionEntity) {
    let oldExecution = this.executions.filter(e => e.id === newExecution.id);
    if (oldExecution.length === 0) {
      this.executions.push(newExecution);
    } else {
      oldExecution[0].description = newExecution.description;
      oldExecution[0].endTime = newExecution.endTime;
      oldExecution[0].startTime = newExecution.startTime;
      oldExecution[0].status = newExecution.status;
      oldExecution[0].complianceJob = newExecution.complianceJob;
      oldExecution[0].currentStep = newExecution.currentStep;
      oldExecution[0].instanceModel = newExecution.instanceModel;
      oldExecution[0].violationsDetected = newExecution.violationsDetected;
      oldExecution[0].pluginUsageInstances = newExecution.pluginUsageInstances;

      if (newExecution.complianceIssueEntities && newExecution.complianceIssueEntities.length > 0) {

        if(!oldExecution[0].complianceIssueEntities) {
          oldExecution[0].complianceIssueEntities = [];
        }

        newExecution.complianceIssueEntities.forEach(issue => {
          let oldIssue = oldExecution[0].complianceIssueEntities?.filter(i => i.id == issue.id);
          if(oldIssue && oldIssue.length > 0) {
            oldIssue[0].description = issue.description;
            oldIssue[0].type = issue.type;
            oldIssue[0].properties = issue.properties;
            oldIssue[0].fixingReports = issue.fixingReports;
          } else {
            oldExecution[0].complianceIssueEntities?.push(issue);
          }
        });
      } else {
        oldExecution[0].complianceIssueEntities = [];
      }
    }
  }

  executeComplianceJob(): void {
    if (this.complianceJobId) {
      this.executionService.executeComplianceJob(this.complianceJobId, false).subscribe(resp => {
        this.refreshExecutions();
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

  getComplianceRuleName(issue: ComplianceIssueEntity) {
    if (issue.complianceRuleConfiguration?.complianceRule) {
      return issue.complianceRuleConfiguration.complianceRule.name +
        " (id: " + issue.complianceRuleConfiguration.complianceRule.id + ")";
    }
    return "";
  }

  getIssueSummaryClassName(execution: ExecutionEntity, issue: ComplianceIssueEntity) {
    if (execution.status == ExecutionEntity.StatusEnum.Running || execution.status == ExecutionEntity.StatusEnum.Idle) {
      return "color-normal";
    }

    if (issue.fixingReports && issue.fixingReports.length > 0) {
      if (issue.fixingReports[0].isSuccessful) {
        return "color-success";
      }

      return "color-fail";
    } else {
      // should never happen
      return "color-warn";
    }
  }

  getIssueSummary(execution: ExecutionEntity, issue: ComplianceIssueEntity) {
    if (execution.status == ExecutionEntity.StatusEnum.Running || execution.status == ExecutionEntity.StatusEnum.Idle) {
      return "Fixing...";
    }

    if (issue.fixingReports && issue.fixingReports.length > 0) {
      if (issue.fixingReports[0].isSuccessful) {
        return "Fixed!";
      }

      return "Failed to fix!";
    } else {
      // should never happen
      return "Unknown status.";
    }
  }

  getSummaryClassName(execution:ExecutionEntity) {
    let className = "color-normal";

    if(execution.status == ExecutionEntity.StatusEnum.Success) {
      if (execution.complianceIssueEntities && execution.complianceIssueEntities.length > 0) {
        let successfulFixes = execution.complianceIssueEntities.filter(i => i.fixingReports && i.fixingReports[0].isSuccessful);

        if (successfulFixes.length == execution.complianceIssueEntities.length) {
          className = "color-success";
        } else if (successfulFixes.length > 0){
          className = "color-warn";
        } else {
          className = "color-fail";
        }
      } else{
        className = "color-success";
      }
    } else if (execution.status == ExecutionEntity.StatusEnum.Exception) {
      className = "color-fail";
    }

    return className;
  }

  getShortSummary(execution:ExecutionEntity) {
    let result;

    if(execution.status == ExecutionEntity.StatusEnum.Success) {
      result = "Finished normally.";

      if (execution.complianceIssueEntities && execution.complianceIssueEntities.length > 0) {
        result = result + " Violations detected";
        let successfulFixes = execution.complianceIssueEntities.filter(i => i.fixingReports && i.fixingReports[0].isSuccessful);


        if (successfulFixes.length == execution.complianceIssueEntities.length) {
          result += ", and all fixed.";
        } else if (successfulFixes.length > 0){
          result += ", but only some were fixed!";
        } else {
          result += ", but none were fixed!";
        }
      } else{
        result += " No violations detected.";
      }
    } else if (execution.status == ExecutionEntity.StatusEnum.Running) {
      result = "Running.";

      if (execution.violationsDetected) {
        result += "Violations were detected. Attempting fixing..."
      }

    } else if (execution.status == ExecutionEntity.StatusEnum.Exception) {
      result = "Execution finished abnormally.";
    } else {
      result = execution.status;
    }

    return result;
  }

}
