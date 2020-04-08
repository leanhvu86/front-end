import { AuthGuardGuard } from '../shared/guards/AuthGuard/auth-guard.guard';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StationComponent } from './station/station.component';
import { RecipeAccessComponent } from './recipe-access/recipe-access.component';
import { RecipeCheckComponent } from './recipe-check/recipe-check.component';
import { GalleryAccessComponent } from './gallery-access/gallery-access.component';

export const AdminRoutes: Routes = [
    { path: 'admin', redirectTo: '/login', pathMatch: 'full' },

    // {
    //     path: 'station',
    //     component: StationComponent
    // },
    {
        path: '', component: HomeComponent,
        canActivate: [AuthGuardGuard],// <- this line is added
        children: [
            {
                path: '',
                redirectTo: 'adminHome',
                pathMatch: 'full'
            },

            {
                path: 'adminHome',
                component: StationComponent
            },
            {
                path: 'recipeAccess',
                component: RecipeAccessComponent

            },
            {
                path: 'detailRecipe/:id',
                component: RecipeCheckComponent
            },
            {
                path: 'gallery/access',
                component: GalleryAccessComponent
            },
            // {
            //     path: 'add-product',
            //     component: AddProductComponent
            // },
            // {
            //     path: 'customer',
            //     component: CustomerComponent
            // },
            // {
            //     path: 'customer-detail/:id',
            //     component: CustomerDetailComponent
            // },
            // {
            //     path: 'report',
            //     component: ReportComponent
            // },
        ]
    },
    { path: 'login', component: LoginComponent },
];
