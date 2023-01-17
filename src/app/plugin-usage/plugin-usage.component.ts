import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ComplianceJobService,
  EntityModelComplianceJobEntity,
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
import { forkJoin, Observable, Subscription } from "rxjs";
import { PluginConfigurationEntityResponse } from 'iacmf-client/model/pluginConfigurationEntityResponse';

@Component({
  selector: 'app-plugin-usage',
  templateUrl: './plugin-usage.component.html',
  styleUrls: ['./plugin-usage.component.css']
})
export class PluginUsageComponent implements OnInit {

  @Input("canChangeIdentifier") canChangeIdentifier: boolean = true;
  @Input("showHeader") showHeader: boolean = true;
  @Input("pluginUsageId") pluginUsageId: number = -1;
  @Input("pluginType") pluginType = "";
  // for model creation plugin
  @Input("productionSystem") productionSystem: EntityModelProductionSystemEntity | undefined;
  // for model refinement plugin
  @Input("complianceJob") complianceJob: EntityModelComplianceJobEntity | undefined;
  @Output("selectedPluginIdentifierEvent") selectedPluginIdentifierEventEmitter = new EventEmitter();
  allPlugins = new Array<PluginPojo>();
  selectedPluginIdentifier: string = "";
  selectedPluginDescription: string | undefined = '';
  pluginUsage: EntityModelPluginUsageEntity = { pluginIdentifier: "" }
  pluginUsageConfigurations: Array<EntityModelPluginConfigurationEntity> = new Array<EntityModelPluginConfigurationEntity>();
  pluginUsageConfigurationDescriptors: Array<PluginConfigurationEntryDescriptor> | undefined = Array<PluginConfigurationEntryDescriptor>();

  entryType: typeof PluginConfigurationEntryDescriptor.TypeEnum = PluginConfigurationEntryDescriptor.TypeEnum;

  @Input("pluginUsageIdentifierSub") pluginUsageIdentifierSub: Observable<EntityModelPluginUsageEntity> | undefined;
  private pluginUsageIdentifierCreateEventsSubscription: Subscription | undefined;

  constructor(private pluginService: PluginService,
              private pluginUsageService: PluginUsageService,
              private utils: Utils, public pluginUsageConfigurationService: PluginConfigurationService,
              private productionSystemService: ProductionSystemService,
              private complianceJobService: ComplianceJobService) {
  }

  ngOnInit(): void {
    this.allPlugins = new Array<PluginPojo>();
    this.pluginService.getAllPlugins(this.pluginType).subscribe(result => result.forEach(pojo => this.allPlugins.push(pojo)));

    if (this.pluginUsageIdentifierSub != undefined) {
      this.pluginUsageIdentifierCreateEventsSubscription = this.pluginUsageIdentifierSub.subscribe((data: EntityModelPluginUsageEntity) => {
        this.selectedPluginIdentifier = data.pluginIdentifier
        this.pluginChanged()
      });
    }

    if (this.pluginUsageId != -1) {
      this.loadPluginUsage();
    } else if (this.productionSystem != undefined) {
      this.productionSystemService.followPropertyReferenceProductionsystementityGet1(String(this.utils.getId(this.productionSystem)))
        .subscribe(resp => {
          this.pluginUsageId = Number(this.utils.getId(resp));
          this.loadPluginUsage();
        })
    }

  }

  loadPluginUsage() {
    console.log("loading an existing plugin usage...");
    this.pluginUsageService.getItemResourcePluginusageentityGet(String(this.pluginUsageId)).subscribe(resp => {
      this.pluginUsage = resp;
      let pluginPojo = this.getCurrentPlugin();
      this.pluginUsageConfigurationDescriptors = pluginPojo?.configurationEntryNames;
      this.selectedPluginIdentifier = this.pluginUsage.pluginIdentifier;
      this.pluginUsageService.followPropertyReferencePluginusageentityGet41(String(this.pluginUsageId)).subscribe(resp2 => {
        // we already have configuration entries for all expected configuration entries. Load them!
        if (resp2._embedded?.pluginConfigurationEntities?.length === pluginPojo?.configurationEntryNames?.length) {
          console.log("All expected configurations already exist. Loading them now...");
          // maintain the order!
          pluginPojo?.configurationEntryNames?.forEach(descriptor => {
            resp2._embedded?.pluginConfigurationEntities
              ?.filter(entry => entry.key === descriptor.name)
              .forEach(configurationEntry => this.pluginUsageConfigurations.push(configurationEntry));
          });
          resp2._embedded?.pluginConfigurationEntities?.forEach(conf => this.pluginUsageConfigurations.push(conf));
        } else {
          console.log("Creating empty configurations...");
          this.createEmptyPluginConfigurationEntities();
        }
        this.emitPluginUsage();
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

  /**
   * This method creates empty plugin configuration entries for a plugin AND KEEPS THE CORRECT ORDER FOR THEM!
   */
  createEmptyPluginConfigurationEntities() {
    if (this.pluginUsageConfigurationDescriptors != undefined && this.pluginUsageConfigurationDescriptors.length > 0) {
      let requests = this.pluginUsageConfigurationDescriptors
        .map(descriptor => descriptor.name == undefined ? '' : descriptor.name)
        .map(name => this.pluginUsageConfigurationService.postCollectionResourcePluginconfigurationentityPost({
          id: -1,
          key: name,
          value: ''
        }));
      forkJoin(requests).subscribe(configurationEntries => {
        configurationEntries.forEach(configurationEntry => {
          this.pluginUsageConfigurations.push(configurationEntry);

          let body = {
            _links: {
              "pluginUsage": {
                href: this.utils.getLink("self", this.pluginUsage)
              }
            }
          };

          this.pluginUsageConfigurationService.createPropertyReferencePluginconfigurationentityPut(String(this.utils.getId(configurationEntry)), body).subscribe();

        });
      });
    }
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
      let currentPlugin = this.getCurrentPlugin();

      if (currentPlugin != null) {
        this.pluginUsageConfigurationDescriptors = currentPlugin.configurationEntryNames;
        this.selectedPluginDescription = currentPlugin.description;
        this.createEmptyPluginConfigurationEntities();
      }
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

  getCurrentPlugin(): PluginPojo | null {
    let temp = this.allPlugins.filter(plugin => plugin.identifier?.includes(this.pluginUsage.pluginIdentifier));

    if (temp.length > 0) {
      return temp[0];
    }

    return null;
  }

}
