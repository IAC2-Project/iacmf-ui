import { Component, Inject, OnInit } from '@angular/core';
import {
  EntityModelPluginUsageEntity, PluginPojo
} from 'iacmf-client';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-configure-refinement-plugin-dialog',
  templateUrl: './configure-refinement-plugin-dialog.component.html',
  styleUrls: ['./configure-refinement-plugin-dialog.component.css']
})
export class ConfigureRefinementPluginDialogComponent implements OnInit {
  selectedPluginUsage: EntityModelPluginUsageEntity | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number, public dialogRef: MatDialogRef<ConfigureRefinementPluginDialogComponent>) {
    console.info("we are inside ConfigureRefinementPluginDialogComponent");
    console.debug(data);
  }

  ngOnInit(): void {
  }

  closeDialog() {

    this.dialogRef.close({
      event: 'Closed', data: {
        pluginUsage: this.selectedPluginUsage
      }
    });

  }

  updatePluginUsage($event: EntityModelPluginUsageEntity) {
    this.selectedPluginUsage = $event
  }

}
