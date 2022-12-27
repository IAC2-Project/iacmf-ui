import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductionSytemComponent } from './select-production-sytem.component';

describe('SelectProductionSytemComponent', () => {
  let component: SelectProductionSytemComponent;
  let fixture: ComponentFixture<SelectProductionSytemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectProductionSytemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectProductionSytemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
