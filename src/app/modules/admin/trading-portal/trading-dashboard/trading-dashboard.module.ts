import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradingDashboardRouting } from './trading-dashboard-routing';
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { NgApexchartsModule } from "ng-apexcharts";
import { SharedModule } from "../../../../shared/shared.module";
import { TradingDashboardGraphComponent } from './trading-dashboard-graph/trading-dashboard-graph.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { TradingDashboardBuySellComponent } from './trading-dashboard-buysell/trading-dashboard-buysell.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BuySellConfirmationDialog } from './trading-dashboard-buysell/confirmation-dialogue.component';
import { RecentNewsModule } from '../../dashboard/recent-news/recent-news.module';
import { HttpClientModule } from '@angular/common/http';
import { OrderNewModule } from '../../oms/order/order.module';



@NgModule({
    declarations: [
        TradingDashboardGraphComponent,
        TradingDashboardBuySellComponent,
        BuySellConfirmationDialog,
    ],
    exports: [
        TradingDashboardGraphComponent,
        TradingDashboardBuySellComponent,
        BuySellConfirmationDialog,
    ],
    imports: [
        RouterModule.forChild(TradingDashboardRouting),
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        SharedModule,
        MatToolbarModule,
        FormsModule,
        MatDialogModule,
        RecentNewsModule,
        HttpClientModule, 
        OrderNewModule,
        

    ]
})
export class TradingDashboardModule {
}
