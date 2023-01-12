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
  @Input("keyValueEntitiesToConfigure") keyValueEntities : Array<EntityModelKVEntity> = [];
  @Output("keyValueEntities") keyValueEntitiesEventEmitter = new EventEmitter();
  newKeyName: string = "";

  constructor(public kvService: KeyValueService, public utils: Utils, public productionSystemService: ProductionSystemService) { }

  ngOnInit(): void {
    if (this.keyNamesToCreate.length != 0 && this.keyValueEntities.length != 0) {
      throw new Error("keysValueEntitiesToCreate or keyValueEntitiesToConfigure can be zero or each can have data, but not both")
    }

    if (this.productionSystem != undefined && this.keyNamesToCreate.length != 0 && this.keyValueEntities.length != 0) {
      throw new Error("If using a production system no keysValueEntitiesToCreate or keyValueEntitiesToConfigure is required")
    }

    this.keyNamesToCreate.forEach(key => this.storeKVEntity(key))

    if (this.productionSystem != undefined) {
      this.loadKVEntityForProductionSystem(this.productionSystem);
    }
  }

  loadKVEntityForProductionSystem(productionSystem: ProductionSystemEntity) {
    if (productionSystem.id == undefined) {
      throw new Error("Please load KV Map with persistet production system entity")
    }
    this.keyValueEntities = []
    this.productionSystemService.followPropertyReferenceProductionsystementityGet21(String(productionSystem.id)).subscribe( resp => {
      resp._embedded?.kVEntities?.forEach(kv => {
        this.keyValueEntities.push(kv);
      })
      this.emitKeyValueEntities()
    })
  }

  storeKVEntity(key: string, value?: string, productionSystem? : string, complianceIssue?: string) {
    this.kvService.postCollectionResourceKventityPost({
      id: -1,
      key: key,
      value: value,
      productionSystem: productionSystem,
      complianceIssue: complianceIssue
    }).subscribe(resp => {
      this.keyValueEntities.push(resp)
      this.emitKeyValueEntities()
    })
  }

  // seem elegant first to check when the user is finished typing and we can update the value,
  // however, it is actually brutal
  updateWhenStopped($event: any, kv : EntityModelKVEntity) {
    setTimeout(() => {
      // to be a little more robust it would be better to check if there are indeed changes
      // e.g. like this:
      //if (!$event.target.value.includes(kv.value)) {
        this.updateKVEntity(kv)
      //}
    }, 2000);
  }



  updateKVEntity(kv : EntityModelKVEntity) {
    let link = this.utils.getLink("self", kv);
    if (link == undefined) {
      throw Error("Can't update KV when it is not a stored entity")
    }
    this.kvService.putItemResourceKventityPut(link.split("/").slice(-1)[0] , {
      id: Number(this.utils.getId(kv)),
      key: kv.key,
      value: kv.value
    }).subscribe(resp => this.emitKeyValueEntities())
  }

  emitKeyValueEntities() {
    this.keyValueEntitiesEventEmitter.emit(this.keyValueEntities)
  }

}
