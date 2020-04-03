import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinhsachdiemComponent } from './chinhsachdiem.component';

describe('ChinhsachdiemComponent', () => {
  let component: ChinhsachdiemComponent;
  let fixture: ComponentFixture<ChinhsachdiemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChinhsachdiemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinhsachdiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
