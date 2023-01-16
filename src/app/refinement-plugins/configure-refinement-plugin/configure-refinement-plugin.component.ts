import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {PluginPojo} from "iacmf-client";

@Component({
  selector: 'app-configure-refinement-plugin',
  templateUrl: './configure-refinement-plugin.component.html',
  styleUrls: ['./configure-refinement-plugin.component.css']
})
export class ConfigureRefinementPluginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: PluginPojo) { }

  ngOnInit(): void {
  }

}
