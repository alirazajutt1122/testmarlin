import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {SharedModule} from '../../../shared/shared.module';
import {TradingPortalRouting} from './trading-portal.routing';
import {MatRippleModule} from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {TradingPortalSidebar} from './right-sidebar/right-sidebar.component';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {MatExpansionModule} from '@angular/material/expansion';
import {TradingRegistrationComponent} from './trading-portal/trading-registration.component';
import {TradingDashboardComponent} from './trading-dashboard/trading-dashboard.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {TradingviewWidgetModule} from "angular-tradingview-widget";
import {MatSelectModule} from "@angular/material/select";
import {TradingDashboardModule} from "./trading-dashboard/trading-dashboard.module";

@NgModule({
    declarations: [
        TradingRegistrationComponent,
        TradingPortalSidebar,
        TradingDashboardComponent,
    ],
    imports: [
        RouterModule.forChild(TradingPortalRouting),
        MatDividerModule,
        MatMenuModule,
        MatRippleModule,
        MatSidenavModule,
        SharedModule,
        FuseCardModule,
        MatProgressBarModule,
        FuseNavigationModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        NgApexchartsModule,
        MatButtonToggleModule,
        TradingviewWidgetModule,
        MatSelectModule,
        TradingDashboardModule,
    ]
})
export class TradingPortalModule {
}
