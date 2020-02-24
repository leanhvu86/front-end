import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoutryComponent } from './coutry.component';

describe('CoutryComponent', () => {
  let component: CoutryComponent;
  let fixture: ComponentFixture<CoutryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoutryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoutryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
