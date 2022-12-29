import { Route } from '@angular/router';
import { AuditLogCmp } from '../reports/auditlog-page';
import { TradingRegistrationComponent } from './trading-portal/trading-registration.component';

export const TradingPortalRouting: Route[] = [
    {
        path: '',
        loadChildren: () => import('app/modules/admin/trading-portal/trading-dashboard/trading-dashboard.module').then(m => m.TradingDashboardModule)
    },
    {
        path: 'trading-registration',
        component: TradingRegistrationComponent,
    },
    
];
