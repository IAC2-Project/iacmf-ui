import { Component, createComponent, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  EntityModelKVEntity,
  EntityModelPluginUsageEntity, EntityModelProductionSystemEntity,
  KVEntity,
  PluginService,
  PluginUsageService,
  ProductionSystemService
} from "iacmf-client";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TestData } from "../../utils/tests/TestData";
import { Utils } from "../../utils/utils";
import { Subject } from "rxjs";
import { PluginUsageComponent } from '../../plugin-usage/plugin-usage.component';
import { ProductionSystemEntityRequestBody } from 'iacmf-client/model/productionSystemEntityRequestBody';

@Component({
  selector: 'app-production-system-dialog',
  templateUrl: './production-system-dialog.component.html',
  styleUrls: ['./production-system-dialog.component.css']
})
export class ProductionSystemDialogComponent implements OnInit {

  @Input("creationMode") creationMode: boolean = true;
  @ViewChild('pluginUsage', { static: false }) pluginUsageComponent: PluginUsageComponent | undefined;
  name = "";
  iacTechnologyName = "";
  description = "";
  selectedPluginUsage: EntityModelPluginUsageEntity | undefined;
  kvEntities: Array<EntityModelKVEntity> = [];

  // used only when configuring an existing production system
  productionSystem: EntityModelProductionSystemEntity | undefined;

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

  constructor(public dialogRef: MatDialogRef<ProductionSystemDialogComponent>,
              public pluginService: PluginService,
              public pluginUsageService: PluginUsageService,
              public utils: Utils,
              public productionSystemService: ProductionSystemService,
              public testData: TestData,
              @Inject(MAT_DIALOG_DATA) public data: EntityModelProductionSystemEntity) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.creationMode = false;
      this.productionSystem = this.data;
      this.iacTechnologyName = this.productionSystem.iacTechnologyName;

      if (this.productionSystem.description != undefined) {
        this.description = this.productionSystem.description;
      }

      this.name = this.productionSystem.name;

      this.productionSystemService.followPropertyReferenceProductionsystementityGet1(String(this.utils.getId(this.productionSystem))).subscribe(usage => {
        this.selectedPluginUsage = usage;
      });

    }
  }

  fillTestData() {
    let testProdSystem = this.testData.createUseCaseProductionSystem();
    this.name = testProdSystem.name;
    this.iacTechnologyName = testProdSystem.iacTechnologyName;
    if (testProdSystem.description != undefined) {
      this.description = testProdSystem.description;
    }
    if (testProdSystem.modelCreationPluginUsage?.pluginIdentifier != undefined) {
      this.emitPluginUsageEventToChild({
        pluginIdentifier: testProdSystem.modelCreationPluginUsage?.pluginIdentifier
      });
    }
    this.selectedPluginUsage = testProdSystem.modelCreationPluginUsage
    testProdSystem.properties?.forEach(kv => this.emitEventToChild(kv))
  }

  closeDialog() {
    if (this.selectedPluginUsage == undefined) {
      throw new Error("Must select creation plugin")
    }

    this.pluginUsageComponent?.updateAllPluginConfigurations().subscribe(() => {
      // to make the stupid compiler shut up!
      if (this.selectedPluginUsage == undefined) {
        throw new Error("Must select creation plugin");
      }

      let req = {
        id: this.productionSystem ? Number(this.utils.getId(this.productionSystem)) : -1,
        name: this.name,
        iacTechnologyName: this.iacTechnologyName,
        isDeleted: this.productionSystem?.isDeleted != undefined ? this.productionSystem?.isDeleted : false,
        description: this.description,
        properties: this.kvEntities
          .map((key: EntityModelKVEntity) => this.utils.getLink("self", key))
          .filter(l => l !== undefined),
        modelCreationPluginUsage: this.utils.getLink("self", this.selectedPluginUsage)
      }

      console.debug(req);

      if (this.creationMode) {
        this.createNewProductionSystem(req);
      } else {
        this.updateExistingProductionSystem(req);
      }

    });
  }

  updateExistingProductionSystem(req: ProductionSystemEntityRequestBody) {
    this.productionSystemService.putItemResourceProductionsystementityPut(this.productionSystem ? String(this.utils.getId(this.productionSystem)) : "", req)
      .subscribe(prod => {
      // I'm gonna be honest here, it is not smooth
      // it would be easier if one could create an "empty" production service and then deliver the data from the
      // dialog at once now we have to create the KV entities out into the blue, and then link them
      this.utils.linkKVEntitiesWithProductionSystem(this.kvEntities, prod);

      this.dialogRef.close({
        event: 'Closed', data: {
          productionSystemId: this.productionSystem? this.utils.getId(this.productionSystem) : -1
        }
      });
    });
  }

  createNewProductionSystem(req: ProductionSystemEntityRequestBody) {
    this.productionSystemService.postCollectionResourceProductionsystementityPost(req).subscribe(prod => {
      // I'm gonna be honest here, it is not smooth
      // it would be easier if one could create an "empty" production service and then deliver the data from the
      // dialog at once now we have to create the KV entities out into the blue, and then link them
      this.utils.linkKVEntitiesWithProductionSystem(this.kvEntities, prod);

      // don't ask me why we have to do this twice
      if (this.selectedPluginUsage == undefined) {
        throw new Error("Must select creation plugin");
      }

      this.utils.linkPluginUsageWithProductionSystem(this.selectedPluginUsage, prod);

      this.dialogRef.close({
        event: 'Closed', data: {
          productionSystemId: this.utils.getId(prod)
        }
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
