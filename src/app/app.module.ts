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
import {ComplianceJobsComponent} from './compliancejobs/compliance-jobs.component';
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
import {ConfigureComplianceRuleComponent} from "./compliance-rules/configure-compliance-rule/configure-compliance-rule.component";
import {ConfigureComlianceIssueComponent} from "./compliance-issues/configure-compliance-issue/configure-compliance-issue.component";
import {MatSelectModule} from "@angular/material/select";
import { ConfigureValidationPluginComponent } from './validation-plugins/configure-validation-plugin/configure-validation-plugin.component';
import { ConfigureReportingPluginComponent } from './reporting-plugins/configure-reporting-plugin/configure-reporting-plugin.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSliderModule} from "@angular/material/slider";
import {MatDividerModule} from "@angular/material/divider";
import { SelectProductionSytemComponent } from './production-systems/select-production-sytem/select-production-sytem.component';
import { ConfigureFixingPluginComponent } from './compliance-issues/configure-fixing-plugin/configure-fixing-plugin.component';
import {MatInputModule} from "@angular/material/input";
import { CreateComplianceRuleComponent } from './compliance-rules/create-compliance-rule/create-compliance-rule.component';
import { KvComponent } from './kv/kv.component';
import { ConfigureProductionSystemDialogComponent } from './production-systems/configure-production-system-dialog/configure-production-system-dialog.component';
import {Utils} from "./utils/utils";
import { PluginUsageComponent } from './plugin-usage/plugin-usage.component';
import { ExecutionComponent } from './execution/execution.component';
import { CreateExecutionComponent } from './execution/create-execution/create-execution.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductionSystemsComponent,
    TriggersComponent,
    CreateProductionSystemDialogComponent,
    ComplianceJobsComponent,
    CreateCompliancejobDialogComponent,
    RefinementPluginsComponent,
    ComplianceIssuesComponent,
    ValidationPluginsComponent,
    ReportingPluginsComponent,
    ComplianceRulesComponent,
    ConfigureRefinementPluginComponent,
    ConfigureComplianceRuleComponent,
    ConfigureComlianceIssueComponent,
    ConfigureValidationPluginComponent,
    ConfigureReportingPluginComponent,
    SelectProductionSytemComponent,
    ConfigureFixingPluginComponent,
    CreateComplianceRuleComponent,
    KvComponent,
    ConfigureProductionSystemDialogComponent,
    PluginUsageComponent,
    ExecutionComponent,
    CreateExecutionComponent
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
    MatInputModule,
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
    MatToolbarModule,
    MatSliderModule,
    MatDividerModule,
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
