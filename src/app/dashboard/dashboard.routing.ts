import { MyrecipeComponent } from "./myrecipe/myrecipe.component";
import { MemberinforComponent } from "./memberinfor/memberinfor.component";
import { UserinforComponent } from "./userinfor/userinfor.component";
import { Routes } from "@angular/router";
import { IndexComponent } from "./index/index.component";
import { Home2Component } from "../dashboard/home/home.component";
import { AuthGuardGuard } from "../shared/guards/AuthGuard/auth-guard.guard";
import { AboutComponent } from "./about/about.component";
import { RoutingComponent } from "./routing/routing.component";
import { RegisterPassengerComponent } from "./register-passenger/register-passenger.component";
import { ComboBoxComponent } from "./combo-box/combo-box.component";
import { LoginComponent } from "../dashboard/login/login.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeComponent } from "./recipe/recipe.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';
import { QuyDinhComponent } from './quy-dinh/quy-dinh.component';
import { ChinhSachBaoMatComponent } from './chinh-sach-bao-mat/chinh-sach-bao-mat.component';
import { ChinhsachdiemComponent } from './chinhsachdiem/chinhsachdiem.component';
import { ServiceComponent } from './service/service.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterComponent } from './register/register.component';
import { MygalleryComponent } from './mygallery/mygallery.component';

export const DashBoardRoutes: Routes = [

  {
    path: "",
    component: IndexComponent,
    children: [
      {
        path: "",
        redirectTo: "index",
        pathMatch: "full"
      },
      {
        path: "index",
        component: Home2Component
      },
      {
        path: "addPassenger",
        component: RegisterPassengerComponent
      },
      {
        path: "about",
        component: AboutComponent
      },
      {
        path: "routing",
        component: RoutingComponent
      },
      {
        path: "loginMember",
        component: LoginComponent
      },
      {
        path: "combobox",
        component: ComboBoxComponent
      },
      {
        path: "detail/:id",
        component: RecipeDetailComponent
      },
      {
        path: "recipe",
        component: RecipeComponent
      },
      {
        path: "active/:id",
        component: WelcomeComponent
      },
      {

        path: "gallery",
        component: GalleryComponent
      }, {

        path: "user/info/:id",
        component: UserinforComponent
      },
      {
        path: "member/info/:id",
        component: MemberinforComponent
      },
      {
        path: "personal/recipe/:id",
        component: MyrecipeComponent
      },
      {
        path: "galleryDetail/:id",
        component: GalleryDetailComponent
      },
      {
        path: "quydinh",
        component: QuyDinhComponent
      }
      ,
      {
        path: "chinhsachbaomat",
        component: ChinhSachBaoMatComponent
      },
      {
        path: "chinhsachdiem",
        component: ChinhsachdiemComponent
      },
      {
        path: "gioithieu",
        component: ServiceComponent
      }
      ,
      {
        path: "resetPassword",
        component: ForgetPasswordComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'myGallery',
        component: MygalleryComponent
      }
    ]
  }
];
