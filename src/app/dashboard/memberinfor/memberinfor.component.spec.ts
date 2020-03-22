import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberinforComponent } from './memberinfor.component';

describe('MemberinforComponent', () => {
  let component: MemberinforComponent;
  let fixture: ComponentFixture<MemberinforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberinforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberinforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
