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
import { forkJoin, Observable, of, Subscription } from "rxjs";
import { PluginConfigurationEntityResponse } from 'iacmf-client/model/pluginConfigurationEntityResponse';
import { getMatIconNameNotFoundError } from '@angular/material/icon';

@Component({
  selector: 'app-plugin-usage',
  templateUrl: './plugin-usage.component.html',
  styleUrls: ['./plugin-usage.component.css']
})
export class PluginUsageComponent implements OnInit {

  @Input("canChangeIdentifier") canChangeIdentifier: boolean = true;
  @Input("showHeader") showHeader: boolean = true;
  @Input("pluginUsageId") pluginUsageId: number = -1;
  @Input("pluginIdentifier") pluginIdentifier: string | undefined;
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
        this.pluginIdentifierChanged();
      });
    }

    if (this.pluginUsageId != -1) {
      this.loadPluginUsage();
    } else if (this.productionSystem != undefined) {
      this.productionSystemService.followPropertyReferenceProductionsystementityGet1(String(this.utils.getId(this.productionSystem)))
        .subscribe(resp => {
          this.pluginUsageId = Number(this.utils.getId(resp));
          this.loadPluginUsage();
        });
    } else if(this.pluginIdentifier) {
      this.selectedPluginIdentifier = this.pluginIdentifier;
      this.createNewPluginUsage();
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
    this.selectedPluginIdentifierEventEmitter.emit(this.pluginUsage);
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

  pluginIdentifierChanged() {
    if (this.getCurrentPlugin() != null) {
      this.utils.removePluginUsage(this.pluginUsage.pluginIdentifier).subscribe();
    }

    this.createNewPluginUsage();
  }

  createNewPluginUsage() {
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
      this.emitPluginUsage();
    });
  }

  public updateAllPluginConfigurations() {
    console.log("updating ", this.pluginUsageConfigurations.length, " configuration entries...");

    if (this.pluginUsageConfigurations.length > 0) {
      let invocations = new Array<Observable<EntityModelPluginConfigurationEntity>>();
      this.pluginUsageConfigurations.forEach(c => {
        invocations.push(this.updatePluginConfigurationEntity(c));
      });

      return forkJoin(invocations);
    } else  {
      return of([]);
    }
  }
  updatePluginConfigurationEntity(pluginConfigurationEntity: EntityModelPluginConfigurationEntity) {
    return this.pluginUsageConfigurationService.putItemResourcePluginconfigurationentityPut(String(this.utils.getId(pluginConfigurationEntity)), {
      id: Number(this.utils.getId(pluginConfigurationEntity)),
      key: pluginConfigurationEntity.key,
      value: pluginConfigurationEntity.value
    });
  }

  getCurrentPlugin(): PluginPojo | null {
    let temp = this.allPlugins.filter(plugin => plugin.identifier?.includes(this.pluginUsage.pluginIdentifier));

    if (temp.length > 0) {
      return temp[0];
    }

    return null;
  }

}
