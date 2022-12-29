import {Route} from '@angular/router';
import {LayoutComponent} from 'app/layout/layout.component';
import {InitialDataResolver} from 'app/app.resolvers';
import { AuthGuard } from '../app/auth.guard';
import { AuditLogCmp } from './modules/admin/reports/auditlog-page';



export const appRoutes: Route[] = [

    {path: '', pathMatch: 'full', redirectTo: 'sign-in' },
    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard'},
    {path: 'admin-redirect', pathMatch: 'full', redirectTo: '/admin/dashboard-admin'},

    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'sign-in',
                loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)
            },
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'admin',
                loadChildren: () => import('app/admin/admin.module').then(m => m.adminModule)
            },
            {
                path: 'dashboard',
                loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'dashboard-bo',
                loadChildren: () => import('app/modules/admin/dashboard-bo/dashboard-bo.module').then(m => m.DashboardBoModule)
            },
            {
                path: 'trading-portal',
                loadChildren: () => import('app/modules/admin/trading-portal/trading-portal.module').then(m => m.TradingPortalModule)
            },
            {
                path: 'back-office',
                loadChildren: () => import('app/modules/admin/back-office/back-office.module').then(m => m.BackOfficeModule)
            },

            {
                path: 'oms-reports',
                loadChildren: () => import('app/modules/admin/oms/reports/reports.module').then(m => m.TradingReportsModule)
            },
            {
                path: 'account-registration',
                loadChildren: () => import('app/modules/admin/account-registration/account-registration.module').then(m => m.AccountRegistrationModule)
            },
            {
                path: 'online-account-registration',
                loadChildren: () => import('app/modules/admin/online-account-registeration/online-account-registeration.module').then(m => m.OnlineAccountRegModule)
            },
            {
                path: 'news_advertisements',
                loadChildren: () => import('app/modules/admin/news_advertisements/news_advertisements.module').then(m => m.NewsAdvertisementsModule)
            },
            {
                path: 'favourites',
                loadChildren: () => import('app/modules/admin/favourites/favourites.module').then(m => m.FavouritesModule)
            },
            {
                path: 'portfolio',
                loadChildren: () => import('app/modules/admin/portfolio/portfolio.module').then(m => m.PortfolioModule)
            },
            {
                path: 'individual-registration',
                loadChildren: () => import('app/modules/admin/account-registration/individual-registration-form/individual-registration-form.module').then(m => m.IndividualRegistrationFormModule)
            },
            {
                path: 'reports',
                loadChildren: () => import('app/modules/admin/reports/reports.module').then(m => m.ReportsModule),

            },
            {
                path: 'auditlog',
                component: AuditLogCmp,
            },
            {
                path: 'access-control',
                loadChildren: () => import('app/modules/access-control/access-control.module').then(m => m.AccessControlModule)
            },
            {
                path: 'negotiation',
                loadChildren: () => import('app/modules/admin/oms/negotiation/negotiation.module').then(m => m.NegotiationModule)
            },

        ]
    }
];
