import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { async, forkJoin } from "rxjs";

import { MatDialog } from "@angular/material/dialog";

import {
  PluginConfigurationService,
  PluginPojo, PluginService, PluginUsageService
} from "iacmf-client";
import { EntityModelPluginUsageEntity } from 'iacmf-client/model/entityModelPluginUsageEntity';
import { Utils } from '../utils/utils';
import {
  PluginUsageConfigurationDialogComponent
} from '../plugin-usage/plugin-usage-configuration-dialog/plugin-usage-configuration-dialog.component';

@Component({
  selector: 'app-refinement-plugins',
  templateUrl: './refinement-plugins.component.html',
  styleUrls: ['./refinement-plugins.component.css']
})
export class RefinementPluginsComponent implements OnInit {
  @Output("pluginAdded") pluginAddedEventEmitter = new EventEmitter();
  @Output("pluginRemoved") pluginRemovedEventEmitter = new EventEmitter();
  @Output("pluginConfigured") pluginConfiguredEventEmitter = new EventEmitter();

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

  openConfigureRefinementPluginDialog(pluginIndex: number, enterAnimationDuration: string, exitAnimationDuration: string): void {
    if (pluginIndex >= 0) {
      let pluginUsage = this.addedPluginUsages[pluginIndex];
      this.dialog.open(PluginUsageConfigurationDialogComponent, {
        width: '80%',
        enterAnimationDuration,
        exitAnimationDuration,
        data: Number(this.utils.getId(pluginUsage)),
      });
    }
  }

  addRefinementPlugin(refinementPluginId: string | undefined) {
    if (refinementPluginId != undefined) {
      this.addedRefinementPlugins.push(this._filter(refinementPluginId)[0]);

      this.pluginUsageService.postCollectionResourcePluginusageentityPost({
        pluginIdentifier: refinementPluginId,
        refinementPluginIndexInComplianceJob: this.addedRefinementPlugins.length - 1,
        id: -1
      }).subscribe(resp => {
        this.addedPluginUsages.push(resp);
        this.pluginAddedEventEmitter.emit(resp);
      })
    }
  }

  removeRefinementPlugin(refinementPluginPojo: PluginPojo) {
    // here we assume the array was originally ordered according to the index in the refinement strategy
    const index = this.addedRefinementPlugins.indexOf(refinementPluginPojo);

    if (index >= 0) {
      let pluginUsage = this.addedPluginUsages[index];
      this.addedPluginUsages.splice(index, 1);
      this.addedRefinementPlugins.splice(index, 1);
      const pluginUsageId = String(this.utils.getId(pluginUsage));
      this.utils.removePluginUsage(pluginUsageId).subscribe(() => this.pluginRemovedEventEmitter.emit(pluginUsage));

      // update the order
      let requests = [];
      for (let i = index; i < this.addedPluginUsages.length; i++) {
        pluginUsage = this.addedPluginUsages[i];

        requests.push(this.pluginUsageService.patchItemResourcePluginusageentityPatch(String(this.utils.getId(pluginUsage)), {
          pluginIdentifier: pluginUsage.pluginIdentifier,
          id: Number(this.utils.getId(pluginUsage)),
          refinementPluginIndexInComplianceJob: i
        }));
      }

      forkJoin(requests).subscribe();
    }
  }
}
