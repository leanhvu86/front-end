import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyDinhComponent } from './quy-dinh.component';

describe('QuyDinhComponent', () => {
  let component: QuyDinhComponent;
  let fixture: ComponentFixture<QuyDinhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuyDinhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyDinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
