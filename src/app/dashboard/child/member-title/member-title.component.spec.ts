import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTitleComponent } from './member-title.component';

describe('MemberTitleComponent', () => {
  let component: MemberTitleComponent;
  let fixture: ComponentFixture<MemberTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
