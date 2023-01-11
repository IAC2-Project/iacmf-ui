import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureCheckingPluginComponent } from './configure-checking-plugin.component';

describe('ConfigureCheckingPluginComponent', () => {
  let component: ConfigureCheckingPluginComponent;
  let fixture: ComponentFixture<ConfigureCheckingPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureCheckingPluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureCheckingPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
