import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompliancejobDialogComponent } from './create-compliancejob-dialog.component';

describe('CreateCompliancejobDialogComponent', () => {
  let component: CreateCompliancejobDialogComponent;
  let fixture: ComponentFixture<CreateCompliancejobDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCompliancejobDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCompliancejobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
