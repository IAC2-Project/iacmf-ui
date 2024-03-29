import {Component, EventEmitter, OnInit, Output, QueryList, ViewChildren} from '@angular/core';

import {async, bindCallback, forkJoin} from "rxjs";

import {MatDialog} from "@angular/material/dialog";

import {
  PluginConfigurationService,
  PluginPojo, PluginService, PluginUsageService
} from "iacmf-client";
import {EntityModelPluginUsageEntity} from 'iacmf-client/model/entityModelPluginUsageEntity';
import {Utils} from '../utils/utils';
import {
  PluginUsageConfigurationDialogComponent
} from '../plugin-usage/plugin-usage-configuration-dialog/plugin-usage-configuration-dialog.component';
import PluginTypeEnum = PluginPojo.PluginTypeEnum;
import {PluginUsageComponent} from '../plugin-usage/plugin-usage.component';
import {PluginUsageEntityRequestBody} from "iacmf-client/model/pluginUsageEntityRequestBody";

@Component({
  selector: 'app-refinement-plugins',
  templateUrl: './refinement-plugins.component.html',
  styleUrls: ['./refinement-plugins.component.css']
})
export class RefinementPluginsComponent implements OnInit {
  @Output("pluginAdded") pluginAddedEventEmitter = new EventEmitter();
  @Output("pluginRemoved") pluginRemovedEventEmitter = new EventEmitter();
  @Output("pluginConfigured") pluginConfiguredEventEmitter = new EventEmitter();
  @ViewChildren('pluginUsages') components: QueryList<PluginUsageComponent> | undefined;

  allPlugins = new Array<PluginPojo>();
  addedRefinementPlugins = new Array<PluginPojo>();
  addedPluginUsages = new Array<EntityModelPluginUsageEntity>();

  selected = undefined;

  ngOnInit(): void {
    this.pluginService.getAllPlugins(PluginPojo.PluginTypeEnum.ModelRefinement).subscribe(result => result.forEach(pojo => this.allPlugins.push(pojo)));
  }

  constructor(private dialog: MatDialog,
              private pluginService: PluginService,
              private pluginUsageService: PluginUsageService,
              private pluginConfigurationService: PluginConfigurationService,
              private utils: Utils) {
  }

  private _filter(value: string | undefined): PluginPojo[] {
    if (value == undefined) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.allPlugins.filter(refinementPlugin =>
      refinementPlugin.identifier != undefined && refinementPlugin.identifier.toLowerCase().includes(filterValue)
    );
  }

  addRefinementPlugin(refinementPluginId: string | undefined) {
    if (refinementPluginId != undefined) {
      this.addedRefinementPlugins.push(this._filter(refinementPluginId)[0]);
    }
  }

  pluginConfigurationCreated(resp: EntityModelPluginUsageEntity, index: number) {
    this.addedPluginUsages[index] = resp;
    resp.refinementPluginIndexInComplianceJob = index;
    let body: PluginUsageEntityRequestBody = {
      id: Number(this.utils.getId(resp)),
      pluginIdentifier: resp.pluginIdentifier,
      refinementPluginIndexInComplianceJob: index
    };
    this.pluginUsageService.patchItemResourcePluginusageentityPatch(String(this.utils.getId(resp)), body).subscribe(() => {
      this.pluginAddedEventEmitter.emit(resp);
    });

  }

  removeRefinementPlugin(refinementPluginPojo: PluginPojo, index: number) {
    // here we assume the array was originally ordered according to the index in the refinement strategy
    if (index >= 0) {
      const toRemovePluginUsage = this.addedPluginUsages[index];
      this.addedPluginUsages.splice(index, 1);
      this.addedRefinementPlugins.splice(index, 1);
      const pluginUsageId = this.utils.getId(toRemovePluginUsage);
      this.utils.removePluginUsage(pluginUsageId).subscribe(() => {
        // update the order
        let requests = [];
        for (let i = index; i < this.addedPluginUsages.length; i++) {
          let currentPluginUsage = this.addedPluginUsages[i];

          requests.push(this.pluginUsageService.patchItemResourcePluginusageentityPatch(String(this.utils.getId(currentPluginUsage)), {
            pluginIdentifier: currentPluginUsage.pluginIdentifier,
            id: Number(this.utils.getId(currentPluginUsage)),
            refinementPluginIndexInComplianceJob: i
          }));
        }

        if (requests.length > 0) {
          forkJoin(requests).subscribe(() => {
            this.pluginRemovedEventEmitter?.emit(toRemovePluginUsage);
          });
        } else {
          this.pluginRemovedEventEmitter?.emit(toRemovePluginUsage);
        }
      });
    }
  }

  persistAssignments() {
    let requests = this.components?.toArray().map(component => {
      return component.updateAllPluginConfigurations();
    });

    if (requests && requests.length > 0) {
      forkJoin(requests).subscribe();
    }
  }
}
