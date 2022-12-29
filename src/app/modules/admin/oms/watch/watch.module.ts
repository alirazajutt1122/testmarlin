import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';



import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";

import {MatButtonModule} from "@angular/material/button";

import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WatchRouting } from './watch.routing';
import { DashboardOmsComponent } from './dashboard-oms/dashboard-oms';
import { OrderNewModule } from '../order/order.module';
import { OrderNew } from './order-new/order-new';
import { BondOrderNewWatch } from './bond-order-new/bond-order-new';
import ChartsModule from '../charts/charts.module';
import { MarketWatchCmp } from './market-watch/market-watch';
import { BondMarketWatch } from './bond-market-watch/bond-market-watch';
import { BestPrice } from './best-price/best-price';
import { BestOrders } from './best-orders/best-orders';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { ReportService } from 'app/services-oms/report-oms.service';
import { StorageService } from 'app/services-oms/storage-oms.service';
import { TransactionService } from 'app/services-oms/transaction-oms.service';
import { Widget } from './widget.directive';




@NgModule({
    declarations: [
        DashboardOmsComponent,
        OrderNew,
        BondOrderNewWatch,
        MarketWatchCmp,
        BondMarketWatch,
        BestPrice,
        BestOrders,
        Widget

    ],
    imports: [
        RouterModule.forChild(WatchRouting),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        WjCoreModule,
        WjInputModule,
        WjGridModule,
        WjGridFilterModule,
        WjGridDetailModule,
        OrderNewModule,
        ChartsModule,
        TranslateModule,
        HttpClientModule,
        AlertModule,
        TooltipModule,

    ],
    providers : [
        ListingService,
        DataServiceOMS,
        OrderService,
        ReportService,
        StorageService,
        TransactionService
    ]


})
export class WatchModule {
}
