import {Component, Inject, OnInit} from '@angular/core';
import {KVEntity, PluginPojo, PluginService, PluginUsageService, ProductionSystemEntity} from "iacmf-api";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
  selector: 'app-create-production-system-dialog',
  templateUrl: './create-production-system-dialog.component.html',
  styleUrls: ['./create-production-system-dialog.component.css']
})
export class CreateProductionSystemDialogComponent implements OnInit {

  iacTechnologyName = "";
  description = "";
  allCreationPlugins = new Array<PluginPojo>();
  selectedCreationPluginIdentifier: string | undefined;
  kvEntities: Array<KVEntity> = [];

  constructor(public dialogRef: MatDialogRef<CreateProductionSystemDialogComponent>,
              public pluginService: PluginService) {
    this.pluginService.getAllPlugins("MODEL_CREATION").forEach(result => result.forEach(pojo => this.allCreationPlugins.push(pojo)));
  }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close({event:'Closed', data: {
        iacTechnologyName: this.iacTechnologyName,
        isDeleted: false,
        description: this.description,
        properties: this.kvEntities,
        modelCreationPluginUsage: {
          pluginIdentifier: this.selectedCreationPluginIdentifier
        }
      }});
  }

  updateKeyValueEntities($event: Array<KVEntity>) {
    this.kvEntities = $event;
  }
}
