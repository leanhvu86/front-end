import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { Home2Component } from '../dashboard/home/home.component';
import { AuthGuardGuard } from '../shared/guards/AuthGuard/auth-guard.guard';
import { AboutComponent } from './about/about.component';
import { RoutingComponent } from './routing/routing.component';
import { RegisterPassengerComponent } from './register-passenger/register-passenger.component';
import { ComboBoxComponent } from './combo-box/combo-box.component';

export const DashBoardRoutes: Routes = [
    {
        path: '',
        component: IndexComponent,
        children: [
            {
                path: '',
                redirectTo: 'index',
                pathMatch: 'full'
            },
            {
                path: 'index',
                component: Home2Component
            },
            {
                path: 'addPassenger',
                component: RegisterPassengerComponent
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'routing',
                component: RoutingComponent
            },
            {
                path: 'combobox',
                component: ComboBoxComponent
            },
        ]
    }
];
