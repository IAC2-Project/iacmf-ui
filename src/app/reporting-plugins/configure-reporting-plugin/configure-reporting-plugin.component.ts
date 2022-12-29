import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {PluginPojo} from "iacmf-api";

@Component({
  selector: 'app-configure-reporting-plugin',
  templateUrl: './configure-reporting-plugin.component.html',
  styleUrls: ['./configure-reporting-plugin.component.css']
})
export class ConfigureReportingPluginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: PluginPojo) { }

  ngOnInit(): void {
  }

}
