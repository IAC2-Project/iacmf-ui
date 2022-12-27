import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ProductionSystemsComponent} from './production-systems/production-systems.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TriggersComponent} from './triggers/triggers.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LayoutModule} from '@angular/cdk/layout';
import {HttpClientModule} from '@angular/common/http';
import {ApiModule} from 'iacmf-api';
import {MatTabsModule} from "@angular/material/tabs";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {CreateProductionSystemDialogComponent} from './production-systems/create-production-system-dialog/create-production-system-dialog.component';
import {CompliancejobsComponent} from './compliancejobs/compliancejobs.component';
import {CreateCompliancejobDialogComponent} from './compliancejobs/create-compliancejob-dialog/create-compliancejob-dialog.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RefinementPluginsComponent} from './refinement-plugins/refinement-plugins.component';
import { MatChipsModule } from "@angular/material/chips";
import {MatOptionModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ComplianceIssuesComponent} from "./compliance-issues/compliance-issues.component";
import {ValidationPluginsComponent} from "./validation-plugins/validation-plugins.component";
import {ReportingPluginsComponent} from "./reporting-plugins/reporting-plugins.component";
import {ComplianceRulesComponent} from "./compliance-rules/compliance-rules.component";
import { ConfigureRefinementPluginComponent } from './refinement-plugins/configure-refinement-plugin/configure-refinement-plugin.component';
import {ConfigureComlianceRuleComponent} from "./compliance-rules/configure-compliance-rule/configure-compliance-rule.component";
import {ConfigureComlianceIssueComponent} from "./compliance-issues/configure-compliance-issue/configure-compliance-issue.component";
import {MatSelectModule} from "@angular/material/select";
import { ConfigureValidationPluginComponent } from './validation-plugins/configure-validation-plugin/configure-validation-plugin.component';
import { ConfigureReportingPluginComponent } from './reporting-plugins/configure-reporting-plugin/configure-reporting-plugin.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductionSystemsComponent,
    TriggersComponent,
    CreateProductionSystemDialogComponent,
    CompliancejobsComponent,
    CreateCompliancejobDialogComponent,
    RefinementPluginsComponent,
    ComplianceIssuesComponent,
    ValidationPluginsComponent,
    ReportingPluginsComponent,
    ComplianceRulesComponent,
    ConfigureRefinementPluginComponent,
    ConfigureComlianceRuleComponent,
    ConfigureComlianceIssueComponent,
    ConfigureValidationPluginComponent,
    ConfigureReportingPluginComponent
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
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatOptionModule,
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
