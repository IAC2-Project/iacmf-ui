import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureValidationPluginComponent } from './configure-validation-plugin.component';

describe('ConfigureValidationPluginComponent', () => {
  let component: ConfigureValidationPluginComponent;
  let fixture: ComponentFixture<ConfigureValidationPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureValidationPluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureValidationPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
