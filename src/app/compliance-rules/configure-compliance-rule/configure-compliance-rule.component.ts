import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ComplianceRuleEntity} from "iacmf-api";

@Component({
  selector: 'app-compliance-rule-plugin',
  templateUrl: './configure-compliance-rule.component.html',
  styleUrls: ['./configure-compliance-rule.component.css']
})
export class ConfigureComlianceRuleComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ComplianceRuleEntity) { }

  ngOnInit(): void {
  }

}
