import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureProductionSystemDialogComponent } from './configure-production-system-dialog.component';

describe('ConfigureProductionSystemDialogComponent', () => {
  let component: ConfigureProductionSystemDialogComponent;
  let fixture: ComponentFixture<ConfigureProductionSystemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureProductionSystemDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureProductionSystemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
