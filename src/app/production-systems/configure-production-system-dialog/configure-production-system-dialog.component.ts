import {Component, Inject, OnInit} from '@angular/core';
import {KVEntity, PluginPojo, PluginService, PluginUsageService, ProductionSystemEntity} from "iacmf-api";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-configure-production-system-dialog',
  templateUrl: './configure-production-system-dialog.component.html',
  styleUrls: ['./configure-production-system-dialog.component.css']
})
export class ConfigureProductionSystemDialogComponent implements OnInit {

  iacTechnologyName = "";
  description = "";
  allCreationPlugins = new Array<PluginPojo>();
  selectedCreationPluginIdentifier: string | undefined;
  kvEntities: Array<KVEntity> = [];

  constructor(public dialogRef: MatDialogRef<ConfigureProductionSystemDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: ProductionSystemEntity, public pluginService: PluginService) {
    this.pluginService.getAllPlugins("MODEL_CREATION").forEach(result => result.forEach(pojo => this.allCreationPlugins.push(pojo)));

    this.iacTechnologyName = data.iacTechnologyName
    if (data.description != undefined) {
      this.description = data.description
    }
    this.selectedCreationPluginIdentifier = data.modelCreationPluginUsage?.pluginIdentifier
    if (data.properties != undefined) {
      this.kvEntities = data.properties
    }
  }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close({event:'Closed', data: {
        id: this.data.id,
        iacTechnologyName: this.iacTechnologyName,
        isDeleted: false,
        description: this.description,
        properties: this.kvEntities,
        modelCreationPluginUsage: {
          pluginIdentifier: this.selectedCreationPluginIdentifier
        }
      }});
  }
}
