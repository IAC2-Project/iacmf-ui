import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {ComplianceIssueEntity} from "iacmf-api";
import {ConfigureComlianceIssueComponent} from "./configure-compliance-issue/configure-compliance-issue.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-compliance-issues',
  templateUrl: './compliance-issues.component.html',
  styleUrls: ['./compliance-issues.css']
})
export class ComplianceIssuesComponent implements OnInit {


  ngOnInit(): void {
  }

  allComplianceIssues: ComplianceIssueEntity[] = [
    {
      id: 1,
      execution: {
        id: 1,
        startTime: "whyNotARealDateType?",
        endTime: "whyNotARealDateType?",
        currentStep: "START",
        status: "STARTED",
        violationsDetected: true,
        description: "someDesc",
      },
      fixingReports: [{id: 1,
        isSuccessful: true,
        description: "whatever"}],
      type: "someType",
    },
    {
      id: 2,
      execution: {
        id: 3,
        startTime: "whyNotARealDateType?",
        endTime: "whyNotARealDateType?",
        currentStep: "START",
        status: "STARTED",
        violationsDetected: true,
        description: "someDesc",
      },
      fixingReports: [{id: 4,
        isSuccessful: true,
        description: "whatever"}],
      type: "someType",
    }
  ]

  // TODO there shouldn't be an input at the end right ?
  @ViewChild('complianceIssueInput') complianceIssueInput: ElementRef<HTMLInputElement> | undefined;

  constructor(public dialog: MatDialog) {

  }

  openComplianceIssueDialog(complianceIssueEntity: ComplianceIssueEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigureComlianceIssueComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: complianceIssueEntity,
    });
  }
}
