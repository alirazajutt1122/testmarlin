import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import 'bootstrap-markdown/js/bootstrap-markdown.js';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'parsleyjs';

import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
import 'jasny-bootstrap/js/fileinput.js';
import 'jasny-bootstrap/js/inputmask.js';

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

// import ChartsModule from '../charts/charts.module';

import { SharedModule } from 'app/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { StorageService } from 'app/services-oms/storage-oms.service';
import { WorkingOrderDashboardAllComponent } from './working-order-dashboard-all';
import { WorkingOrderDashboardComponent } from './working-orders-dashboard/working-orders-dashboard';
import { AuditTrailDashboardComponent } from './audit-trails-dashboard/audit-trails-dashboard';
import { TradesDashboardComponent } from './trades-dashboard/trades-dashboard';
import { OrderNewModule } from '../../oms/order/order.module';









@NgModule({
    declarations: [
        WorkingOrderDashboardAllComponent,
        WorkingOrderDashboardComponent,
        AuditTrailDashboardComponent,
        TradesDashboardComponent
    ],
    exports: [
        WorkingOrderDashboardAllComponent,
        WorkingOrderDashboardComponent,
        AuditTrailDashboardComponent,
        TradesDashboardComponent

    ],
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
        AccordionModule,
        TranslateModule,
        HttpClientModule,
        AlertModule,
        TooltipModule,
        OrderNewModule
    ],

    providers: [

    ]
})

export class WorkingOrderDashbordAllModule {
}

