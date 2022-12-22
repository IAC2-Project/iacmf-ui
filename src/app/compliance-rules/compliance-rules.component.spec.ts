import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportingPluginsComponent} from './compliance-rules.component';

describe('RefinementPluginsComponent', () => {
  let component: ReportingPluginsComponent;
  let fixture: ComponentFixture<ReportingPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingPluginsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportingPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
