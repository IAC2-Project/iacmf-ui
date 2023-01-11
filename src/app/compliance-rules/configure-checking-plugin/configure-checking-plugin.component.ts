import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {IssueFixingConfigurationEntity, PluginPojo} from "iacmf-api";

@Component({
  selector: 'app-configure-checking-plugin',
  templateUrl: './configure-checking-plugin.component.html',
  styleUrls: ['./configure-checking-plugin.component.css']
})
export class ConfigureCheckingPluginComponent implements OnInit {


  @Output("checkingPluginConfiguration") checkingPluginConfiguration = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: PluginPojo) {

  }


  ngOnInit(): void {

  }


}
