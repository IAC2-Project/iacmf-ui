import { Component, OnInit } from '@angular/core';
import {ComplianceJobEntity, KVEntity, ProductionSystemEntity} from "../../gen";

@Component({
  selector: 'app-select-production-sytem',
  templateUrl: './select-production-sytem.component.html',
  styleUrls: ['./select-production-sytem.component.css']
})
export class SelectProductionSytemComponent implements OnInit {

   productionSystemEntities: ProductionSystemEntity[] = this.getDummyProductionSystemsData();

  selected = this.productionSystemEntities[0].id;

  constructor() { }

  ngOnInit(): void {
  }

  _filter(id: number | undefined) {
    return this.productionSystemEntities.filter(ps => ps.id == id);
  }

  getDummyProductionSystemsData() : ProductionSystemEntity[] {
    return [
      {
        id: 1,
        isDeleted: false,
        iacTechnologyName: "OpenTOSCA", description: "someProdSystem", properties: new Array<KVEntity>(),
      },
      {
        id: 2,
        isDeleted: false,
        iacTechnologyName: "OpenTOSCA", description: "someProdSystem", properties: new Array<KVEntity>(),
      }
    ];
  }
}
