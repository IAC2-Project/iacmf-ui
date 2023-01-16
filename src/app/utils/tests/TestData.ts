import {
  EntityModelComplianceRuleEntity,
  EntityModelKVEntity,
  EntityModelPluginUsageEntity,
  EntityModelProductionSystemEntity,
  KeyValueService,
  KVEntity,
  PluginUsageEntity, PluginUsageService,
  ProductionSystemEntity,
  ProductionSystemService, RepresentationModelObject
} from "iacmf-client";
import {Injectable} from "@angular/core";


@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class TestData {

  constructor() {

  }

  createUseCaseProductionSystem() : ProductionSystemEntity {
    return {
      iacTechnologyName: "opentoscacontainer",
      isDeleted: false,
      id: -1,
      description: "OpenTOSCA Use Case Production System",
      name: "RealWorld App Test",
      modelCreationPluginUsage: {
        id: -1,
        pluginIdentifier: "opentosca-container-model-creation-plugin"
      },
      properties: [{
        id: -1,
        key: "opentosca_hostname",
        value: "localhost"
      },{
        id: -1,
        key: "opentosca_port",
        value: "1337"
      },{
        id: -1,
        key: "opentosca_appId",
        value: "RealWorld-Application_Angular-Spring-MySQL-w1"
      },{
        id: -1,
        key: "opentosca_instanceId",
        value: "instanceId"
      },{
        id: -1,
        key: "dockerContainerFilter_opentoscaContainer",
        value: "opentosca/container:latest"
      },{
        id: -1,
        key: "dockerContainerFilter_engineBpmn",
        value: "opentosca/camunda-bpmn:latest"
      },{
        id: -1,
        key: "dockerContainerFilter_engineBpel",
        value: "opentosca/ode:latest"
      },{
        id: -1,
        key: "dockerContainerFilter_engineJava8",
        value: "opentosca/engine-ia:latest-jdk8"
      },{
        id: -1,
        key: "dockerContainerFilter_engineJava17",
        value: "opentosca/engine-ia:latest-jdk17"
      },{
        id: -1,
        key: "dockerContainerFilter_winery",
        value: "opentosca/winery:iac-compliance"
      },{
        id: -1,
        key: "dockerContainerFilter_mysql",
        value: "mysql"
      }]
    }
  }
}
