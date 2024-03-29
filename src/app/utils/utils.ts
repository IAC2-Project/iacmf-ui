import { Injectable } from "@angular/core";
import {
  EntityModelKVEntity,
  EntityModelPluginUsageEntity,
  EntityModelProductionSystemEntity,
  KeyValueService, PluginConfigurationService,
   PluginService,
  PluginUsageService,
  ProductionSystemService, RepresentationModelObject
} from "iacmf-client";
import { forkJoin, Observable, of, take } from 'rxjs';
import { EntityModelPluginConfigurationEntity } from 'iacmf-client/model/entityModelPluginConfigurationEntity';
import { map } from 'rxjs/operators';

@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class Utils {


  constructor(private kvEntityService: KeyValueService,
              private productionSystemService: ProductionSystemService,
              private pluginUsage: PluginUsageService,
              private pluginConfigurationService: PluginConfigurationService,
              private pluginService: PluginService) {

  }

  /**
   * Removes a given plugin usage and all attached configuration entries
   * @param pluginUsageId the id of the plugin usage to be removed
   */
  public removePluginUsage(pluginUsageId: string): Observable<any> {
    return new Observable<any>((observer) => {
      // let's remove the attached plugin configurations first
      this.pluginUsage.followPropertyReferencePluginusageentityGet51(pluginUsageId)
        .subscribe(configurations => {
          // prepare delete requests for all configuration entries
          // @ts-ignore
          let deleteRequests = configurations._embedded?.pluginConfigurationEntities?.map((configuration: EntityModelPluginConfigurationEntity) =>
            this.pluginConfigurationService.deleteItemResourcePluginconfigurationentityDelete(String(this.getId(configuration))));
          // if we do have requests, execute them all, and wait until all are done, then remove the plugin usage
          if (deleteRequests != undefined && deleteRequests.length > 0) {
            console.info("removing attached plugin configurations...");
            forkJoin(deleteRequests).subscribe(() => this.pluginUsage.deleteItemResourcePluginusageentityDelete(pluginUsageId).subscribe(() => {
              observer.next();
              observer.complete();
            }));
          } else {
            // no configurations exist. remove the plugin usage immediately.
            this.pluginUsage.deleteItemResourcePluginusageentityDelete(pluginUsageId).subscribe(() => {
              observer.next();
              observer.complete();
            });
          }
        });
    });
  }

  public linkPluginUsageWithProductionSystem(pluginUsage: EntityModelPluginUsageEntity, productionSystem: EntityModelProductionSystemEntity) {
    let body = {
      _links: {
        "productionSystem": {
          href: this.getLink("self", productionSystem)
        }
      }
    }
    let link = this.getLink("self", pluginUsage)
    if (link == undefined) {
      return
    }
    this.pluginUsage.createPropertyReferencePluginusageentityPut4(String(this.getId(pluginUsage)), body).subscribe(resp => console.log(resp))
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
        this.kvEntityService.createPropertyReferenceKventityPut1(String(this.getId(kv)), body).subscribe();
      })
    })
  }

  public getLink(linkName: string, kv: RepresentationModelObject): string {
    if (kv._links != undefined) {
      if (kv._links[linkName] != undefined) {
        if (kv._links[linkName].href != undefined) {
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

  public getId(modelObject: RepresentationModelObject): string {
    return this.getLink("self", modelObject).split("/").slice(-1)[0];
  }
}
