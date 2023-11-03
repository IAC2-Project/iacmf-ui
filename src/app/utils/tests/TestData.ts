import {
  ComplianceRuleConfigurationEntity,
  ComplianceRuleEntity,
  EntityModelComplianceRuleEntity,
  EntityModelKVEntity,
  EntityModelPluginUsageEntity,
  EntityModelProductionSystemEntity,
  KeyValueService,
  KVEntity, PluginConfigurationEntity,
  PluginUsageEntity, PluginUsageService,
  ProductionSystemEntity,
  ProductionSystemService, RepresentationModelObject
} from "iacmf-client";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";


@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class TestData {

  constructor() {

  }

  getTestDataForPlugin(pluginId: string | undefined): Map<string, PluginConfigurationEntity> | null {
    if (pluginId) {
      if (pluginId === "bash-refinement-plugin") {
        return this.createVmUseCaseRefinementPlugin();
      } else if (pluginId === "bash-fixing-plugin") {
        return this.createVmUseCaseFixingPlugin();
      } else if (pluginId === "smtp-email-sending-plugin") {
        return this.createEmailPlugin();
      }
    }

    return null;
  }

  createVmUseCaseFixingPlugin(): Map<string, PluginConfigurationEntity> {
    const map: Map<string, PluginConfigurationEntity> = new Map();
    map.set("script", {
      id: -1,
      key: "script",
      value: "sudo sed -i -e 's/\\s*nullok\\s*/ /g' /etc/pam.d/common-password"
    }).set("username", {
      id: -1,
      key: "username",
      value: "ubuntu"
    });

    return map;
  }

  createEmailPlugin(): Map<string, PluginConfigurationEntity> {
    const map: Map<string, PluginConfigurationEntity> = new Map();
    map.set("to", {
      id: -1,
      key: "to",
      value: "ghareeb.falazi@hotmail.com"
    }).set("smtp-host", {
      id: -1,
      key: "smtp-host",
      value: "smtp.gmail.com"
    }).set("smtp-tsl-starttsl-port", {
      id: -1,
      key: "smtp-tsl-starttsl-port",
      value: "587"
    });

    return map;
  }

  createVmUseCaseRefinementPlugin(): Map<string, PluginConfigurationEntity> {
    const map: Map<string, PluginConfigurationEntity> = new Map();
    map.set("script", {
      id: -1,
      key: "script",
      value: "[[ ! -z $(sudo grep nullok /etc/pam.d/common-password) ]] && echo 'true' || echo 'false'"
    }).set("username", {
      id: -1,
      key: "username",
      value: "ubuntu"
    }).set("output_property_name", {
      id: -1,
      key: "output_property_name",
      value: "nullok"
    }).set("output_property_type", {
      id: -1,
      key: "output_property_type",
      value: "BOOLEAN"
    }).set("ignore-missing-properties", {
      id: -1,
      key: "ignore-missing-properties",
      value: "false"
    });

    return map;
  }


  createUseCaseComplianceRules(): Array<ComplianceRuleConfigurationEntity> {
    return [{
      complianceRule: {
        id: -1,
        name: "Unexpected Docker Containers Rule",
        description: "There shouldn't be Docker Containers running which are not reflected in the model",
        isDeleted: false,
        location: `http://${environment.basehostname}:8080/#/compliancerules/http%253A%252F%252Fwww.example.org%252Ftosca%252Fcompliancerules/no-unexpected-docker-containers_w1-wip1/readme`,
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

  createUseCaseProductionSystem(): ProductionSystemEntity {
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
        value: `${environment.basehostname}`
      }, {
        id: -1,
        key: "opentoscacontainer_port",
        value: "1337"
      }, {
        id: -1,
        key: "opentoscacontainer_appId",
        value: "RealWorld-Application_Angular-Spring-MySQL-w2-wip1.csar" +
          ""
      }, {
        id: -1,
        key: "opentoscacontainer_instanceId",
        value: "instanceId"
      }, {
        id: -1,
        key: "dockerContainerFilter_opentoscaContainer",
        value: "opentosca/container:latest"
      }, {
        id: -1,
        key: "dockerContainerFilter_engineBpmn",
        value: "opentosca/camunda-bpmn:latest"
      }, {
        id: -1,
        key: "dockerContainerFilter_engineBpel",
        value: "opentosca/ode:latest"
      }, {
        id: -1,
        key: "dockerContainerFilter_containerUi",
        value: "opentosca/ui:latest"
      },{
        id: -1,
        key: "dockerContainerFilter_engineJava8",
        value: "opentosca/engine-ia:latest-jdk8"
      }, {
        id: -1,
        key: "dockerContainerFilter_engineJava17",
        value: "opentosca/engine-ia:latest-jdk17"
      }, {
        id: -1,
        key: "dockerContainerFilter_winery",
        value: "opentosca/winery"
      }, {
        id: -1,
        key: "dockerContainerFilter_mysql",
        value: "mysql"
      }, {
        id: -1,
        key: "dockerContainerFilter_iacmfBackend",
        value: "case-study-iacmf-backend"
      },{
        id: -1,
        key: "dockerContainerFilter_iacmfFrontend",
        value: "case-study-iacmf-frontend"
      }]
    }
  }
}
