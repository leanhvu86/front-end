import { AuthGuardGuard } from '../shared/guards/AuthGuard/auth-guard.guard';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { StationComponent } from './station/station.component';

export const AdminRoutes: Routes = [
    { path: 'admin', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'register',
        component: RegisterComponent
    },
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
            // {
            //     path: 'station',

            // },
            // {
            //     path: 'product-info',
            //     component: ProductInfoComponent
            // },
            // {
            //     path: 'product-info-detail/:id',
            //     component: ProductInfoDetailComponent
            // },
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
