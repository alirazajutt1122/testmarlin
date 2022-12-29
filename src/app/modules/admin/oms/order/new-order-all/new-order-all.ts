import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { UserTypes } from 'app/app.utility';
import { OrderNewNav } from '../order-new/order-new-nav';
import { Subject } from 'rxjs';
import { BondOrderNew } from '../bond-order-new/bond-order-new';
import { ShareOrderService } from '../order.service';
import { Router } from '@angular/router';
import { WebSocketService } from 'app/services/socket/web-socket.service';


@Component({
    selector: 'order-new-all',
    templateUrl: './new-order-all.html',
    styleUrls: ['../components.style.scss'],
    encapsulation: ViewEncapsulation.None,
  })
export class NewOrderAll implements OnInit, AfterViewInit {

   @Input() modalId : string;

    @ViewChild(OrderNewNav) orderNewNav : OrderNewNav;
    @ViewChild(BondOrderNew) bondOrderNew : BondOrderNew;

   public isSelectedEquities : boolean = false;
   public selectedAssetClass : string = AppConstants.ASSET_CLASS_EQUITIES;
   public selectedAssetClassData : any = null;
   public selectedAssetClassSide : string = '';

   public userType = UserTypes;
   loggedInUserType: string;

    public myForm: FormGroup;
    public isSubmitted: boolean;
    public checkClientCode: boolean;

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
    participantId: number;
    loadIndex: number = 0;





    // -----------------------------------------------------------------

    constructor(private appState: AppState, public authService: AuthService2, private dataService: DataServiceOMS,
      private listingService: ListingService, private orderService: OrderService,
      private _fb: FormBuilder,private translate: TranslateService, public auth2Service : AuthService2, public shareOrderService : ShareOrderService , 
      private router : Router , public cdr : ChangeDetectorRef, public socket : WebSocketService,) {
      this.participantId = AppConstants.participantId;
      this.claims = this.authService.claims;
      this.loggedInUserType = AppConstants.userType;
      this.tradeType = AppConstants.tradeType;
      this.selectedAssetClass = AppConstants.selectedAssetClass;
      this.isSelectedEquities = AppConstants.isSelectedEquities;
      

 

      //_______________________________for ngx_translate_________________________________________

      this.lang=localStorage.getItem("lang");
      if(this.lang==null){ this.lang='en'}
      this.translate.use(this.lang)
      //______________________________for ngx_translate__________________________________________





    }

    // -----------------------------------------------------------------

    ngOnInit() {




    }

    // -----------------------------------------------------------------



    // -----------------------------------------------------------------

    ngAfterViewInit(): void {

    }

    // -----------------------------------------------------------------








    public show=(transactionData , side, assetClass)=> {  
        debugger
        this.selectedAssetClass = AppConstants.selectedAssetClass;
        if(AppUtility.isValidVariable(transactionData) && AppUtility.isValidVariable(side) && AppUtility.isValidVariable(assetClass))
        {    let a = 0;
             if(assetClass === AppConstants.ASSET_CLASS_EQUITIES)
             {
                this.selectedAssetClass = assetClass;
                AppConstants.selectedAssetClass = this.selectedAssetClass;
                a = a+1;
                this.loadIndex = this.loadIndex+1;
                this.selectedAssetClassData = transactionData;
                this.selectedAssetClassSide = side;
                this.isSelectedEquities = true;
                AppConstants.isSelectedEquities = this.isSelectedEquities;
                this.tradeType = AppConstants.tradeType;
                this.auth2Service.tradeChange.next(this.tradeType);
               jQuery('#new-order-all-market').modal({ backdrop: 'static', keyboard: true });
               jQuery('#new-order-all-market').modal('show');
             }
            else if(assetClass === AppConstants.ASSET_CLASS_BONDS)
             {
                this.selectedAssetClass = assetClass;
                AppConstants.selectedAssetClass = this.selectedAssetClass;
                this.loadIndex = this.loadIndex+1;
                this.selectedAssetClassData = transactionData;
                this.selectedAssetClassSide = side;
                this.isSelectedEquities = false;
                AppConstants.isSelectedEquities = this.isSelectedEquities;
                this.tradeType = AppConstants.tradeType;
                this.auth2Service.tradeChange.next(this.tradeType);
                jQuery('#new-order-all-market').modal({ backdrop: 'static', keyboard: true });
                jQuery('#new-order-all-market').modal('show');
             }
             else if(assetClass === AppConstants.ASSET_CLASS_ETF)
             {
                this.selectedAssetClass = assetClass;
                AppConstants.selectedAssetClass = this.selectedAssetClass;
                this.loadIndex = this.loadIndex+1;
                this.selectedAssetClassData = transactionData;
                this.selectedAssetClassSide = side;
                this.isSelectedEquities = false;
                AppConstants.isSelectedEquities = this.isSelectedEquities;
                this.tradeType = AppConstants.tradeType;
                this.auth2Service.tradeChange.next(this.tradeType);
                jQuery('#new-order-all-market').modal({ backdrop: 'static', keyboard: true });
                jQuery('#new-order-all-market').modal('show');
             }
        }
        else
        {
            this.tradeType = AppConstants.tradeType;
            this.auth2Service.tradeChange.next(this.tradeType);
              jQuery('#new-order-all-menu').modal({ backdrop: 'static', keyboard: true });
              jQuery('#new-order-all-menu').modal('show');
        }



        }




        public showMenu=()=>{

            this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;

            this.tradeType = AppConstants.tradeType;
            this.auth2Service.tradeChange.next(this.tradeType);
              jQuery('#new-order-all-menu').modal({ backdrop: 'static', keyboard: true });
              jQuery('#new-order-all-menu').modal('show');
        }



    // -----------------------------------------------------------------



    onClose() {

         if(AppConstants.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES)
         {
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            this.orderNewNav.init();
            jQuery('#new-order-all-menu').modal('hide');
            jQuery('#new-order-all-market').modal('hide');
         }
         else if(AppConstants.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS)
         {
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            this.bondOrderNew.init();
            jQuery('#new-order-all-menu').modal('hide');
            jQuery('#new-order-all-market').modal('hide');
         }

         this.selectedAssetClassData = null;
         this.selectedAssetClassSide = '';
        this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
        this.socket.fetchFromChannel("best_orders" , {exchange :  "" , market : "" , symbol : ""});


    }

    // -----------------------------------------------------------------



  public changeAssetClass=(event)=>{
         if(event === AppConstants.ASSET_CLASS_EQUITIES){
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
         }
         if(event === AppConstants.ASSET_CLASS_BONDS)
         {
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
            this.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
         }
         if(event === AppConstants.ASSET_CLASS_ETF)
         {
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_ETF;
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_ETF;
            this.selectedAssetClass = AppConstants.ASSET_CLASS_ETF;
         }
  }




  }

