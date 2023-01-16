
import {Inject, Injectable} from "@angular/core";
import {
  EntityModelKVEntity,
  EntityModelPluginUsageEntity,
  EntityModelProductionSystemEntity,
  KeyValueService,
  PluginUsageService,
  ProductionSystemService, RepresentationModelObject
} from "iacmf-client";


@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class Utils {

  constructor(private kvEntityService: KeyValueService, private productionSystemService : ProductionSystemService, private pluginUsage: PluginUsageService) {

  }

  public linkPluginUsageWithProductionSystem(pluginUsage: EntityModelPluginUsageEntity, productionSystem: EntityModelProductionSystemEntity) {
    let body = {
      _links: {
        "productionSystem": {
          href: this.getLink("self", productionSystem)
        }
      }
    }
    let link = this.getLink("self",pluginUsage)
    if (link == undefined) {
      return
    }
    this.pluginUsage.createPropertyReferencePluginusageentityPatch4(String(this.getId(pluginUsage)), body).subscribe(resp => console.log(resp))
  }

  public linkKVEntitiesWithProductionSystem(kvEntities: EntityModelKVEntity[], productionSystem: EntityModelProductionSystemEntity) {
     kvEntities.forEach(kv => {
       this.productionSystemService.getItemResourceProductionsystementityGet(String(this.getId(productionSystem))).subscribe(resp => {
         let body = {
           _links: {
             "productionSystem": {
               href: this.getLink("self", resp)
             }
           }
         }
         this.kvEntityService.createPropertyReferenceKventityPut1(String(this.getId(kv)), body).subscribe(resp => console.log(resp))
       })
     })
  }

  public getLink(linkName: string, kv: RepresentationModelObject) : string {
    if (kv._links != undefined) {
      if (kv._links[linkName] != undefined) {
        if(kv._links[linkName].href != undefined) {
          let res = kv._links[linkName].href;
          if (res == undefined) {
            return ""
          } else {
            return res;
          }
        }
      }
    }
    return "";
  }

  public getId(modelObject: RepresentationModelObject) : String {
    return this.getLink("self", modelObject).split("/").slice(-1)[0];
  }
}
