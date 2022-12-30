import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {KVEntity, ProductionSystemEntity, ProductionSystemService} from "iacmf-api";
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

  constructor(public dialog: MatDialog, public productionSystemService: ProductionSystemService) {
  }

  openNewSystemDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CreateProductionSystemDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration
    });

    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(result => {
      console.log(result);
      }
    )

    dialogRef.afterClosed().subscribe(result => {

      this.storeProductionSystem(result.data);

      this.dataSource.push(result.data)
      if (this.table != undefined) {
        this.table.renderRows();
      }

    });
  }

  storeProductionSystem(productionSystem : ProductionSystemEntity) {
    let req = {
      iacTechnologyName: productionSystem.iacTechnologyName,
      isDeleted: productionSystem.isDeleted,
      properties: productionSystem.properties?.map(kv => kv.key + ":" + kv.value),
      modelCreationPluginUsage: productionSystem.modelCreationPluginUsage?.pluginIdentifier
    }
    this.productionSystemService.postCollectionResourceProductionsystementityPost(req).subscribe(result => console.log(result));
  }

}
