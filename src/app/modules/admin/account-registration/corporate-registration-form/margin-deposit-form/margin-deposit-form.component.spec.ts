import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginDepositFormComponent } from './margin-deposit-form.component';

describe('MarginDepositFormComponent', () => {
  let component: MarginDepositFormComponent;
  let fixture: ComponentFixture<MarginDepositFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarginDepositFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginDepositFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
