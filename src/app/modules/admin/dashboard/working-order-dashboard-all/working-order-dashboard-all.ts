import { Component, ViewEncapsulation, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcGridXlsx from '@grapecity/wijmo.grid.xlsx';
import * as wjcXlsx from '@grapecity/wijmo.xlsx';
import * as JSZip from 'jszip';

import { Market } from 'app/models/market';
import { ComboItem } from 'app/models/combo-item';
import { AppConstants, AppUtility, UserTypes } from 'app/app.utility';
import { AppState } from 'app/app.service';

import { AuthService } from 'app/services-oms/auth-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import { Order } from 'app/models/order';
import { OrderTypes } from 'app/models/order-types';
import { Exchange } from 'app/models/exchange';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';
import { AuthService2 } from 'app/services/auth2.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';

import { Router } from '@angular/router';
import { ShareOrderService } from '../../oms/order/order.service';
import { TranslateService } from '@ngx-translate/core';


declare var jQuery: any;
//import 'slim_scroll/jquery.slimscroll.js';
@Component({
    selector: 'working-order-dashboard-all',
    templateUrl: './working-order-dashboard-all.html',
    encapsulation: ViewEncapsulation.None,
})
export class WorkingOrderDashboardAllComponent implements OnInit {

    loggedInUserType: string;
    participantId: number;
    tradeType: string;
    claims: any;
    lang: string;
    public userType = UserTypes;
    selectedAssetClass : string = AppConstants.ASSET_CLASS_EQUITIES;
    type:any = "workingOrder"


    constructor(private appState: AppState, public authService: AuthService2, private dataService: DataServiceOMS,
        private listingService: ListingService, private orderService: OrderService,
        private _fb: FormBuilder,private translate: TranslateService, public auth2Service : AuthService2, public shareOrderService : ShareOrderService , private router : Router , public cdr : ChangeDetectorRef){


            this.participantId = AppConstants.participantId;
            this.claims = this.authService.claims;
            this.loggedInUserType = AppConstants.userType;
            this.tradeType = AppConstants.tradeType;
            this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;


 //_______________________________for ngx_translate_________________________________________

 this.lang=localStorage.getItem("lang");
 if(this.lang==null){ this.lang='en'}
 this.translate.use(this.lang)
 //______________________________for ngx_translate__________________________________________


        }


    ngOnInit(): void {

    }

}
