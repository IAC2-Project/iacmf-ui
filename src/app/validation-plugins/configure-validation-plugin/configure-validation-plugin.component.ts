import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {PluginPojo} from "iacmf-client";



@Component({
  selector: 'app-configure-validation-plugin',
  templateUrl: './configure-validation-plugin.component.html',
  styleUrls: ['./configure-validation-plugin.component.css']
})
export class ConfigureValidationPluginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: PluginPojo) { }

  ngOnInit(): void {
  }

}
