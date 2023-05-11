import {Component, Input, OnInit} from '@angular/core';
import {
  ComplianceIssueEntity,
  ComplianceIssueService,
  ComplianceRuleConfigurationService,
  ComplianceRulesService,
  EntityModelComplianceIssueEntity,
  EntityModelKVEntity,
  ExecutionEntity,
  ExecutionService,
  FixingReportService,
  KeyValueService
} from "iacmf-client";
import {MatDialog} from "@angular/material/dialog";
import {Utils} from "../utils/utils";
import {forkJoin, interval, mergeMap, Observable, switchMap, withLatestFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {EntityModelIssueFixingReportEntity} from "iacmf-client/model/entityModelIssueFixingReportEntity";
import {map} from "rxjs/operators";
import {mergeMappings} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/source_file";

@Component({
  selector: 'app-executions',
  templateUrl: './executions.component.html',
  styleUrls: ['./executions.component.css']
})
export class ExecutionsComponent implements OnInit {
  POLLING_INTERVAL_MILLIS = 15000;
  executions: ExecutionEntity[] = [];

  @Input("complianceJob") complianceJobId: number | undefined;


  constructor(public dialog: MatDialog, public executionService: ExecutionService, public utils: Utils, public http: HttpClient,
              private issueService: ComplianceIssueService, private crConfService: ComplianceRuleConfigurationService) {
  }

  ngOnInit(): void {
    this.refreshExecutions();
    interval(this.POLLING_INTERVAL_MILLIS).subscribe(() => {
      //this.refreshExecutions();
    });
  }

  refreshExecutions() {
    if (this.complianceJobId) {
      this.executionService.getAllExecutionsOfJob(this.complianceJobId).subscribe(resp => {
        console.debug(resp);
        resp.forEach(ex => {
          // load missing issues information
          let requests = ex.complianceIssueEntities?.map(i => this.getIssueDetails(String(i)));
          if (requests != null) {
            forkJoin(requests).subscribe((issues) => {
              ex.complianceIssueEntities = issues;
              this.refreshExecution(ex);
            });
          }

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

  getIssueDetails(issueId: string): Observable<ComplianceIssueEntity> {
    let issueFetchReq = this.issueService.getItemResourceComplianceissueentityGet(issueId);
    let fixingReportsFetchReq = this.issueService.followPropertyReferenceComplianceissueentityGet21(issueId);
    let propertiesFetchReq = this.issueService.followPropertyReferenceComplianceissueentityGet31(issueId);
    let complianceRuleConfFetchReq = this.issueService.followPropertyReferenceComplianceissueentityGet1(issueId);
    let confAndCrFetchReq = complianceRuleConfFetchReq.pipe(
      mergeMap(crConf=> this.crConfService.followPropertyReferenceComplianceruleconfigurationentityGet21(String(this.utils.getId(crConf)))),
      withLatestFrom(complianceRuleConfFetchReq)
    );

    return forkJoin([issueFetchReq, fixingReportsFetchReq, propertiesFetchReq, confAndCrFetchReq]).pipe(
      map(([issueObject, fixingReports, properties, [cr, crConf]]) => {
        console.debug(cr);
        return {
          id: Number(issueId),
          description: issueObject.description,
          type: issueObject.type,
          fixingReports: fixingReports._embedded?.issueFixingReportEntities?.map((r: EntityModelIssueFixingReportEntity) => {
            return {
              id: Number(this.utils.getId(r)),
              description: r.description,
              isSuccessful: r.isSuccessful
            };
          }),
          properties: properties._embedded?.kVEntities?.map((p: EntityModelKVEntity) => {
            return {
              id: Number(this.utils.getId(p)),
              key: p.key,
              value: p.value
            };
          }),
          complianceRuleConfiguration: {
            id: Number(this.utils.getId(crConf)),
            issueType: crConf.issueType,
            complianceRule: {
              id: Number(this.utils.getId(cr)),
              type: cr.type,
              description: cr.description,
              name: cr.name,
              location: cr.location,
              isDeleted: cr.isDeleted
            }
          }
        };
      })
    );
  }

  /**
   * Refresh the list of executions.
   * We use assignments of the properties of an old execution instead of simply replacing it, because this maintains
   * the expanded state of expansion panels.
   * @param newExecution
   */
  refreshExecution(newExecution: ExecutionEntity) {
    console.debug(newExecution);
    let oldExecution = this.executions.filter(e => e.id === newExecution.id);
    if (oldExecution.length === 0) {
      this.executions.push(newExecution);
    } else {
      oldExecution[0].description = newExecution.description;
      oldExecution[0].endTime = newExecution.endTime;
      oldExecution[0].startTime = newExecution.startTime;
      oldExecution[0].status = newExecution.status;
      oldExecution[0].currentStep = newExecution.currentStep;
      oldExecution[0].instanceModel = newExecution.instanceModel;
      oldExecution[0].violationsDetected = newExecution.violationsDetected;
      oldExecution[0].pluginUsageInstances = newExecution.pluginUsageInstances;

      if (newExecution.complianceIssueEntities && newExecution.complianceIssueEntities.length > 0) {

        if (!oldExecution[0].complianceIssueEntities) {
          oldExecution[0].complianceIssueEntities = [];
        }
        newExecution.complianceIssueEntities.forEach(issue => {
          let oldIssue = oldExecution[0].complianceIssueEntities
            ?.filter(i => i.id == issue.id);
          if (oldIssue && oldIssue.length > 0) {
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

  openInNewTab(attributes: Map<string, string>) {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      attributes.forEach((v, k) => link.setAttribute(k, v));
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  downloadInstanceModel(instanceModel: string, filename: string) {
    const blob = new Blob([atob(instanceModel)], {type: 'application/yaml'});
    const url = URL.createObjectURL(blob);
    const attributes = new Map<string, string>();
    attributes
      .set('href', url)
      .set('download', filename);
    this.openInNewTab(attributes);
  }

  sendInstanceModelToWinery(instanceModel: string, resourceName: string): void {
    const wineryUrl: string = "http://localhost:8080/winery";
    const filename = resourceName + '.yaml';
    const topologyModelUrl: string = `http://localhost:8080/winery-topologymodeler/?repositoryURL=http:%2F%2Flocalhost:8080%2Fwinery&uiURL=http:%2F%2Flocalhost:8080%2F%23%2F&ns=https:%2F%2Fopentosca.org%2Fedmm%2Fimported%2FserviceTemplates&id=${resourceName}&topologyProDecURL=http:%2F%2Flocalhost:9090`;
    const blob = new Blob([atob(instanceModel)]);
    const file: File = new File([blob], filename, {type: 'application/yaml'});
    const formData = new FormData();
    formData.append('file', file);
    formData.append('edmm', 'true');
    formData.append('overwrite', 'true');
    formData.append('validate', 'false');

    this.http.post<any>(wineryUrl, formData).subscribe({
      next: () => {
        console.log("successfully submitted request!");
        const attributes = new Map<string, string>();
        attributes.set('href', topologyModelUrl);
        attributes.set('target', '_blank');
        this.openInNewTab(attributes);
      },
      error: (e) => {
        console.error(e);
      }
    });
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

  getSummaryClassName(execution: ExecutionEntity) {
    let className = "color-normal";

    if (execution.status == ExecutionEntity.StatusEnum.Success) {
      if (execution.complianceIssueEntities && execution.complianceIssueEntities.length > 0) {
        let successfulFixes = execution.complianceIssueEntities.filter(i => i.fixingReports && i.fixingReports[0].isSuccessful);

        if (successfulFixes.length == execution.complianceIssueEntities.length) {
          className = "color-success";
        } else if (successfulFixes.length > 0) {
          className = "color-warn";
        } else {
          className = "color-fail";
        }
      } else {
        className = "color-success";
      }
    } else if (execution.status == ExecutionEntity.StatusEnum.Exception) {
      className = "color-fail";
    }

    return className;
  }

  getShortSummary(execution: ExecutionEntity) {
    let result;

    if (execution.status == ExecutionEntity.StatusEnum.Success) {
      result = "Finished normally.";

      if (execution.complianceIssueEntities && execution.complianceIssueEntities.length > 0) {
        result = result + " Violations detected";
        let successfulFixes = execution.complianceIssueEntities.filter(i => i.fixingReports && i.fixingReports[0].isSuccessful);


        if (successfulFixes.length == execution.complianceIssueEntities.length) {
          result += ", and all fixed.";
        } else if (successfulFixes.length > 0) {
          result += ", but only some were fixed!";
        } else {
          result += ", but none were fixed!";
        }
      } else {
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
