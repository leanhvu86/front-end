import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StationComponent } from './station/station.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CounterModule } from 'ngx-counter';
import { OrderModule } from 'ngx-order-pipe'; // <- import OrderModule

import * as  cloudinary from 'cloudinary-core';
import cloudinaryConfiguration from '../config';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RecipeAccessComponent } from './recipe-access/recipe-access.component';
import { RecipeCheckComponent } from './recipe-check/recipe-check.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../shared/helper';
import { GalleryAccessComponent } from './gallery-access/gallery-access.component';
import { LoadPageComponent } from './load-page/load-page.component';
import { SearchPipe } from '../shared/helper/search.pipe';
@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    StationComponent,
    RecipeAccessComponent,
    RecipeCheckComponent,
    ScrollTopComponent,
    GalleryAccessComponent,
    LoadPageComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    OrderModule,
    ScrollingModule,
    CounterModule.forRoot(),
    RouterModule.forChild(AdminRoutes),

    CloudinaryModule.forRoot(cloudinary, cloudinaryConfiguration),
  ],
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
