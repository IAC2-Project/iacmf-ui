import { Component, OnInit } from '@angular/core';
import {ExecutionEntity, ExecutionService} from "iacmf-api";
import {Utils} from "../utils/utils";
import {CreateProductionSystemDialogComponent} from "../production-systems/create-production-system-dialog/create-production-system-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {CreateExecutionComponent} from "./create-execution/create-execution.component";

@Component({
  selector: 'app-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css']
})
export class ExecutionComponent implements OnInit {

  executions: ExecutionEntity[] = []

  constructor(public dialog: MatDialog, public executonService : ExecutionService, public utils: Utils) { }

  ngOnInit(): void {
    this.refreshExecutions()
  }

  refreshExecutions() {
    this.executions = [];
    this.executonService.getAllExecutions().subscribe(resp => {
      resp.forEach(ex => {
        this.executions.push(ex)
      })
    })
  }

  openCreateExecutionDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CreateExecutionComponent, {
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshExecutions()
    });
  }

}
