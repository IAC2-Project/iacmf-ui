import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {IssueFixingConfigurationEntity} from "iacmf-api";

@Component({
  selector: 'app-configure-checking-plugin',
  templateUrl: './configure-checking-plugin.component.html',
  styleUrls: ['./configure-checking-plugin.component.css']
})
export class ConfigureCheckingPluginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IssueFixingConfigurationEntity) { }


  ngOnInit(): void {
  }

}
