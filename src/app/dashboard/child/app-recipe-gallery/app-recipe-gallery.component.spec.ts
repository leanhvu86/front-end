import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRecipeGalleryComponent } from './app-recipe-gallery.component';

describe('AppRecipeGalleryComponent', () => {
  let component: AppRecipeGalleryComponent;
  let fixture: ComponentFixture<AppRecipeGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppRecipeGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppRecipeGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
