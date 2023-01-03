import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  ComplianceIssueEntity,
  EntityModelKVEntity,
  KeyValueService,
  KVEntity,
  ProductionSystemEntity,
  ProductionSystemService
} from "iacmf-api";
import {Utils} from "../utils/utils";


@Component({
  selector: 'app-kv',
  templateUrl: './kv.component.html',
  styleUrls: ['./kv.component.css']
})
export class KvComponent implements OnInit {

  @Input("productionSystem") productionSystem: ProductionSystemEntity | undefined;
  @Input("keysValueEntitiesToCreate") keyNamesToCreate : Array<string> = [];
  @Input("keyValueEntitiesToConfigure") keyValueEntities : Array<KVEntity> = [];
  @Output("keyValueEntities") keyValueEntitiesEventEmitter = new EventEmitter();
  newKeyName: string = "";

  constructor(public kvService: KeyValueService) { }

  ngOnInit(): void {
    if (this.keyNamesToCreate.length != 0 && this.keyValueEntities.length != 0) {
      throw new Error("keysValueEntitiesToCreate or keyValueEntitiesToConfigure can be zero or each can have data, but not both")
    }

    if (this.productionSystem != undefined && this.keyNamesToCreate.length != 0 && this.keyValueEntities.length != 0) {
      throw new Error("If using a production system no keysValueEntitiesToCreate or keyValueEntitiesToConfigure is required")
    }

    this.keyNamesToCreate.forEach(key => this.storeKVEntity(key))

    this.loadKVEntityForProductionSystem(this.productionSystem);
  }

  loadKVEntityForProductionSystem(productionSystem: ProductionSystemEntity | undefined) {
    this.kvService.getCollectionResourceKventityGet1().subscribe(kv => console.log(kv));
  }

  storeKVEntity(key: string, value?: string, productionSystem? : string, complianceIssue?: string) {
    this.kvService.postCollectionResourceKventityPost({
      key: key,
      value: value,
      productionSystem: productionSystem,
      complianceIssue: complianceIssue
    }).subscribe(resp => {
      this.keyValueEntities.push(this.toKeyValueEntity(resp))
      this.emitKeyValueEntities()
    })
  }

  // seem elegant first to check when the user is finished typing and we can update the value,
  // however, it is actually brutal
  updateWhenStopped($event: any, kv : KVEntity) {
    setTimeout(() => {
      // to be a little more robust it would be better to check if there are indeed changes
      // e.g. like this:
      //if (!$event.target.value.includes(kv.value)) {
        this.updateKVEntity(kv)
      //}
    }, 2000);
  }

  public static linkKVEntitiesWithProductionSystem(kvEntities: KVEntity[], productionSystem: ProductionSystemEntity, kvService: KeyValueService, productionSystemService: ProductionSystemService) {
    kvEntities.forEach(kv => kvService.createPropertyReferenceKventityPut(String(kv.id), {
      _links: {
          productionSystem: {
            href: Utils.getLinkEntityProductionSystem(productionSystem, productionSystemService)
          }
      }
    }).subscribe(resp => console.log(resp)))

  }

  updateKVEntity(kv : KVEntity) {
    this.kvService.putItemResourceKventityPut(String(kv.id) , {
      key: kv.key,
      value: kv.value
    }).subscribe(resp => console.log(resp))
  }

  toKeyValueEntity(kvEntity : EntityModelKVEntity) : KVEntity {
    return {
      key: kvEntity.key,
      value: kvEntity.value,
      id: Number(Utils.getLinkKV(kvEntity).split("/").slice(-1)[0])
    }
  }

  emitKeyValueEntities() {
    this.keyValueEntitiesEventEmitter.emit(this.keyValueEntities)
  }

}
