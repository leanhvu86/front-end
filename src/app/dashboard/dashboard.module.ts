import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { RouterModule } from '@angular/router';
import { DashBoardRoutes } from './dashboard.routing';
import { Home2Component } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { RoutingComponent } from './routing/routing.component';
import { RegisterPassengerComponent } from './register-passenger/register-passenger.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './child/footer/footer.component';
import { CoutryComponent } from './coutry/coutry.component';
import { NavComponent } from './child/nav/nav.component';
import { FileUploadModule } from 'ng2-file-upload';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RecipeComponent } from './recipe/recipe.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { WelcomeComponent } from './welcome/welcome.component';
import { ScrollTopComponent } from './child/scroll-top/scroll-top.component';
import { CookieService } from 'ngx-cookie-service';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';

import { UserinforComponent } from './userinfor/userinfor.component';
import { Ng5SliderModule } from 'ng5-slider';
import { MemberinforComponent } from './memberinfor/memberinfor.component';
import { MyrecipeComponent } from './myrecipe/myrecipe.component';
import { AddBookmarkComponent } from './child/add-bookmark/add-bookmark.component';
import { ServiceComponent } from './service/service.component';
import { QuyDinhComponent } from './quy-dinh/quy-dinh.component';
import { ChinhSachBaoMatComponent } from './chinh-sach-bao-mat/chinh-sach-bao-mat.component';
import { ChinhsachdiemComponent } from './chinhsachdiem/chinhsachdiem.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterComponent } from './register/register.component';
import { MygalleryComponent } from './mygallery/mygallery.component';
import { AddGalleryComponent } from './child/add-gallery/add-gallery.component';
import { AppRecipeGalleryComponent } from './child/app-recipe-gallery/app-recipe-gallery.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LoadingBarModule } from "ngx-loading-bar";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {SharedModule} from '../shared/shared.module';
import {AlertModule} from '../shared/animation/_alert';
import { MemberTitleComponent } from './child/member-title/member-title.component';

@NgModule({
  declarations: [
    IndexComponent,
    Home2Component,
    AboutComponent,
    RoutingComponent,
    RegisterPassengerComponent,
    ComboBoxComponent,
    LoginComponent,
    FooterComponent,
    CoutryComponent,
    NavComponent,
    RecipeDetailComponent,
    RecipeComponent,
    WelcomeComponent,
    ScrollTopComponent,

    GalleryComponent,
    GalleryDetailComponent,

    UserinforComponent,
    MemberinforComponent,
    MyrecipeComponent,
    AddBookmarkComponent,
    ServiceComponent,
    QuyDinhComponent,
    ChinhSachBaoMatComponent,
    ChinhsachdiemComponent,
    ForgetPasswordComponent,
    RegisterComponent,
    MygalleryComponent,
    AddGalleryComponent,
    AppRecipeGalleryComponent,
    MemberTitleComponent,
  ],
    imports: [
        CommonModule,
        FileUploadModule,
        Ng5SliderModule,
        JwSocialButtonsModule,
        RouterModule.forChild(DashBoardRoutes),
        ScrollingModule,
        ReactiveFormsModule,
        LoadingBarModule,
        Ng2SearchPipeModule,
        FormsModule,
        NgxPaginationModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        SharedModule,
        AlertModule,
    ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [CookieService, DatePipe],

  exports: [IndexComponent, CoutryComponent],
})
export class DashboardModule { }
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
