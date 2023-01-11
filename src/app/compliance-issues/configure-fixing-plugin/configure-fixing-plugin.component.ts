import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {IssueFixingConfigurationEntity} from "iacmf-api";

@Component({
  selector: 'app-configure-fixing-plugin',
  templateUrl: './configure-fixing-plugin.component.html',
  styleUrls: ['./configure-fixing-plugin.component.css']
})
export class ConfigureFixingPluginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IssueFixingConfigurationEntity) { }

  ngOnInit(): void {
  }

}
