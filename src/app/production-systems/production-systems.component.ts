import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  EntityModelPluginUsageEntity, EntityModelProductionSystemEntity, KeyValueService,
  KVEntity,
  PluginUsageService,
  ProductionSystemEntity,
  ProductionSystemService
} from "iacmf-api";
import {CreateProductionSystemDialogComponent} from "./create-production-system-dialog/create-production-system-dialog.component";
import {MatTable} from "@angular/material/table";
import {Observable} from "rxjs";
import {Utils} from "../utils/utils";
import {ConfigureProductionSystemDialogComponent} from "./configure-production-system-dialog/configure-production-system-dialog.component";
import {KvComponent} from "../kv/kv.component";


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

  constructor(public dialog: MatDialog, public utils: Utils, public productionSystemService: ProductionSystemService, public pluginUsageService: PluginUsageService, public kvEntityService : KeyValueService) {

  }

  openCreateSystemDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CreateProductionSystemDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshProductionSystems()
    });
  }


  openConfigureProductionSystemDialog(productionSystem: EntityModelProductionSystemEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ConfigureProductionSystemDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      data: productionSystem
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshProductionSystems()
    });
  }
}
