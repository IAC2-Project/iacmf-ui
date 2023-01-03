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


  displayedColumns = ['id', 'isDeleted', 'iacTechnologyName'];
  productionSystemEntities: ProductionSystemEntity[] = [];
  @ViewChild(MatTable) table: MatTable<ProductionSystemEntity> | undefined;

  ngOnInit(): void {
    this.refreshProductionSystems();
  }

  refreshProductionSystems() {
    this.productionSystemEntities = []
    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(result => {
        result._embedded?.productionSystemEntities?.forEach(data => {
          this.productionSystemEntities.push(this.utils.toProductionSystemEntity(data))
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


      if (result.data.modelCreationPluginUsage?.pluginIdentifier != undefined) {
        let pluginReq = {
          pluginIdentifier: result.data.modelCreationPluginUsage?.pluginIdentifier
        }

        this.pluginUsageService.postCollectionResourcePluginusageentityPost(pluginReq).subscribe(resp => {
            let req = {
              iacTechnologyName: result.data.iacTechnologyName,
              isDeleted: result.data.isDeleted,
              properties: result.data.properties?.map((key: KVEntity) => this.utils.getLinkEntityKV(key)),
              modelCreationPluginUsage: this.utils.getLinkPluginUsage(resp)
            }
            this.productionSystemService.postCollectionResourceProductionsystementityPost(req).subscribe(resp => {
              this.productionSystemEntities.push(this.utils.toProductionSystemEntity(resp))
              // I'm gonna be honest here, it is not smooth
              // it would be easier if one could create an "empty" production service and then deliver the data from the dialog at once
              // now we have to create the KV entities out into the blue, and then link them
              this.utils.linkKVEntitiesWithProductionSystem(result.data.properties, this.utils.toProductionSystemEntity(resp), this.kvEntityService, this.productionSystemService)
              this.refreshProductionSystems()
            });
          }
        )
      }

    });
  }


  openConfigureProductionSystemDialog(productionSystem: ProductionSystemEntity, enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ConfigureProductionSystemDialogComponent, {
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
              id: result.id,
              iacTechnologyName: result.data.iacTechnologyName,
              isDeleted: result.data.isDeleted,
              properties: result.data.properties?.map((key: KVEntity) => this.utils.getLinkEntityKV(key)),
              modelCreationPluginUsage: this.utils.getLinkPluginUsage(resp)
            }
            this.productionSystemService.putItemResourceProductionsystementityPut(result.id, req).subscribe(resp => {
              let index = this.productionSystemEntities.indexOf(productionSystem);
              // should actually never happen here...
              if (index != -1) {
                this.productionSystemEntities.splice(index, 1);
              }
              this.productionSystemEntities.push(this.utils.toProductionSystemEntity(resp))
            });
          }
        )
      }

    });
  }
}
