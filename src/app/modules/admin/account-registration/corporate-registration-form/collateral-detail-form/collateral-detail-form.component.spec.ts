import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralDetailFormComponent } from './collateral-detail-form.component';

describe('CollateralDetailFormComponent', () => {
  let component: CollateralDetailFormComponent;
  let fixture: ComponentFixture<CollateralDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollateralDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
