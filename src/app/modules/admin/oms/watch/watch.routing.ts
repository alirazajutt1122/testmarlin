import { Route } from '@angular/router';
import { BondMarketWatch } from './bond-market-watch/bond-market-watch';
import { DashboardOmsComponent } from './dashboard-oms/dashboard-oms';
import { MarketWatchCmp } from './market-watch/market-watch';

import { WatchOmsComponent } from './watch.component';


export const WatchRouting: Route[] = [
    // { path: '',  component : WatchOmsComponent },
    // { path : 'dashboard-oms', component : DashboardOmsComponent },
    { path: '', component: MarketWatchCmp, pathMatch: 'full' },
    { path: 'market-watch', component: MarketWatchCmp  },
    { path: 'bond-market-watch', component: BondMarketWatch  },
    { path: 'dashboard-oms', component: DashboardOmsComponent  }
    // {
    //     path: 'equities',
    //     loadChildren: () => import('app/modules/admin/back-office/equities/equities.module').then(m => m.EquitiesModule)
    // }
];
