import {Component, Inject, OnInit} from '@angular/core';
import {
  KVEntity,
  PluginPojo,
  PluginService,
  PluginUsageService,
  ProductionSystemEntity,
  ProductionSystemService
} from "iacmf-api";
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
  selectedCreationPluginIdentifier: string | undefined;
  kvEntities: Array<KVEntity> = [];

  constructor(public dialogRef: MatDialogRef<ConfigureProductionSystemDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ProductionSystemEntity, public pluginService: PluginService, public pluginUsageService: PluginUsageService, public utils: Utils, public productionSystemService: ProductionSystemService) {

  }

  ngOnInit(): void {
    this.pluginService.getAllPlugins("MODEL_CREATION").forEach(result => result.forEach(pojo => this.allCreationPlugins.push(pojo)));

    this.iacTechnologyName = this.data.iacTechnologyName
    if (this.data.description != undefined) {
      this.description = this.data.description
    }
    this.selectedCreationPluginIdentifier = this.data.modelCreationPluginUsage?.pluginIdentifier
    if (this.data.properties != undefined) {
      this.kvEntities = this.data.properties
    }
  }

  closeDialog() {

    if (this.selectedCreationPluginIdentifier == undefined) {
      throw new Error("A creation plugin must be selected")
    }

    if (this.data.id == undefined) {
      throw new Error("ProductionSystem is not persisted in the backend")
    }
    let pluginReq = {
      pluginIdentifier: this.selectedCreationPluginIdentifier
    }

    this.pluginUsageService.postCollectionResourcePluginusageentityPost(pluginReq).subscribe(resp => {
        let req = {
          iacTechnologyName: this.iacTechnologyName,
          isDeleted: this.data.isDeleted,
          description: this.description,
          properties: this.kvEntities.map((key: KVEntity) => this.utils.getLinkKV("self", key)).map(s => {
            // this is stupid, I know, you know, all know
            // but somehow using a filter is not working for the compiler...
            if (s == undefined) {
              return ""
            } else {
              return s
            }
          }),
          modelCreationPluginUsage: this.utils.getLinkPluginUsage("self", resp)
        }
        this.productionSystemService.putItemResourceProductionsystementityPut(String(this.data.id), req).subscribe(prod => {
          this.utils.linkKVEntitiesWithProductionSystem(this.kvEntities, prod)
          this.utils.linkPluginUsageWithProductionSystem(resp, prod)
          this.dialogRef.close({
            event: 'Closed', data: {
              id: this.data.id,
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
    )
  }

  updateKeyValueEntities($event: Array<KVEntity>) {
    this.kvEntities = $event;
  }
}
