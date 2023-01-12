import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  ComplianceJobEntity,
  ComplianceRuleParameterAssignmentEntity,
  ComplianceRuleParameterEntity,
  ExecutionEntity,
  KVEntity,
  TriggerEntity
} from "iacmf-api";
import {CreateCompliancejobDialogComponent} from "./create-compliancejob-dialog/create-compliancejob-dialog.component";

// EXAMPLE DATA FOR THE UI MOCK
const ELEMENT_DATA: ComplianceJobEntity[] = [
  {
    id: 1,
    name: "someName",
    description: "someJob",
    triggers: new Array<TriggerEntity>(),
    executions: new Array<ExecutionEntity>(),
    productionSystem: {
      id: 1,
      name: "someName",
      isDeleted: false,
      iacTechnologyName: "someIac",
      description: "someDesc",
      properties: new Array<KVEntity>(),
    }
  }
]

@Component({
  selector: 'app-compliancejobs',
  templateUrl: './compliance-jobs.component.html',
  styleUrls: ['./compliance-jobs.component.css']
})
export class ComplianceJobsComponent implements OnInit {


  ngOnInit(): void {
  }
  displayedColumns = ['id', 'description', 'modelCheckingPluginId'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  openNewJobDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateCompliancejobDialogComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
