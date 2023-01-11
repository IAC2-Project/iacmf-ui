import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateProductionSystemDialogComponent} from './create-production-system-dialog.component';

describe('CreateProductionSystemDialogComponent', () => {
  let component: CreateProductionSystemDialogComponent;
  let fixture: ComponentFixture<CreateProductionSystemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductionSystemDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductionSystemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
