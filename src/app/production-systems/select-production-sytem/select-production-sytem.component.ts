import { Component, OnInit } from '@angular/core';
import {ComplianceJobEntity, KVEntity, ProductionSystemEntity} from "../../gen";

@Component({
  selector: 'app-select-production-sytem',
  templateUrl: './select-production-sytem.component.html',
  styleUrls: ['./select-production-sytem.component.css']
})
export class SelectProductionSytemComponent implements OnInit {

   productionSystemEntities: ProductionSystemEntity[] = [
    {
      id: 1,
      isDeleted: false,
      iacTechnologyName: "OpenTOSCA", description: "someProdSystem", properties: new Array<KVEntity>(),
      complianceJobs: new Array<ComplianceJobEntity>(),
      modelCreationPluginId: "pluginName",
      modelEnhancementStrategy: {id: 1, pluginIdList: ["id1", "id2"]}
    },
    {
      id: 2,
      isDeleted: false,
      iacTechnologyName: "OpenTOSCA", description: "someProdSystem", properties: new Array<KVEntity>(),
      complianceJobs: new Array<ComplianceJobEntity>(),
      modelCreationPluginId: "pluginName",
      modelEnhancementStrategy: {id: 1, pluginIdList: ["id1", "id2"]}
    }
  ]

  selected = this.productionSystemEntities[0];

  constructor() { }

  ngOnInit(): void {
  }

}
