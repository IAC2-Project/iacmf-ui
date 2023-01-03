import {
  EntityModelComplianceRuleEntity, EntityModelKVEntity,
  EntityModelPluginUsageEntity,
  EntityModelProductionSystemEntity, KeyValueService, KVEntity, ProductionSystemEntity, ProductionSystemService
} from "iacmf-api";
import {Injectable} from "@angular/core";

@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class Utils {

  constructor(public kvEntityService: KeyValueService, public productionSystemService : ProductionSystemService) {

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

  public linkKVEntitiesWithProductionSystem(kvEntities: KVEntity[], productionSystem: ProductionSystemEntity, kvService: KeyValueService, productionSystemService: ProductionSystemService) {
    kvEntities.forEach(kv => kvService.createPropertyReferenceKventityPut1(String(kv.id), {
      _links: {
        "productionSystem": {
          href: this.getLinkEntityProductionSystem(productionSystem)
        }
      }
    }).subscribe(resp => console.log(resp)))
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

  public getLinkPluginUsage(entityModelPluginUsage : EntityModelPluginUsageEntity) {
    if (entityModelPluginUsage._links != undefined) {
      if (entityModelPluginUsage._links["self"] != undefined) {
        if(entityModelPluginUsage._links["self"].href != undefined) {
          return entityModelPluginUsage._links["self"].href;
        }
      }
    }
    return "";
  }

  public getLinkEntityProductionSystem(productionSystem: ProductionSystemEntity) {
    return this.productionSystemService.configuration.basePath + "/" + productionSystem.id;
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

  public toProductionSystemEntity(entityModelProductionSystemEntity : EntityModelProductionSystemEntity) {
    return {
      id: Number(this.getLinkProductionSystem(entityModelProductionSystemEntity).slice(-1)[0]),
      isDeleted: entityModelProductionSystemEntity.isDeleted,
      description: entityModelProductionSystemEntity.description,
      iacTechnologyName: entityModelProductionSystemEntity.iacTechnologyName,
      properties: this.getKVEntitiesForProductionSystem(entityModelProductionSystemEntity)
    }
  }

  public getKVEntitiesForProductionSystem(entityModelProductionSystemEntity: EntityModelProductionSystemEntity) : KVEntity[] {
    let res: KVEntity[] = []
    this.productionSystemService.followPropertyReferenceProductionsystementityGet21(this.getLinkProductionSystem(entityModelProductionSystemEntity).split("/").slice(-1)[0])
      .subscribe(resp => resp._embedded?.kVEntities?.forEach(kv => res.push(kv)))
    return res;
  }
}
