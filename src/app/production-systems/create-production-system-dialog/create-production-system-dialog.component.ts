import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EntityModelKVEntity,
  EntityModelPluginUsageEntity,
  KVEntity,
  PluginService,
  PluginUsageService,
  ProductionSystemService
} from "iacmf-client";
import {  MatDialogRef } from "@angular/material/dialog";
import { TestData } from "../../utils/tests/TestData";
import { Utils } from "../../utils/utils";
import { Subject } from "rxjs";
import { PluginUsageComponent } from '../../plugin-usage/plugin-usage.component';

@Component({
  selector: 'app-create-production-system-dialog',
  templateUrl: './create-production-system-dialog.component.html',
  styleUrls: ['./create-production-system-dialog.component.css']
})
export class CreateProductionSystemDialogComponent implements OnInit {

  @ViewChild('pluginUsage', { static: false }) pluginUsageComponent: PluginUsageComponent | undefined;
  name = "";
  iacTechnologyName = "";
  description = "";
  selectedPluginUsage: EntityModelPluginUsageEntity | undefined;
  kvEntities: Array<EntityModelKVEntity> = [];

  // used to share events to the child components, for example emitting when the test data button was clicked and the
  // kv component needs updates
  shareNewKVEvents: Subject<EntityModelKVEntity> = new Subject<EntityModelKVEntity>();

  emitEventToChild(data: EntityModelKVEntity) {
    this.shareNewKVEvents.next(data);
  }

  shareNewPluginUsageEvents: Subject<EntityModelPluginUsageEntity> = new Subject<EntityModelPluginUsageEntity>();

  emitPluginUsageEventToChild(data: EntityModelPluginUsageEntity) {
    this.shareNewPluginUsageEvents.next(data);
  }

  constructor(public dialogRef: MatDialogRef<CreateProductionSystemDialogComponent>,
              public pluginService: PluginService,
              public pluginUsageService: PluginUsageService,
              public utils: Utils,
              public productionSystemService: ProductionSystemService,
              public testData: TestData) {
  }

  ngOnInit(): void {
  }

  fillTestData() {
    let testProdSytem = this.testData.createUseCaseProductionSystem();
    this.name = testProdSytem.name;
    this.iacTechnologyName = testProdSytem.iacTechnologyName;
    if (testProdSytem.description != undefined) {
      this.description = testProdSytem.description;
    }
    if (testProdSytem.modelCreationPluginUsage?.pluginIdentifier != undefined) {
      this.emitPluginUsageEventToChild({
        pluginIdentifier: testProdSytem.modelCreationPluginUsage?.pluginIdentifier
      });
    }
    this.selectedPluginUsage = testProdSytem.modelCreationPluginUsage
    testProdSytem.properties?.forEach(kv => this.emitEventToChild(kv))
  }

  closeDialog() {

    if (this.selectedPluginUsage == undefined) {
      throw new Error("Must select creation plugin")
    }

    this.pluginUsageComponent?.updateAllPluginConfigurations().subscribe(() => {
      console.log("Updated the plugin configuration entries!");
      // to make the stupid compiler shut up!
      if (this.selectedPluginUsage == undefined) {
        throw new Error("Must select creation plugin")
      }
      let req = {
        id: -1,
        name: this.name,
        iacTechnologyName: this.iacTechnologyName,
        isDeleted: false,
        description: this.description,
        properties: this.kvEntities.map((key: EntityModelKVEntity) => this.utils.getLink("self", key)),
        modelCreationPluginUsage: this.utils.getLink("self", this.selectedPluginUsage)
      }
      this.productionSystemService.postCollectionResourceProductionsystementityPost(req).subscribe(prod => {
        // I'm gonna be honest here, it is not smooth
        // it would be easier if one could create an "empty" production service and then deliver the data from the
        // dialog at once now we have to create the KV entities out into the blue, and then link them
        this.utils.linkKVEntitiesWithProductionSystem(this.kvEntities, prod)

        // dont ask me why we have to do this twice
        if (this.selectedPluginUsage == undefined) {
          throw new Error("Must select creation plugin");
        }

        this.utils.linkPluginUsageWithProductionSystem(this.selectedPluginUsage, prod);
        this.dialogRef.close({
          event: 'Closed', data: {
            iacTechnologyName: this.iacTechnologyName,
            isDeleted: false,
            description: this.description,
            properties: this.kvEntities,
            modelCreationPluginUsage: {
              pluginIdentifier: this.selectedPluginUsage
            }
          }
        });
      });
    });
  }

  updatePluginUsage($event: EntityModelPluginUsageEntity) {
    this.selectedPluginUsage = $event
  }

  updateKeyValueEntities($event: Array<KVEntity>) {
    this.kvEntities = $event;
  }
}
