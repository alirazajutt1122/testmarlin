//angular 
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

//angular forms
import { FormsModule , ReactiveFormsModule} from "@angular/forms";


//wijmo
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjChartModule } from '@grapecity/wijmo.angular2.chart';



//angular material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

//for multilingual translation
import { TranslateModule } from '@ngx-translate/core';

//components
import { CancelQuote } from "./cancel-quote/cancel-quote.component";
import { InitialQuote } from "./intial-quote/initial-quote.component";

//services

import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';



//bootstrap

import { AlertModule } from 'ngx-bootstrap/alert';


@NgModule(
    {
        declarations : [
            CancelQuote ,
            InitialQuote
        ],
        imports : [CommonModule,
                    WjCoreModule,
                    WjInputModule,
                    WjGridModule,
                    WjGridFilterModule,
                    WjChartModule,
                    MatSidenavModule,
                    MatIconModule,
                    MatButtonModule,
                    TranslateModule,
                    HttpClientModule,
                    AlertModule,
                    FormsModule,ReactiveFormsModule],
        exports : [CancelQuote,InitialQuote],
        providers : [OrderService , ListingService, DataServiceOMS]
    }
)

export class QuoteModule{}