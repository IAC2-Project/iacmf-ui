import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ValidationPluginDummy} from "../../validation-plugins/validation-plugins.component";
import {reportingPluginDummy} from "../reporting-plugins.component";

@Component({
  selector: 'app-configure-reporting-plugin',
  templateUrl: './configure-reporting-plugin.component.html',
  styleUrls: ['./configure-reporting-plugin.component.css']
})
export class ConfigureReportingPluginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: reportingPluginDummy) { }

  ngOnInit(): void {
  }

}
