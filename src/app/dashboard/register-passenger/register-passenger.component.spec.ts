import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPassengerComponent } from './register-passenger.component';

describe('RegisterPassengerComponent', () => {
  let component: RegisterPassengerComponent;
  let fixture: ComponentFixture<RegisterPassengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPassengerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
