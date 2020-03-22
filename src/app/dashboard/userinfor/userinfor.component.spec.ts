import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserinforComponent } from './userinfor.component';

describe('UserinforComponent', () => {
  let component: UserinforComponent;
  let fixture: ComponentFixture<UserinforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserinforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
