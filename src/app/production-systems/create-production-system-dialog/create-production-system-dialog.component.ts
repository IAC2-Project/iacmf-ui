import {Component, Inject, OnInit} from '@angular/core';
import {
  EntityModelKVEntity,
  EntityModelPluginUsageEntity,
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

  name = "";
  iacTechnologyName = "";
  description = "";
  selectedPluginUsage: EntityModelPluginUsageEntity | undefined;
  kvEntities: Array<KVEntity> = [];

  constructor(public dialogRef: MatDialogRef<CreateProductionSystemDialogComponent>,
              public pluginService: PluginService, public pluginUsageService: PluginUsageService, public utils: Utils, public productionSystemService: ProductionSystemService) {
  }

  ngOnInit(): void {
  }

  closeDialog() {

    if (this.selectedPluginUsage == undefined) {
      throw new Error("Must select creation plugin")
    }


    let req = {
      id: -1,
      name: this.name,
      iacTechnologyName: this.iacTechnologyName,
      isDeleted: false,
      description: this.description,
      properties: this.kvEntities.map((key: EntityModelKVEntity) => this.utils.getLink("self", key)),
      modelCreationPluginUsage: this.utils.getLink( "self", this.selectedPluginUsage)
    }
    this.productionSystemService.postCollectionResourceProductionsystementityPost(req).subscribe(prod => {
      // I'm gonna be honest here, it is not smooth
      // it would be easier if one could create an "empty" production service and then deliver the data from the dialog at once
      // now we have to create the KV entities out into the blue, and then link them
      this.utils.linkKVEntitiesWithProductionSystem(this.kvEntities, prod)

      // dont ask me why we have to do this twice
      if (this.selectedPluginUsage == undefined) {
        throw new Error("Must select creation plugin")
      }

      this.utils.linkPluginUsageWithProductionSystem(this.selectedPluginUsage, prod)
      this.dialogRef.close({
        event: 'Closed', data: {
          iacTechnologyName: this.iacTechnologyName,
          isDeleted: false,
          description: this.description,
          properties: this.kvEntities,
          modelCreationPluginUsage: {
            pluginIdentifier: this.selectedPluginUsage
          }
        }
      });
    });
  }

  updatePluginUsage($event: EntityModelPluginUsageEntity) {
    this.selectedPluginUsage = $event
  }

  updateKeyValueEntities($event: Array<KVEntity>) {
    this.kvEntities = $event;
  }
}
