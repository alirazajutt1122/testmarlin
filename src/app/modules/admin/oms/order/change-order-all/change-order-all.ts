import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AlertMessage } from 'app/models/alert-message';
import { BestMarket } from 'app/models/best-market';
import { Order } from 'app/models/order';
import { OrderConfirmation } from 'app/models/order-confirmation';
import { SymbolStats } from 'app/models/symbol-stats';

import * as wjcInput from '@grapecity/wijmo.input';
//  import * as jQuery from 'jquery';
 declare var jQuery : any;
import { AppState } from 'app/app.service';
import { AuthService2 } from 'app/services/auth2.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { TranslateService } from '@ngx-translate/core';
import { ComboItem } from 'app/models/combo-item';
import { OrderNewNav } from '../order-new/order-new-nav';
import { Subject } from 'rxjs';
import { OrderChange } from '../order-change/order-change';
import { BondOrderChange } from '../bond-order-change/bond-order-change';



@Component({
    selector: 'change-order-all',
    templateUrl: './change-order-all.html',
    styleUrls: ['../components.style.scss'],
    encapsulation: ViewEncapsulation.None,
  })
export class ChangeOrderAll implements OnInit, AfterViewInit {

   @ViewChild(OrderChange) changeOrderEquity : OrderChange;
   @ViewChild(BondOrderChange) changeOrderBonds : BondOrderChange;

   

   public selectedAssetClass : string =  AppConstants.ASSET_CLASS_EQUITIES;
    public myForm: FormGroup;
    public isSubmitted: boolean;
    public checkClientCode: boolean;

    @Input() modalId : string;

    claims: any;
    order: Order;
    bestMarket: BestMarket;
    symbolStats: SymbolStats;
    orderConfirmation: OrderConfirmation;

    dateFormat = AppConstants.DATE_FORMAT;

    exchanges = [];
    markets = [];
    symbols = [];
    exchange: string;
    market: string;
    symbolExchMktList: any[];
    // traders: any[];
    custodians: any[];
    orderSides: any[];
    orderTypes: any[];
    orderTypesTemp: any[];
    tifOptions: any[];
    qualifiers: any[];
    fromClientList: any[] = [];


    exchangeId: number = 0;
    marketId: number = 0;

    userType: string;
    side: string = '';
    errorMessage: string;
    errorMsg: string;
    statusMsg: string;
    orderConfirmMsg: string = '';
    submitted = false;
    alertMessage: AlertMessage;

    modal = true;
    dialogIsVisible: boolean = false;
    triggerPriceDisable: boolean = true;
    isPriceDisable: boolean = false;
    triggerPriceCollapse: string = 'collapse';

    isFirstSubmission: boolean = false;
    isConfirmationSuccess: boolean = false;
    isConfirmationRejected: boolean = false;
    lang:any

    sideDisabled : boolean = false;
    tradeType: string;





    // -----------------------------------------------------------------

    constructor(private appState: AppState, public authService: AuthService2, private dataService: DataServiceOMS,
      private listingService: ListingService, private orderService: OrderService,
      private _fb: FormBuilder,private translate: TranslateService, public auth2Service : AuthService2) {
      this.claims = this.authService.claims;
      this.userType = AppConstants.userType;
      this.tradeType = AppConstants.tradeType;
      //_______________________________for ngx_translate_________________________________________

      this.lang=localStorage.getItem("lang");
      if(this.lang==null){ this.lang='en'}
      this.translate.use(this.lang)
      //______________________________for ngx_translate__________________________________________

     

    }

    // -----------------------------------------------------------------

    ngOnInit() {

     AppConstants.selectedAssetClass = this.selectedAssetClass;
  
    
    }

    // -----------------------------------------------------------------



    // -----------------------------------------------------------------

    ngAfterViewInit(): void {

    }

    // -----------------------------------------------------------------







    public show=()=> {
        this.selectedAssetClass = AppConstants.selectedAssetClass;
        this.tradeType = AppConstants.tradeType;
        this.auth2Service.tradeChange.next(this.tradeType);
          jQuery('#change-order-all-menu').modal({ backdrop: 'static', keyboard: true });
          jQuery('#change-order-all-menu').modal('show');


        }


        public showFromWO=()=> {
            
            this.selectedAssetClass = AppConstants.selectedAssetClass;
            this.tradeType = AppConstants.tradeType;
            this.auth2Service.tradeChange.next(this.tradeType);
              jQuery('#change-order-all-wo').modal({ backdrop: 'static', keyboard: true });
              jQuery('#change-order-all-wo').modal('show');


        }




    // -----------------------------------------------------------------

    onClose() {
        if(AppConstants.selectedAssetClass == AppConstants.ASSET_CLASS_EQUITIES)
        {
            this.changeOrderEquity.init();
            jQuery('#change-order-all-menu').modal('hide');
            jQuery('#change-order-all-wo').modal('hide');
        }
        else if(AppConstants.selectedAssetClass == AppConstants.ASSET_CLASS_BONDS)
        {

            jQuery('#change-order-all-menu').modal('hide');
            jQuery('#change-order-all-wo').modal('hide');
        }

        AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;

    }






    //Equities Change Order
    public getOrderNo(orderNo, user: string = AppConstants.username)
    {

        this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
        this.changeOrderEquity.loadOrderNo(orderNo , user);            
    }



    //Bonds Change Order
    public loadOrderNo(orderNo, user: string = AppConstants.username)
    {
            this.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;  
            this.changeOrderBonds.loadOrderNo(orderNo , user);
            this.showFromWO();
    }




    // -----------------------------------------------------------------



  public changeAssetClass=(event)=>{
         if(event === AppConstants.ASSET_CLASS_EQUITIES){
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;;
            this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;;
         }
         if(event === AppConstants.ASSET_CLASS_BONDS)
         {
            AppConstants.selectedAssetClass =AppConstants.ASSET_CLASS_BONDS;
            this.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
         }
  }




  }

