import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { StationComponent } from './station/station.component';

import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    StationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule.forChild(AdminRoutes),
  ],
  providers: [CookieService],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
