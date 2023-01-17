import {
  ComplianceRuleConfigurationEntity,
  ComplianceRuleEntity,
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


  createUseCaseComplianceRules() : Array<ComplianceRuleConfigurationEntity> {
    return [{
      complianceRule:  {
        id: -1,
        name: "Unexpected Docker Containers Rule",
        description: "There shouldn't be Docker Containers running which are not reflected in the model",
        isDeleted: false,
        location: "http://localhost:8080/winery/compliancerules/http%253A%252F%252Fwww.example.org%252Ftosca%252Fcompliancerules/no-unexpected-docker-containers_w1-wip1",
        parameters: [{
          id: -1,
          name: "ENGINE_URL",
          type: "STRING"
        }],
        type: "subgraph-matching"
      },
      issueType: "UNEXPECTED_DOCKER_CONTAINERS",
      id: -1,
      complianceRuleParameterAssignments: [{
        id: -1,
        name: "ENGINE_URL",
        type: "STRING",
        value: "tcp://host.docker.internal:2375",
      }]
    }];
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
        key: "opentoscacontainer_hostname",
        value: "localhost"
      },{
        id: -1,
        key: "opentoscacontainer_port",
        value: "1337"
      },{
        id: -1,
        key: "opentoscacontainer_appId",
        value: "RealWorld-Application_Angular-Spring-MySQL-w1.csar"
      },{
        id: -1,
        key: "opentoscacontainer_instanceId",
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
