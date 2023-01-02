import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  EntityModelPluginUsageEntity, EntityModelProductionSystemEntity,
  KVEntity,
  PluginUsageService,
  ProductionSystemEntity,
  ProductionSystemService
} from "iacmf-api";
import {CreateProductionSystemDialogComponent} from "./create-production-system-dialog/create-production-system-dialog.component";
import {MatTable} from "@angular/material/table";
import {Observable} from "rxjs";
import {Utils} from "../utils/utils";

// EXAMPLE DATA FOR THE UI MOCK
const ELEMENT_DATA: ProductionSystemEntity[] = []

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
    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(result => {
        result._embedded?.productionSystemEntities?.forEach(data => {
          this.dataSource.push(ProductionSystemsComponent.toProductionSystemEntity(data))
          if (this.table != undefined) {
            this.table.renderRows();
          }
        })
      }
    )
  }

  constructor(public dialog: MatDialog, public productionSystemService: ProductionSystemService, public pluginUsageService: PluginUsageService) {

  }

  openNewSystemDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CreateProductionSystemDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {


      if (result.data.modelCreationPluginUsage?.pluginIdentifier != undefined) {
        let pluginReq = {
          pluginIdentifier: result.data.modelCreationPluginUsage?.pluginIdentifier
        }

        this.pluginUsageService.postCollectionResourcePluginusageentityPost(pluginReq).subscribe(resp => {
            let req = {
              iacTechnologyName: result.data.iacTechnologyName,
              isDeleted: result.data.isDeleted,
              properties: result.data.properties?.map((key: any) => String(key)),
              modelCreationPluginUsage: Utils.getLinkPluginUsage(resp)
            }
            this.productionSystemService.postCollectionResourceProductionsystementityPost(req).subscribe(resp => {
              this.dataSource.push(ProductionSystemsComponent.toProductionSystemEntity(resp))
              if (this.table != undefined) {
                this.table.renderRows();
              }
            });
          }
        )
      }

    });
  }

  public static toProductionSystemEntity(entityModelProductionSystemEntity : EntityModelProductionSystemEntity) {
    return {
      id: Number(Utils.getLinkProductionSystem(entityModelProductionSystemEntity).slice(-1)[0]),
      isDeleted: entityModelProductionSystemEntity.isDeleted,
      description: entityModelProductionSystemEntity.description,
      iacTechnologyName: entityModelProductionSystemEntity.iacTechnologyName,
    }
  }


}
