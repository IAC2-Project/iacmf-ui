import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ComplianceJobEntity, KVEntity, ProductionSystemEntity} from "../gen";
import {CreateProductionSystemDialogComponent} from "./create-production-system-dialog/create-production-system-dialog.component";

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


  ngOnInit(): void {
  }
  displayedColumns = ['id', 'isDeleted', 'iacTechnologyName'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  openNewSystemDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateProductionSystemDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}
