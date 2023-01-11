import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureReportingPluginComponent } from './configure-reporting-plugin.component';

describe('ConfigureReportingPluginComponent', () => {
  let component: ConfigureReportingPluginComponent;
  let fixture: ComponentFixture<ConfigureReportingPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureReportingPluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureReportingPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
