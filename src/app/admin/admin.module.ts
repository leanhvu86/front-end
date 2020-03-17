import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StationComponent } from './station/station.component';

import { OrderModule } from 'ngx-order-pipe'; // <- import OrderModule

import * as  cloudinary from 'cloudinary-core';
import cloudinaryConfiguration from '../config';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RecipeAccessComponent } from './recipe-access/recipe-access.component';
import { RecipeCheckComponent } from './recipe-check/recipe-check.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    StationComponent,
    RecipeAccessComponent,
    RecipeCheckComponent,
    ScrollTopComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    OrderModule,
    RouterModule.forChild(AdminRoutes),

    CloudinaryModule.forRoot(cloudinary, cloudinaryConfiguration),
  ],
  providers: [CookieService],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
