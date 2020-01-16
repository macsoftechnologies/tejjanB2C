import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportServiceComponent } from './transport-service.component';

describe('TransportServiceComponent', () => {
  let component: TransportServiceComponent;
  let fixture: ComponentFixture<TransportServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
