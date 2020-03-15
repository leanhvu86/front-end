import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeAccessComponent } from './recipe-access.component';

describe('RecipeAccessComponent', () => {
  let component: RecipeAccessComponent;
  let fixture: ComponentFixture<RecipeAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
