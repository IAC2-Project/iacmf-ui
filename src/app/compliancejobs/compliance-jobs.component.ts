import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import {
  ComplianceJobService,
  EntityModelComplianceJobEntity,
} from "iacmf-client";
import {
  CreateCompliancejobDialogComponent
} from "./create-compliancejob-dialog/create-compliancejob-dialog.component";
import { Utils } from "../utils/utils";

@Component({
  selector: 'app-compliancejobs',
  templateUrl: './compliance-jobs.component.html',
  styleUrls: ['./compliance-jobs.component.css']
})
export class ComplianceJobsComponent implements OnInit {

  ngOnInit(): void {
    this.refreshComplianceJobs()
  }

  dataSource: EntityModelComplianceJobEntity[] = [];

  constructor(public dialog: MatDialog, public complianceJobService: ComplianceJobService, public utils: Utils) {
  }

  refreshComplianceJobs() {
    this.dataSource = []

    this.complianceJobService.getCollectionResourceCompliancejobentityGet1().subscribe(result => {
      result._embedded?.complianceJobEntities?.forEach(data => {
        this.dataSource.push(data)
      })
    })
  }

  openNewJobDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CreateCompliancejobDialogComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshComplianceJobs()
    })
  }

  getId(complianceJob: EntityModelComplianceJobEntity): number {
    return Number(this.utils.getId(complianceJob));
  }
}
