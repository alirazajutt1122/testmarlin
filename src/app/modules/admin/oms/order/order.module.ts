import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

// declare var global: any;

// var markdown = require('markdown').markdown;
// global.markdown = markdown;
import 'bootstrap-markdown/js/bootstrap-markdown.js';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'parsleyjs';
//import 'bootstrap-application-wizard/src/bootstrap-wizard.js';
//import 'twitter-bootstrap-wizard/jquery.bootstrap.wizard.js';
// import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
// import 'jasny-bootstrap/js/fileinput.js';
// import 'jasny-bootstrap/js/inputmask.js';
//import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';
//import 'ng2-datetime/src/vendor/bootstrap-timepicker/bootstrap-timepicker.min.js';
import 'bootstrap-colorpicker';
import 'bootstrap-slider/dist/bootstrap-slider.js';
import 'dropzone/dist/dropzone.js';
// import 'jasny-bootstrap/docs/assets/js/vendor/holder.js';
// import 'jasny-bootstrap/js/fileinput.js';
// import 'jasny-bootstrap/js/inputmask.js';


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


import { SharedModule } from 'app/shared.module';
import { WidgetModule } from 'app/layout/widget/widget.module';
import { OrderChange } from './order-change/order-change';
import { OrderCancel } from './order-cancel/order-cancel';
import { BondOrderNew } from './bond-order-new/bond-order-new';
import { BondOrderChange } from './bond-order-change/bond-order-change';
import { BondOrderCancel } from './bond-order-cancel/bond-order-cancel';
import { MarlinCommonModule } from 'app/common.module';
import { DialogCmpWatch } from '../dialog-component';
import { OrdersEquity } from './orders-equity/orders-equity';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from 'app/services/data.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { OrderNewNav } from './order-new/order-new-nav';
import { NewOrderAll } from './new-order-all/new-order-all';
import { ChangeOrderAll } from './change-order-all/change-order-all';
import { CancelOrderAll } from './cancel-order-all/cancel-order-all';
import { OrderBookShared } from './order-book-shared/order-book-shared';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShareOrderService } from './order.service';
import { OrderNewETF } from './orders-new-etf/order-new-etf';

// import { MarlinCommonModule } from 'app/common.module';

 

@NgModule({
  imports: [
    CommonModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
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
    WjCoreModule,
    WjInputModule,
    WjGridModule,
    TabsModule,
    WjGridFilterModule,
    AccordionModule,
    AlertModule,
     MarlinCommonModule,
    SharedModule,
    TranslateModule,

],
  declarations: [
   OrderNewNav,
   NewOrderAll,
   ChangeOrderAll,
   CancelOrderAll,
    OrderChange,
    OrderCancel,
    BondOrderNew,
    BondOrderChange,
    BondOrderCancel,
    OrdersEquity,
    OrderNewETF,
    DialogCmpWatch,
    OrderBookShared
    ],
  exports: [
    OrderNewNav,
    NewOrderAll,
    ChangeOrderAll,
    CancelOrderAll,
    OrderChange,
    OrderCancel,
    BondOrderNew,
    BondOrderChange,
    BondOrderCancel,
    OrdersEquity,
    OrderNewETF,
    OrderBookShared
    ],
    providers : [
        ShareOrderService,
        DataServiceOMS,
        ListingService,
        OrderService,
    ]

})
export class OrderNewModule {
 // static routes = routes;
}
