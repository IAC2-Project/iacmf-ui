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
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CsarUploadReference} from "./CsarUploadRequest";
import {ServiceTemplateInstanceList} from "./ServiceTemplateInstanceList";
import {CsarList} from "./CsarList";
import {filter, Observable} from "rxjs";
import {filterToMembersWithDecorator} from "@angular/compiler-cli/src/ngtsc/reflection";


@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class TestUtils {

  csarName: string = "RealWorld-Application_Angular-Spring-MySQL-w1";
  wineryAppsHost: string = "192.168.0.239"
  wineryAppsPort: string = "8090"
  containerHost: string = "192.168.0.239"
  containerPort: string = "1337"
  appFrontendPort: string = "9001";
  appBackendPort: string = "9002";
  dockerEngineUrl: string = "tcp://host.docker.internal:2375";
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {

  }

  setupTestEnvironment() {
    this.getDeployedCSARs().subscribe(csars => {
      console.log("Fetched the following CSARs");
      console.log(csars)
      if (csars.csars != undefined && csars.csars.length != 0) {
        console.log("CSAR is already uploaded, fetching app instances")
        this.getAppInstances().subscribe(instances => {
          if (instances.service_template_instances.length == 0) {
            console.log("No app instance was available creating app instance")
            this.createAppInstance().subscribe(resp2 => {
              console.log("Started creating app instance")
              console.log(resp2)
            })
          } else {
            console.log("App instance was available")
          }
        })
      } else {
        console.log("Starting CSAR upload")
        this.uploadCSAR().subscribe(resp => {
          console.log("CSAR was uploaded")
          this.createAppInstance().subscribe(resp2 => {
            console.log("Starting to create app instance")
            console.log(resp2)
          })
        })
      }
    })

    return this.getAppInstances()
  }

  getDeployedCSARs() {
    let containerUrl = "http://" + this.containerHost + ":" + this.containerPort + "/csars";
    return this.http.get<CsarList>(containerUrl, {headers: this.headers})
  }

  uploadCSAR() {
    let containerUrl = "http://" + this.containerHost + ":" + this.containerPort + "/csars";
    let app: CsarUploadReference = {
      name: this.csarName,
      url: "http://" + this.wineryAppsHost + ":" + this.wineryAppsPort + "/winery/servicetemplates/http%253A%252F%252Fopentosca.org%252Fexample%252Fapplications%252Fservicetemplates/RealWorld-Application_Angular-Spring-MySQL-w1?csar",
      enrich: "false"
    }
    return this.http.post<string>(containerUrl, app, {headers: this.headers});
  }

  createAppInstance() {
    let postUrl = "http://" + this.containerHost + ":" + this.containerPort + "/csars/RealWorld-Application_Angular-Spring-MySQL-w1.csar/servicetemplates/RealWorld-Application_Angular-Spring-MySQL-w1/buildplans/RealWorld-Application_Angular-Spring-MySQL-w1_buildPlan/instances"

    let body = [{"name": "BackendPort", "type": "String", "required": true, "value": this.appBackendPort},
      {"name": "CorrelationID", "type": "String", "required": true},
      {"name": "csarEntrypoint", "type": "String", "required": true},
      {"name": "DockerUrl", "type": "String", "required": true, "value": this.dockerEngineUrl},
      {"name": "FrontendPort", "type": "String", "required": true, "value": this.appFrontendPort},
      {"name": "instanceDataAPIUrl", "type": "String", "required": true},
      {"name": "planCallbackAddress_invoker", "type": "String", "required": true}
    ]
    return this.http.post<string>(postUrl, body, {headers: this.headers});
  }

  getAppInstances() {
    let getUrl = "http://" + this.containerHost + ":" + this.containerPort + "/csars/RealWorld-Application_Angular-Spring-MySQL-w1.csar/servicetemplates/RealWorld-Application_Angular-Spring-MySQL-w1/instances"
    return this.http.get<ServiceTemplateInstanceList>(getUrl, {headers : this.headers})
  }
}
