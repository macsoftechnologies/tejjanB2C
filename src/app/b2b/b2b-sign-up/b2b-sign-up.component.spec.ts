import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bSignUpComponent } from './b2b-sign-up.component';

describe('B2bSignUpComponent', () => {
  let component: B2bSignUpComponent;
  let fixture: ComponentFixture<B2bSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
