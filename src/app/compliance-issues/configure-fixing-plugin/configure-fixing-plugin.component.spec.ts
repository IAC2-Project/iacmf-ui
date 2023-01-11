import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureFixingPluginComponent } from './configure-fixing-plugin.component';

describe('ConfigureFixingPluginComponent', () => {
  let component: ConfigureFixingPluginComponent;
  let fixture: ComponentFixture<ConfigureFixingPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureFixingPluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureFixingPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
