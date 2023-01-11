import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidationPluginsComponent} from './validation-plugins.component';

describe('RefinementPluginsComponent', () => {
  let component: ValidationPluginsComponent;
  let fixture: ComponentFixture<ValidationPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationPluginsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
