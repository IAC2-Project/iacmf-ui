import {
  EntityModelComplianceRuleEntity,
  EntityModelPluginUsageEntity,
  EntityModelProductionSystemEntity
} from "iacmf-api";

export class Utils {

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
