import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EntityModelKVEntity,
  EntityModelPluginConfigurationEntity,
  EntityModelPluginUsageEntity, EntityModelProductionSystemEntity,
  KVEntity,
  PluginConfigurationEntity,
  PluginConfigurationEntryDescriptor,
  PluginConfigurationService,
  PluginPojo,
  PluginService,
  PluginUsageEntity,
  PluginUsageService,
  ProductionSystemService
} from "iacmf-client";
import { Utils } from "../utils/utils";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-plugin-usage',
  templateUrl: './plugin-usage.component.html',
  styleUrls: ['./plugin-usage.component.css']
})
export class PluginUsageComponent implements OnInit {

  @Input("pluginUsageId") pluginUsageId: number = -1;
  @Input("pluginType") pluginType = "";
  @Input("productionSystem") productionSystem: EntityModelProductionSystemEntity | undefined
  allPlugins = new Array<PluginPojo>();
  selectedPluginIdentifier: string = "";
  pluginUsage: EntityModelPluginUsageEntity = { pluginIdentifier: "" }
  pluginUsageConfigurations: Array<EntityModelPluginConfigurationEntity> = new Array<EntityModelPluginConfigurationEntity>();
  newKeyName: string = "";

  @Input("pluginUsageIdentifierSub") pluginUsageIdentifierSub: Observable<EntityModelPluginUsageEntity> | undefined;
  private pluginUsageIdentifierCreateEventsSubscription: Subscription | undefined;

  @Output("selectedPluginIdentifierEvent") selectedPluginIdentifierEventEmitter = new EventEmitter()

  constructor(public pluginService: PluginService, public pluginUsageService: PluginUsageService, public utils: Utils, public pluginUsageConfigurationService: PluginConfigurationService, public productionSystemService: ProductionSystemService) {
  }

  ngOnInit(): void {
    this.allPlugins = new Array<PluginPojo>();
    this.pluginService.getAllPlugins(this.pluginType).subscribe(result => result.forEach(pojo => this.allPlugins.push(pojo)));

    if (this.pluginUsageId != -1) {
      this.loadPluginUsage();
    }

    if (this.pluginUsageIdentifierSub != undefined) {
      this.pluginUsageIdentifierCreateEventsSubscription = this.pluginUsageIdentifierSub.subscribe((data: EntityModelPluginUsageEntity) => {
        this.selectedPluginIdentifier = data.pluginIdentifier
        this.pluginChanged()
      });
    }

    if (this.productionSystem != undefined) {
      this.productionSystemService.followPropertyReferenceProductionsystementityGet1(String(this.utils.getId(this.productionSystem))).subscribe(resp => {
        this.pluginUsageId = Number(this.utils.getId(resp));
        this.loadPluginUsage();
      })
    }

  }

  loadPluginUsage() {
    this.pluginUsageService.getItemResourcePluginusageentityGet(String(this.pluginUsageId)).subscribe(resp => {
      this.pluginUsage = resp
      this.selectedPluginIdentifier = this.pluginUsage.pluginIdentifier
      this.pluginUsageService.followPropertyReferencePluginusageentityGet41(String(this.pluginUsageId)).subscribe(resp2 => {
        resp2._embedded?.pluginConfigurationEntities?.forEach(conf => this.pluginUsageConfigurations.push(conf))
        this.emitPluginUsage()
      })
    })
  }

  ngOnDestroy() {
    if (this.pluginUsageIdentifierCreateEventsSubscription != undefined) {
      this.pluginUsageIdentifierCreateEventsSubscription.unsubscribe();
    }
  }

  emitPluginUsage() {
    this.selectedPluginIdentifierEventEmitter.emit(this.pluginUsage)
  }

  storePluginConfigurationEntity(conf: PluginConfigurationEntryDescriptor, key: string, value: string) {
    if (conf.name == undefined) {
      throw new Error("Plugin Configuration has no key")
    }
    this.pluginUsageConfigurationService.postCollectionResourcePluginconfigurationentityPost({
      id: -1,
      key: conf.name,
      value: ""
    }).subscribe(resp => {
      let body = {
        _links: {
          "pluginUsage": {
            href: this.utils.getLink("self", this.pluginUsage)
          }
        }
      }
      this.pluginUsageConfigurationService.createPropertyReferencePluginconfigurationentityPut(String(this.utils.getId(resp)), body).subscribe(resp2 => {
        this.pluginUsageConfigurations.push(resp)
      })
    })

  }

  // seem elegant first to check when the user is finished typing and we can update the value,
  // however, it is actually brutal
  updateWhenStopped($event: any, pluginConfigurationEntity: EntityModelPluginConfigurationEntity) {
    setTimeout(() => {
      // to be a little more robust it would be better to check if there are indeed changes
      // e.g. like this:
      //if (!$event.target.value.includes(kv.value)) {
      // but this doesn't seem to work as expected
      this.updatePluginConfigurationEntity(pluginConfigurationEntity)
      //}
    }, 2000);
  }

  pluginChanged() {

    this.pluginUsageService.postCollectionResourcePluginusageentityPost({
      pluginIdentifier: this.selectedPluginIdentifier,
      id: -1
    }).subscribe(resp => {
      this.pluginUsage = resp
      this.pluginUsageConfigurations = new Array<EntityModelPluginConfigurationEntity>();
      this.allPlugins.filter(plugin => plugin.identifier?.includes(this.pluginUsage.pluginIdentifier)).forEach(plugin => plugin.configurationEntryNames?.forEach(entry => {
        this.storePluginConfigurationEntity(entry, "", "")
      }))
      this.emitPluginUsage()
    })
  }

  updatePluginConfigurationEntity(pluginConfigurationEntity: EntityModelPluginConfigurationEntity) {
    this.pluginUsageConfigurationService.putItemResourcePluginconfigurationentityPut(String(this.utils.getId(pluginConfigurationEntity)), {
      id: Number(this.utils.getId(pluginConfigurationEntity)),
      key: pluginConfigurationEntity.key,
      value: pluginConfigurationEntity.value
    }).subscribe(resp => console.log(resp))
  }

  readable(word: string): string {
    return word.split('_').map(part => part[0].toUpperCase() + part.slice(1).toLowerCase()).join(' ');
  }
}
