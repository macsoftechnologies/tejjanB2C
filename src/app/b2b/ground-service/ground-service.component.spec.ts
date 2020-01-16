import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundServiceComponent } from './ground-service.component';

describe('GroundServiceComponent', () => {
  let component: GroundServiceComponent;
  let fixture: ComponentFixture<GroundServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroundServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroundServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
