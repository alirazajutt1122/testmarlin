import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import 'bootstrap-markdown/js/bootstrap-markdown.js';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'parsleyjs';
//import 'bootstrap-application-wizard/src/bootstrap-wizard.js';
//import 'twitter-bootstrap-wizard/jquery.bootstrap.wizard.js';
import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'jasny-bootstrap/js/inputmask.js';
//import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
//import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import 'bootstrap-colorpicker';
import 'bootstrap-slider/dist/bootstrap-slider.js';
import 'dropzone/dist/dropzone.js';
import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'jasny-bootstrap/js/inputmask.js';


import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjChartModule } from '@grapecity/wijmo.angular2.chart';


import { OrderNewModule } from '../order/order.module';

// import ChartsModule from '../charts/charts.module';

import { SharedModule } from 'app/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MarketSummary } from './market-summary/market-summary';
import { DialogCmpReports } from './dialog-cmp-reports';
import { ReportsOMS } from './reports-oms';
import { WidgetOMSReports } from './widget-oms-reports';
import { MarketState } from './market-state/market-state';
import { AuthService } from 'app/services-oms/auth-oms.service';
import ChartsModule from '../charts/charts.module';
import { EventLog } from './event-log/event-log';
import { WorkingOrders } from './working-orders/working-orders';
import { EventLogAll } from './event-log-all/event-log-all';
import { WorkingOrdersAll } from './working-orders-all/working-orders-all';
import { StorageService } from 'app/services-oms/storage-oms.service';
import { BondWorkingOrders } from './bond-working-orders/bond-working-orders';
import { ExecutedOrdersAll } from './executed-orders-all/executed-orders-all';
import { ExecutedOrders } from './executed-orders/executed-orders';
import { SymbolDetails } from './symbol-details/symbol-details';
import { SymbolDetailsAll } from './symbol-details-all/symbol-details-all';
import { SecurityChartAll } from './security-chart/security-chart-all';
import { TradingDashboardModule } from '../../trading-portal/trading-dashboard/trading-dashboard.module';
import { ExchangeStats } from './exchange-stats/exchange-stats';

import { MarketWatchEB } from './market-watch-EB/market-watch-EB';
import { ClientMarginDetails } from './client-margin-details/client-margin-details';
import { BondExecutedOrders } from './bond-executed-orders/bond-executed-orders';
import { BondEventLog } from './bond-event-log/bond-event-log';
import { BondSymbolDetails } from './bond-symbol-details/bond-symbol-details';
import { ConfigureAlertComponent } from './alerts/configure-alerts.component';


export const routes = [

    { path: 'market-summary', component: MarketSummary, },
    { path: 'event-log', component: EventLogAll, },
    { path : 'working-orders' , component : WorkingOrdersAll},
    { path : 'market-watch' , component : MarketWatchEB},
    { path : 'executed-orders' , component : ExecutedOrdersAll},
    { path : 'security-detail' , component : SymbolDetailsAll},
    { path : 'security-chart' , component : SecurityChartAll , },
    { path : 'exchange-stats' , component : ExchangeStats , } ,
    { path : 'client-margin-details' , component : ClientMarginDetails},
    { path : 'configure-alerts' , component :  ConfigureAlertComponent},
];

@NgModule({
  imports: [
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
        WjGridModule,
        OrderNewModule,
        AccordionModule,
        TradingDashboardModule,
        ChartsModule,
        TranslateModule,
        HttpClientModule,
        AlertModule,
        TooltipModule,
        RouterModule.forChild(routes)],

  declarations: [
    DialogCmpReports,
    WidgetOMSReports,
    ReportsOMS,
    MarketSummary,
    MarketState,
    EventLog,
    EventLogAll,
    BondEventLog,
    WorkingOrders,
    BondWorkingOrders,
    WorkingOrdersAll,
    ExecutedOrdersAll,
    ExecutedOrders,
    BondExecutedOrders,
    SymbolDetails,
    BondSymbolDetails,
    SymbolDetailsAll,
    SecurityChartAll,
    ExchangeStats,
    ClientMarginDetails,
    MarketWatchEB,
    ConfigureAlertComponent
 ],
  exports: [
    MarketSummary,
    MarketState,
    EventLog,
    WorkingOrders,
    BondWorkingOrders,
    EventLogAll,
    BondEventLog,
    WorkingOrdersAll,
    ExecutedOrdersAll,
    ExecutedOrders,
    BondExecutedOrders,
    SymbolDetails,
    BondSymbolDetails,
    SymbolDetailsAll,
    SecurityChartAll,
    ExchangeStats,
    MarketWatchEB,
    ClientMarginDetails,
    ConfigureAlertComponent
     ],
     providers : [
        AuthService,
        StorageService
     ]
})
export class TradingReportsModule {
  static routes = routes;
}
