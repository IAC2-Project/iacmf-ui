import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginUsageComponent } from './plugin-usage.component';

describe('PluginUsageComponent', () => {
  let component: PluginUsageComponent;
  let fixture: ComponentFixture<PluginUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluginUsageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluginUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
