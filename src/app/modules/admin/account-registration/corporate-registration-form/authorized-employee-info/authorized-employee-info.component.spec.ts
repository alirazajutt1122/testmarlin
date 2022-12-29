import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedEmployeeInfoComponent } from './authorized-employee-info.component';

describe('AuthorizedEmployeeInfoComponent', () => {
  let component: AuthorizedEmployeeInfoComponent;
  let fixture: ComponentFixture<AuthorizedEmployeeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizedEmployeeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedEmployeeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
