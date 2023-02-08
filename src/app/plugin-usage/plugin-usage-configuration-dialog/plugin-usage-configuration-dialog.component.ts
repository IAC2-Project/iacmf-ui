import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  EntityModelPluginUsageEntity
} from 'iacmf-client';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PluginUsageComponent } from '../plugin-usage.component';

@Component({
  selector: 'plugin-usage-configuration-dialog',
  templateUrl: './plugin-usage-configuration-dialog.component.html',
  styleUrls: ['./plugin-usage-configuration-dialog.component.css']
})
export class PluginUsageConfigurationDialogComponent implements OnInit {
  @ViewChild('pluginUsage', { static: false }) pluginUsageComponent: PluginUsageComponent | undefined;
  selectedPluginUsage: EntityModelPluginUsageEntity | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { pluginId: number, pluginType: string }, public dialogRef: MatDialogRef<PluginUsageConfigurationDialogComponent>) {
    console.info("we are inside plugin-usage-configuration-dialog component!");
    console.debug(data);
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.pluginUsageComponent?.updateAllPluginConfigurations().subscribe(() => {
      this.dialogRef.close({
        event: 'Closed', data: {
          pluginUsage: this.selectedPluginUsage
        }
      });
    });

  }

  updatePluginUsage($event: EntityModelPluginUsageEntity) {
    this.selectedPluginUsage = $event
  }

}
