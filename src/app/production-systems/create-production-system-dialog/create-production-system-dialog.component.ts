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
  properties = new Array<KVEntity>;
  newPropName = "";
  allCreationPlugins = new Array<PluginPojo>();
  selectedCreationPluginIdentifier: string | undefined;

  constructor(public dialogRef: MatDialogRef<CreateProductionSystemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductionSystemEntity[],
              public pluginService: PluginService) {
    this.pluginService.getAllPlugins("MODEL_CREATION").forEach(result => result.forEach(pojo => this.allCreationPlugins.push(pojo)));
  }

  ngOnInit(): void {
  }

  createNewProperty() {
    this.properties.push({
      key: this.newPropName
    })
  }

  closeDialog(){
    this.dialogRef.close({event:'Closed', data: {
        iacTechnologyName: this.iacTechnologyName,
        isDeleted: false,
        description: this.description,
        properties: this.properties,
        modelCreationPluginUsage: {
          pluginIdentifier: this.selectedCreationPluginIdentifier
        }
      }});
  }

}
