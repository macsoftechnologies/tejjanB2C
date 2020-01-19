import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cSignUpComponent } from './b2c-sign-up.component';

describe('B2cSignUpComponent', () => {
  let component: B2cSignUpComponent;
  let fixture: ComponentFixture<B2cSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
