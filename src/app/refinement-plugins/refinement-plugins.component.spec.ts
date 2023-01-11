import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RefinementPluginsComponent} from './refinement-plugins.component';

describe('RefinementPluginsComponent', () => {
  let component: RefinementPluginsComponent;
  let fixture: ComponentFixture<RefinementPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefinementPluginsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefinementPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
