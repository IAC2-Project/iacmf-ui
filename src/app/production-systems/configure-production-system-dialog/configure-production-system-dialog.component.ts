import {Component, Inject, OnInit} from '@angular/core';
import {
  EntityModelKVEntity, EntityModelPluginUsageEntity, EntityModelProductionSystemEntity,
  KVEntity,
  PluginPojo,
  PluginService,
  PluginUsageService,
  ProductionSystemEntity,
  ProductionSystemService
} from "iacmf-client";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-configure-production-system-dialog',
  templateUrl: './configure-production-system-dialog.component.html',
  styleUrls: ['./configure-production-system-dialog.component.css']
})
export class ConfigureProductionSystemDialogComponent implements OnInit {

  iacTechnologyName = "";
  description = "";
  allCreationPlugins = new Array<PluginPojo>();
  selectedCreationPluginIdentifier: EntityModelPluginUsageEntity | undefined;
  kvEntities: Array<EntityModelKVEntity> = [];

  constructor(public dialogRef: MatDialogRef<ConfigureProductionSystemDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: EntityModelProductionSystemEntity, public pluginService: PluginService, public pluginUsageService: PluginUsageService, public utils: Utils, public productionSystemService: ProductionSystemService) {

  }

  updatePluginUsage($event: EntityModelPluginUsageEntity) {
    this.selectedCreationPluginIdentifier = $event
  }

  ngOnInit(): void {
    this.iacTechnologyName = this.data.iacTechnologyName
    if (this.data.description != undefined) {
      this.description = this.data.description
    }
  }

  closeDialog() {

    if (this.selectedCreationPluginIdentifier == undefined) {
      throw new Error("A creation plugin must be selected")
    }

    if (this.utils.getId(this.data) == undefined) {
      throw new Error("ProductionSystem is not persisted in the backend")
    }

    let req = {
      id: -1,
      name: this.data.name,
      iacTechnologyName: this.iacTechnologyName,
      isDeleted: this.data.isDeleted,
      description: this.description,
      properties: this.kvEntities.map((key: EntityModelKVEntity) => this.utils.getLink("self", key)).map(s => {
        // this is stupid, I know, you know, all know
        // but somehow using a filter is not working for the compiler...
        if (s == undefined) {
          return ""
        } else {
          return s
        }
      }),
      modelCreationPluginUsage: this.utils.getLink("self", this.selectedCreationPluginIdentifier)
    }
    this.productionSystemService.putItemResourceProductionsystementityPut(String(this.utils.getId(this.data)), req).subscribe(prod => {
      this.dialogRef.close({
        event: 'Closed', data: {
          id: this.utils.getId(this.data),
          iacTechnologyName: this.iacTechnologyName,
          isDeleted: false,
          description: this.description,
          properties: this.kvEntities,
          modelCreationPluginUsage: {
            pluginIdentifier: this.selectedCreationPluginIdentifier
          }
        }
      });
    });


  }

  updateKeyValueEntities($event: Array<KVEntity>) {
    this.kvEntities = $event;
  }
}
