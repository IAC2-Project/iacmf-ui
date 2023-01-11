import {
  EntityModelComplianceRuleEntity,
  EntityModelKVEntity,
  EntityModelPluginUsageEntity,
  EntityModelProductionSystemEntity,
  KeyValueService,
  KVEntity,
  PluginUsageEntity, PluginUsageService,
  ProductionSystemEntity,
  ProductionSystemService
} from "iacmf-api";
import {Injectable} from "@angular/core";

@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class Utils {

  constructor(public kvEntityService: KeyValueService, public productionSystemService : ProductionSystemService, public pluginUsage: PluginUsageService) {

  }

  public toComplianceRuleEntity(complianceRule : EntityModelComplianceRuleEntity) {
    return {
      id: Number(this.getLinkComplianceRule(complianceRule).split("/").slice(-1)[0]),
      type: complianceRule.type,
      location: complianceRule.location,
      description: complianceRule.description,
      isDeleted: complianceRule.isDeleted,
    }
  }

  toKeyValueEntity(kvEntity : EntityModelKVEntity) : KVEntity {
    return {
      key: kvEntity.key,
      value: kvEntity.value,
      id: Number(this.getLinkKV("self",kvEntity)?.split("/").slice(-1)[0])
    }
  }

  public linkPluginUsageWithProductionSystem(pluginUsage: EntityModelPluginUsageEntity, productionSystem: EntityModelProductionSystemEntity) {
    let body = {
      _links: {
        "productionSystem": {
          href: this.getLinkProductionSystem(productionSystem)
        }
      }
    }
    let link = this.getLinkPluginUsage("self",pluginUsage);
    if (link == undefined) {
      return
    }
    this.pluginUsage.createPropertyReferencePluginusageentityPatch4(link.split("/").slice(-1)[0], body).subscribe(resp => console.log(resp))
  }

  public getProductionSystemId(productionSystem : EntityModelProductionSystemEntity) : number {
    let res = this.toProductionSystemEntity(productionSystem).id;
    if (res == undefined) {
      throw Error("The id is missing of produciton system in database")
    } else {
      return res;
    }
  }

  public linkKVEntitiesWithProductionSystem(kvEntities: EntityModelKVEntity[], productionSystem: EntityModelProductionSystemEntity) {
     kvEntities.forEach(kv => {
       this.productionSystemService.getItemResourceProductionsystementityGet(String(this.getProductionSystemId(productionSystem))).subscribe(resp => {
         let link = this.getLinkKV("self",kv);
         if (link == undefined) {
           return
         }
         let body = {
           _links: {
             "productionSystem": {
               href: this.getLinkProductionSystem(resp)
             }
           }
         }
         this.kvEntityService.createPropertyReferenceKventityPut1(link.split("/").slice(-1)[0], body).subscribe(resp => console.log(resp))
       })
     })
  }

  public getLinkEntityKV(kv : KVEntity) {
    return this.kvEntityService.configuration.basePath + "/" + kv.id;
  }

  public getLinkKV(linkName: string, kv: EntityModelKVEntity) {
    if (kv._links != undefined) {
      if (kv._links[linkName] != undefined) {
        if(kv._links[linkName].href != undefined) {
          return kv._links[linkName].href;
        }
      }
    }
    return "";
  }

  public getLinkComplianceRule(complianceRule : EntityModelComplianceRuleEntity) {
    if (complianceRule._links != undefined) {
      if (complianceRule._links["self"] != undefined) {
        if(complianceRule._links["self"].href != undefined) {
          return complianceRule._links["self"].href;
        }
      }
    }
    return "";
  }

  public getLinkPluginUsage(linkName: string, entityModelPluginUsage : EntityModelPluginUsageEntity) {
    if (entityModelPluginUsage._links != undefined) {
      if (entityModelPluginUsage._links[linkName] != undefined) {
        if(entityModelPluginUsage._links[linkName].href != undefined) {
          return entityModelPluginUsage._links[linkName].href;
        }
      }
    }
    return "";
  }

  public getLinkProductionSystem(entityModelProductionSystemEntity : EntityModelProductionSystemEntity) {
    if (entityModelProductionSystemEntity._links != undefined) {
      if (entityModelProductionSystemEntity._links["self"] != undefined) {
        if(entityModelProductionSystemEntity._links["self"].href != undefined) {
          return entityModelProductionSystemEntity._links["self"].href;
        }
      }
    }
    return "";
  }

  public toProductionSystemEntity(entityModelProductionSystemEntity : EntityModelProductionSystemEntity) : ProductionSystemEntity {
    let data : ProductionSystemEntity = {
      id: Number(this.getLinkProductionSystem(entityModelProductionSystemEntity).slice(-1)[0]),
      isDeleted: entityModelProductionSystemEntity.isDeleted,
      description: entityModelProductionSystemEntity.description,
      iacTechnologyName: entityModelProductionSystemEntity.iacTechnologyName,
      properties: undefined,
      modelCreationPluginUsage: undefined
    }
    this.getPluginUsageForProductionSystem(entityModelProductionSystemEntity, data)
    this.getKVEntitiesForProductionSystem(entityModelProductionSystemEntity, data)
    return data
  }

  public getPluginUsageForProductionSystem(entityModelProductionSystemEntity: EntityModelProductionSystemEntity , data: ProductionSystemEntity) {
    this.productionSystemService.followPropertyReferenceProductionsystementityGet1(this.getLinkProductionSystem(entityModelProductionSystemEntity).split("/").slice(-1)[0]).subscribe(resp => data.modelCreationPluginUsage = resp);
  }

  public getKVEntitiesForProductionSystem(entityModelProductionSystemEntity: EntityModelProductionSystemEntity, data : ProductionSystemEntity) {
    this.productionSystemService.followPropertyReferenceProductionsystementityGet21(this.getLinkProductionSystem(entityModelProductionSystemEntity).split("/").slice(-1)[0])
      .subscribe(resp => resp._embedded?.kVEntities?.forEach(kv => {
        if (data.properties == undefined) {
          data.properties = new Array<KVEntity>()
        }
        data.properties.push(kv)
      }))
  }
}
