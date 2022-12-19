import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProductionSystemsComponent } from './production-systems/production-systems.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TriggersComponent } from './triggers/triggers.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { ApiModule } from 'iacmf-api';
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule} from "@angular/material/expansion";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { CreateProductionSystemDialogComponent } from './production-systems/create-production-system-dialog/create-production-system-dialog.component';
import { CompliancejobsComponent } from './compliancejobs/compliancejobs.component';
import { CreateCompliancejobDialogComponent } from './compliancejobs/create-compliancejob-dialog/create-compliancejob-dialog.component';
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    ProductionSystemsComponent,
    TriggersComponent,
    CreateProductionSystemDialogComponent,
    CompliancejobsComponent,
    CreateCompliancejobDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatStepperModule,
    LayoutModule,
    ApiModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
