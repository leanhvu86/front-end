import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCheckComponent } from './recipe-check.component';

describe('RecipeCheckComponent', () => {
  let component: RecipeCheckComponent;
  let fixture: ComponentFixture<RecipeCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
