import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureRefinementPluginComponent } from './configure-refinement-plugin.component';

describe('ConfigureRefinementPluginComponent', () => {
  let component: ConfigureRefinementPluginComponent;
  let fixture: ComponentFixture<ConfigureRefinementPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureRefinementPluginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureRefinementPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
