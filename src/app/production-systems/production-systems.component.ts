import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {KVEntity, ProductionSystemEntity} from "iacmf-api";
import {CreateProductionSystemDialogComponent} from "./create-production-system-dialog/create-production-system-dialog.component";
import {MatTable} from "@angular/material/table";

// EXAMPLE DATA FOR THE UI MOCK
const ELEMENT_DATA: ProductionSystemEntity[] = [
  {
    id: 1,
    isDeleted: false,
    iacTechnologyName: "OpenTOSCA", description: "someProdSystem", properties: new Array<KVEntity>()
  },
  {
    id: 2,
    isDeleted: false,
    iacTechnologyName: "OpenTOSCA", description: "someProdSystem", properties: new Array<KVEntity>()
  }
]

@Component({
  selector: 'app-production-systems',
  templateUrl: './production-systems.component.html',
  styleUrls: ['./production-systems.component.css']
})
export class ProductionSystemsComponent implements OnInit {


  displayedColumns = ['id', 'isDeleted', 'iacTechnologyName'];
  dataSource = ELEMENT_DATA;
  @ViewChild(MatTable) table: MatTable<ProductionSystemEntity> | undefined;

  ngOnInit(): void {
  }

  constructor(public dialog: MatDialog) {
  }

  openNewSystemDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CreateProductionSystemDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.push(result.data)
      if (this.table != undefined) {
        this.table.renderRows();
      }

    });
  }

}
