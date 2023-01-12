import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExecutionComponent } from './create-execution.component';

describe('CreateExecutionComponent', () => {
  let component: CreateExecutionComponent;
  let fixture: ComponentFixture<CreateExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExecutionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
