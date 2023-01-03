import {
  EntityModelComplianceRuleEntity, EntityModelKVEntity,
  EntityModelPluginUsageEntity,
  EntityModelProductionSystemEntity, KeyValueService, KVEntity, ProductionSystemEntity, ProductionSystemService
} from "iacmf-api";

export class Utils {

  public static getLinkEntityKV(kv : KVEntity, kvEntityService: KeyValueService) {
    return kvEntityService.configuration.basePath + "/" + kv.id;
  }

  public static getLinkKV(kv: EntityModelKVEntity) {
    if (kv._links != undefined) {
      if (kv._links["self"] != undefined) {
        if(kv._links["self"].href != undefined) {
          return kv._links["self"].href;
        }
      }
    }
    return "";
  }

  public static getLinkComplianceRule(complianceRule : EntityModelComplianceRuleEntity) {
    if (complianceRule._links != undefined) {
      if (complianceRule._links["self"] != undefined) {
        if(complianceRule._links["self"].href != undefined) {
          return complianceRule._links["self"].href;
        }
      }
    }
    return "";
  }

  public static getLinkPluginUsage(entityModelPluginUsage : EntityModelPluginUsageEntity) {
    if (entityModelPluginUsage._links != undefined) {
      if (entityModelPluginUsage._links["self"] != undefined) {
        if(entityModelPluginUsage._links["self"].href != undefined) {
          return entityModelPluginUsage._links["self"].href;
        }
      }
    }
    return "";
  }

  public static getLinkEntityProductionSystem(productionSystem: ProductionSystemEntity, productionSystemService: ProductionSystemService) {
    return productionSystemService.configuration.basePath + "/" + productionSystem.id;
  }

  public static getLinkProductionSystem(entityModelProductionSystemEntity : EntityModelProductionSystemEntity) {
    if (entityModelProductionSystemEntity._links != undefined) {
      if (entityModelProductionSystemEntity._links["self"] != undefined) {
        if(entityModelProductionSystemEntity._links["self"].href != undefined) {
          return entityModelProductionSystemEntity._links["self"].href;
        }
      }
    }
    return "";
  }
}
