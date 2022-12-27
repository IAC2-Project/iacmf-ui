import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ComplianceRuleEntity} from "../../gen";
import {ComplianceIssueEntity} from "iacmf-api";

@Component({
  selector: 'app-compliance-issue',
  templateUrl: './configure-compliance-issue.component.html',
  styleUrls: ['./configure-compliance-issue.component.css']
})
export class ConfigureComlianceIssueComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ComplianceIssueEntity) { }

  ngOnInit(): void {
  }

}
