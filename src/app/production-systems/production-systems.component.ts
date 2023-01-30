import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  EntityModelProductionSystemEntity, KeyValueService,
  PluginUsageService,
  ProductionSystemService
} from "iacmf-client";
import { Utils } from "../utils/utils";
import {
  ProductionSystemDialogComponent
} from './production-system-dialog/production-system-dialog.component';

@Component({
  selector: 'app-production-systems',
  templateUrl: './production-systems.component.html',
  styleUrls: ['./production-systems.component.css']
})
export class ProductionSystemsComponent implements OnInit {

  productionSystemEntities: EntityModelProductionSystemEntity[] = [];
  prodToKVMap: any = {};

  ngOnInit(): void {
    this.refreshProductionSystems();
  }

  refreshProductionSystems() {
    this.productionSystemEntities = []
    this.prodToKVMap = {};
    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(result => {
        result._embedded?.productionSystemEntities?.forEach(data => {
          this.productionSystemEntities.push(data)
        })
      }
    )
  }

  constructor(public dialog: MatDialog, public utils: Utils, public productionSystemService: ProductionSystemService, public pluginUsageService: PluginUsageService, public kvEntityService: KeyValueService) {

  }

  openCreateSystemDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "70%";
    matDialogConfig.enterAnimationDuration = enterAnimationDuration;
    matDialogConfig.exitAnimationDuration = exitAnimationDuration;
    const dialogRef = this.dialog.open(ProductionSystemDialogComponent, matDialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.refreshProductionSystems();
    });
  }

  openConfigureProductionSystemDialog(productionSystem: EntityModelProductionSystemEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "70%";
    matDialogConfig.enterAnimationDuration = enterAnimationDuration;
    matDialogConfig.exitAnimationDuration = exitAnimationDuration;
    matDialogConfig.data = productionSystem;
    const dialogRef = this.dialog.open(ProductionSystemDialogComponent, matDialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.refreshProductionSystems();
    });
  }
}
