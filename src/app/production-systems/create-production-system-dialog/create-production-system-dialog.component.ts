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
import {MatFormFieldModule} from "@angular/material/form-field";
import {Utils} from "../../utils/utils";

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
              public pluginService: PluginService, public pluginUsageService: PluginUsageService, public utils: Utils, public productionSystemService: ProductionSystemService) {
    this.pluginService.getAllPlugins("MODEL_CREATION").forEach(result => result.forEach(pojo => this.allCreationPlugins.push(pojo)));
  }

  ngOnInit(): void {
  }

  closeDialog() {

    if (this.selectedCreationPluginIdentifier == undefined) {
      throw new Error("Must select creation plugin")
    }
    let pluginReq = {
      pluginIdentifier: this.selectedCreationPluginIdentifier
    }

    this.pluginUsageService.postCollectionResourcePluginusageentityPost(pluginReq).subscribe(resp => {
        let req = {
          iacTechnologyName: this.iacTechnologyName,
          isDeleted: false,
          description: this.description,
          properties: this.kvEntities.map((key: KVEntity) => this.utils.getLinkEntityKV(key)),
          modelCreationPluginUsage: this.utils.getLinkPluginUsage("self", resp)
        }
        this.productionSystemService.postCollectionResourceProductionsystementityPost(req).subscribe(prod => {
          // I'm gonna be honest here, it is not smooth
          // it would be easier if one could create an "empty" production service and then deliver the data from the dialog at once
          // now we have to create the KV entities out into the blue, and then link them
          this.utils.linkKVEntitiesWithProductionSystem(this.kvEntities, prod)
          this.utils.linkPluginUsageWithProductionSystem(resp, prod)
          this.dialogRef.close({
            event: 'Closed', data: {
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
