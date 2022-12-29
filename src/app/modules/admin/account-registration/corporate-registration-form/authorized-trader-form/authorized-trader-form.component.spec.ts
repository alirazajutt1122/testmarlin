import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedTraderFormComponent } from './authorized-trader-form.component';

describe('AuthorizedTraderFormComponent', () => {
  let component: AuthorizedTraderFormComponent;
  let fixture: ComponentFixture<AuthorizedTraderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizedTraderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedTraderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
