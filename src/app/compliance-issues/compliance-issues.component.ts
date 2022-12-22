import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from 'rxjs/operators';
import {async} from "rxjs";
import {ComplianceJobEntity, ExecutionEntity, IssueFixingReportEntity, KVEntity} from "../gen";
import {ComplianceIssueEntity} from "iacmf-api";

@Component({
  selector: 'app-compliance-issues',
  templateUrl: './compliance-issues.component.html',
  styleUrls: ['./compliance-issues.css']
})
export class ComplianceIssuesComponent implements OnInit {


  ngOnInit(): void {
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  complianceIssueCtrl = new FormControl('');
  filteredComplianceIssues: Observable<ComplianceIssueEntity[]>;
  addedComplianceIssues: ComplianceIssueEntity[] = [];

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

  constructor() {
    this.filteredComplianceIssues = this.complianceIssueCtrl.valueChanges.pipe(
      startWith(null),
      map((complianceIssue: string | null) => (complianceIssue ? this._filter(complianceIssue) : this.allComplianceIssues.slice()))
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.addedComplianceIssues.push(this._filter(value)[0]);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.complianceIssueCtrl.setValue(null);
  }

  remove(complianceIssue: ComplianceIssueEntity): void {
    const index = this.addedComplianceIssues.indexOf(complianceIssue);

    if (index >= 0) {
      this.addedComplianceIssues.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    const issue = this.allComplianceIssues.filter(complianceIssue => String(complianceIssue.id).includes(value)).pop()
    if (issue != undefined) {
      this.addedComplianceIssues.push(issue);
    }

    if (this.complianceIssueInput != undefined) {
      this.complianceIssueInput.nativeElement.value = '';
    }
    this.complianceIssueCtrl.setValue(null);
  }

  private _filter(value: string): ComplianceIssueEntity[] {
    const filterValue = value.toLowerCase();

    return this.allComplianceIssues.filter(complianceIssue => String(complianceIssue.id).includes(filterValue));
  }

}
