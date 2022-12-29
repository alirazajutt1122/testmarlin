import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {SharedModule} from 'app/shared/shared.module';
import {DashboardComponent} from "./dashboard.component";
import {dashboardRoutes} from "./dashboard.routing";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FuseNavigationModule} from "../../../../@fuse/components/navigation";
import {MatExpansionModule} from '@angular/material/expansion';
import {FuseCardModule} from '@fuse/components/card';
import {MatRippleModule} from '@angular/material/core';
import {DashboardSidebar} from './right-sidebar/dashboard-sidebar';
import {StockMarketModule} from "./stock-market/stock-market.module";
import {TrendingModule} from "./trending/trending.module";
import {OrderBookModule} from "./oder-book-dashboard/order-book-dashboard.module";

import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";


import {HttpClientModule} from '@angular/common/http';
import {TranslocoRootModule} from 'app/transloco/transloco-root.module';
import {LanguagesModule} from "../../../layout/common/languages/languages.module";
import { RecentNewsModule } from './recent-news/recent-news.module';
import { DataService } from 'app/services/data.service';
import { OrderNewModule } from '../oms/order/order.module';
import { MarketWatchDashboardModule } from './market-watch-dashboard/market-watch-dashboard.module';
import { WorkingOrderDashboardAllComponent } from './working-order-dashboard-all/working-order-dashboard-all';
import { WorkingOrderDashboardComponent } from './working-order-dashboard-all/working-orders-dashboard/working-orders-dashboard';
import { TradesDashboardComponent } from './working-order-dashboard-all/trades-dashboard/trades-dashboard';
import { AuditTrailDashboardComponent } from './working-order-dashboard-all/audit-trails-dashboard/audit-trails-dashboard';
import { WorkingOrderDashbordAllModule } from './working-order-dashboard-all/working-order-dashboard-all.module';
import { TopDividendComponent } from './top-dividends/top-dividends';





@NgModule({
    declarations: [
        DashboardComponent,
        DashboardSidebar,
        TopDividendComponent
    ],
    imports: [
        RouterModule.forChild(dashboardRoutes),
        MatDividerModule,
        MatProgressBarModule,
        MatSidenavModule,
        FuseNavigationModule,
        MatMenuModule,
        MatRippleModule,
        SharedModule,
        FuseCardModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        StockMarketModule,
        TrendingModule,
        OrderBookModule,        
        
        MatSortModule,
        MatTableModule,
        MatInputModule,
        HttpClientModule,
        TranslocoRootModule,
        LanguagesModule,
        RecentNewsModule,
        MarketWatchDashboardModule,
        WorkingOrderDashbordAllModule,
    ],
    providers : [

    ],
    exports : [

    ]
})
export class DashboardModule {
}
