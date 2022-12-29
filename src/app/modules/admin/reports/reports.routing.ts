import { Route } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { VirtualTradeHistoryReportComponent } from './virtual-trade-hostory-report/virtual-trade-history-report.component';

export const ReportsRouting: Route[] = [
    {
        path: '',
        component: ReportsComponent,
    },
    {
        path: 'virtual-trade-history-report',
        component: VirtualTradeHistoryReportComponent,
    }
];
