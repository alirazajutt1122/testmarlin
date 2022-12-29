import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import 'bootstrap-markdown/js/bootstrap-markdown.js';
import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'parsleyjs';

import 'bootstrap-colorpicker';
import 'bootstrap-slider/dist/bootstrap-slider.js';
import 'dropzone/dist/dropzone.js';



import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';


import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Route, RouterModule } from '@angular/router';


import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';


import { SharedModule } from 'app/shared.module';
import { WidgetModule } from 'app/layout/widget/widget.module';
import { MarlinCommonModule } from 'app/common.module';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataService } from 'app/services/data.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
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
import { RepoOrderComponent } from './repo-order/repo-order';
import { RepoOrderListComponent } from './repo-order-list/repo-order-list';
import { RepoOpenPositionComponent } from './repo-open-position/repo-open-position';
import { RepoBondOrderComponent } from './repo-order/repo-bond-order/repo-bond-order';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';



export const negotiationRoutes = [

//   { path: 'negotiated-deals-list', component: NegotiatedDealsListComponent, },

];

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
    RouterModule.forChild(negotiationRoutes),
],

  declarations: [
    RepoOrderComponent,
    RepoOrderListComponent,
    RepoOpenPositionComponent,
    RepoBondOrderComponent,
  ],
  exports: [
    RepoOrderComponent,
    RepoOrderListComponent,
    RepoOpenPositionComponent,
    RepoBondOrderComponent
  ],
  providers: [
    DataServiceOMS,
    ListingService,
    OrderService,
  ]

})
export class RepoModule {}



