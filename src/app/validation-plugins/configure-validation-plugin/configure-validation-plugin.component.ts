import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {RefinementPluginDummy} from "../../refinement-plugins/refinement-plugins.component";
import {ValidationPluginDummy} from "../validation-plugins.component";

@Component({
  selector: 'app-configure-validation-plugin',
  templateUrl: './configure-validation-plugin.component.html',
  styleUrls: ['./configure-validation-plugin.component.css']
})
export class ConfigureValidationPluginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ValidationPluginDummy) { }

  ngOnInit(): void {
  }

}
