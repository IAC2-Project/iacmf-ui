import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductionSystemsComponent} from './production-systems.component';

describe('ProductionSystemsComponent', () => {
  let component: ProductionSystemsComponent;
  let fixture: ComponentFixture<ProductionSystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionSystemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
