import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bSignInComponent } from './b2b-sign-in.component';

describe('B2bSignInComponent', () => {
  let component: B2bSignInComponent;
  let fixture: ComponentFixture<B2bSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
