import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreateProductionSystemDialogComponent} from "../production-systems/create-production-system-dialog/create-production-system-dialog.component";
import {
  ComplianceJobEntity,
  ComplianceRuleEntity,
  ComplianceRuleParameterAssignmentEntity, ComplianceRuleParameterEntity, ExecutionEntity,
  KVEntity, ModelEnhancementStrategyEntity,
  ProductionSystemEntity,
  TriggerEntity
} from "../gen";
import {CreateCompliancejobDialogComponent} from "./create-compliancejob-dialog/create-compliancejob-dialog.component";

// EXAMPLE DATA FOR THE UI MOCK
const ELEMENT_DATA: ComplianceJobEntity[] = [
  {
    id: 1,
    description: "someJob",
    modelCheckingPluginId: "someCheckingId",
    modelFixingPluginId: "someFixingId",
    complianceRule: {
      id: 1,
      type: "someType",
      location: "someLocation",
      description: "someDesc",
      isDeleted: false,
      parameters: new Array<ComplianceRuleParameterEntity>(),
      jobs: new Array<ComplianceJobEntity>()
    },
    triggers: new Array<TriggerEntity>(),
    complianceRuleParameterAssignments: new Array<ComplianceRuleParameterAssignmentEntity>(),
    executions: new Array<ExecutionEntity>(),
    modelEnhancementStrategy: {
      id: 1,
      pluginIdList: new Array<string>()},
    productionSystem: {
      id: 1,
      isDeleted: false,
      iacTechnologyName: "someIac",
      description: "someDesc",
      properties: new Array<KVEntity>(),
      complianceJobs: new Array<ComplianceJobEntity>(),
      modelCreationPluginId: "someId",
      modelEnhancementStrategy: {
        id: 1,
        pluginIdList: new Array<string>()
      }
    }
  }
]

@Component({
  selector: 'app-compliancejobs',
  templateUrl: './compliancejobs.component.html',
  styleUrls: ['./compliancejobs.component.css']
})
export class CompliancejobsComponent implements OnInit {


  ngOnInit(): void {
  }
  displayedColumns = ['id', 'description', 'modelCheckingPluginId'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  openNewJobDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateCompliancejobDialogComponent, {
      width: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
