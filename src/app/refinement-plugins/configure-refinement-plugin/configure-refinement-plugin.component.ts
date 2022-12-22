import {Component, Inject, OnInit} from '@angular/core';
import {RefinementPluginDummy} from "../refinement-plugins.component";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-configure-refinement-plugin',
  templateUrl: './configure-refinement-plugin.component.html',
  styleUrls: ['./configure-refinement-plugin.component.css']
})
export class ConfigureRefinementPluginComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: RefinementPluginDummy) { }

  ngOnInit(): void {
  }

}
