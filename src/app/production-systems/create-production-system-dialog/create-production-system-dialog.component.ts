import {Component, Inject, OnInit} from '@angular/core';
import {KVEntity, ProductionSystemEntity} from "iacmf-api";
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

  constructor(public dialogRef: MatDialogRef<CreateProductionSystemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductionSystemEntity[]) {
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
        properties: this.properties
      }});
  }
}
