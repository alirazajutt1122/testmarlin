import {Route} from '@angular/router';
import {TradingDashboardGraphComponent} from "./trading-dashboard-graph/trading-dashboard-graph.component";

export const TradingDashboardRouting: Route[] = [
    {
        path: 'trading-graph/:exchange/:marketCode/:symbolCode',
        component: TradingDashboardGraphComponent
    }
];
