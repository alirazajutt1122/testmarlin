
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
declare var jQuery: any;
import { AppState } from 'app/app.service';
import { AuthService2 } from 'app/services/auth2.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { TranslateService } from '@ngx-translate/core';
import { ComboItem } from 'app/models/combo-item';
import { UserTypes } from 'app/app.utility';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ShareOrderService } from '../../order/order.service';
import { NegotiatedEquityInitiateOrderComponent } from './negotiated-equity-initiate-order/negotiated-equity-initiate-order';
import { NegotiatedBondInitiateOrderComponent } from './negotiated-bond-initiate-order/negotiated-bond-initiate-order';
import { NegotiatedEquityAcceptOrderComponent } from './negotiated-equity-accpet-order/negotiated-equity-accept-order';
import { NegotiatedBondAcceptOrderComponent } from './negotiated-bond-accpet-order/negotiated-bond-accept-order';


@Component({
   selector: 'negotiated-deals',
   templateUrl: './negotiated-deals.html',
   styleUrls: ['../../order/components.style.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class NegotiatedDealsComponent implements OnInit, AfterViewInit {

   @Input() modalId: string;


   public isSelectedEquities: boolean = false;
   public selectedAssetClass: string = AppConstants.ASSET_CLASS_EQUITIES;
   public selectedAssetClassData: any = null;
   public selectedAssetClassSide: string = '';

   public userType = UserTypes;
   loggedInUserType: string;

   public myForm: FormGroup;
   public isSubmitted: boolean;
   public checkClientCode: boolean;
   orderState: string = ''

   claims: any;
   order: Order;
   bestMarket: BestMarket;
   symbolStats: SymbolStats;
   orderConfirmation: OrderConfirmation;
   loadIndex: number = 0
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
   lang: any

   sideDisabled: boolean = false;
   tradeType: string;
   participantId: number;
   parentSelectedRow: object = {}


   @ViewChild(NegotiatedEquityInitiateOrderComponent) negotiatiedEquityOrder: NegotiatedEquityInitiateOrderComponent;
   @ViewChild(NegotiatedBondInitiateOrderComponent) negotiatedBondOrder: NegotiatedBondInitiateOrderComponent;

   @ViewChild(NegotiatedEquityAcceptOrderComponent) negotiatiedEquityAcceptOrder: NegotiatedEquityAcceptOrderComponent;
   @ViewChild(NegotiatedBondAcceptOrderComponent) negotiatedBondAcceptOrder: NegotiatedBondAcceptOrderComponent;

   // -----------------------------------------------------------------

   constructor(private appState: AppState, public authService: AuthService2, private dataService: DataServiceOMS,
      private listingService: ListingService, private orderService: OrderService,
      private _fb: FormBuilder, public translate: TranslateService, public auth2Service: AuthService2, public shareOrderService: ShareOrderService, private router: Router, public cdr: ChangeDetectorRef) {
      this.participantId = AppConstants.participantId;
      this.claims = this.authService.claims;
      this.loggedInUserType = AppConstants.userType;
      this.tradeType = AppConstants.tradeType;
      this.selectedAssetClass = AppConstants.selectedAssetClass;
      this.isSelectedEquities = AppConstants.isSelectedEquities;

      //_______________________________for ngx_translate_________________________________________

      this.lang = localStorage.getItem("lang");
      if (this.lang == null) { this.lang = 'en' }
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



   // public show = (transactionData, side, assetClass) => {
   //    debugger
   //    this.selectedAssetClass = AppConstants.selectedAssetClass;
   //    if (AppUtility.isValidVariable(transactionData) && AppUtility.isValidVariable(side) && AppUtility.isValidVariable(assetClass)) {
   //       if (assetClass === AppConstants.ASSET_CLASS_EQUITIES) {
   //          this.selectedAssetClass = assetClass;
   //          AppConstants.selectedAssetClass = this.selectedAssetClass;
   //          this.selectedAssetClassData = transactionData;
   //          this.selectedAssetClassSide = side;
   //          this.isSelectedEquities = true;
   //          AppConstants.isSelectedEquities = this.isSelectedEquities;
   //          this.tradeType = AppConstants.tradeType;
   //          this.auth2Service.tradeChange.next(this.tradeType);

   //          jQuery('#new-order-all-market').modal({ backdrop: 'static', keyboard: true });
   //          jQuery('#new-order-all-market').modal('show');
   //       }
   //    }
   //    else {
   //       this.tradeType = AppConstants.tradeType;
   //       this.auth2Service.tradeChange.next(this.tradeType);
   //       jQuery('#new-negotiated-order-all-menu').modal({ backdrop: 'static', keyboard: true });
   //       jQuery('#new-negotiated-order-all-menu').modal('show');
   //    }
   // }



   public showMenu = (state) => {
      debugger
      this.orderState = state
      this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;

      this.tradeType = AppConstants.tradeType;
      this.auth2Service.tradeChange.next(this.tradeType);
      jQuery('#new-negotiated-order-all-menu').modal({ backdrop: 'static', keyboard: true });
      jQuery('#new-negotiated-order-all-menu').modal('show');

   }


   public initiatedOrder = (state, selectedRow, assetClass) => {
      debugger
      this.loadIndex = this.loadIndex + 1;
      this.orderState = state;
      this.parentSelectedRow = selectedRow;

      this.tradeType = AppConstants.tradeType;
      this.auth2Service.tradeChange.next(this.tradeType);

      if (assetClass == AppConstants.ASSET_CLASS_ID_EQUITIES) {
         this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;

         jQuery('#negotiated-equity-accpet').modal({ backdrop: 'static', keyboard: true });
         jQuery('#negotiated-equity-accpet').modal('show');
      }
      else if (assetClass == AppConstants.ASSET_CLASS_ID_BONDS) {
         this.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
      }
      else if (assetClass == AppConstants.ASSET_CLASS_ID_ETFS) {
         this.selectedAssetClass = AppConstants.ASSET_CLASS_ETF;
      }
      else {
         this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
      }




   }

   // -----------------------------------------------------------------

   onClose() {
      debugger
      if (this.orderState === 'new') {
         if (AppConstants.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES) {
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            this.negotiatiedEquityOrder.init();
            jQuery('#new-negotiated-order-all-menu').modal('hide');
         }
         else if (AppConstants.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS) {
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            this.negotiatedBondOrder.init();
            jQuery('#new-negotiated-order-all-menu').modal('hide');
         }
      }


      else if (this.orderState === 'Initiate') {
         debugger
         if (AppConstants.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES) {
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            // this.negotiatiedEquityAcceptOrder.init();
            // jQuery('#negotiated-equity-accpet').modal('hide');
            this.negotiatiedEquityAcceptOrder.onClose();


         }
         else if (AppConstants.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS) {
            AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            // this.negotiatedBondAcceptOrder.init();
            // jQuery('#negotiated-bond-accpet').modal('hide');
         }
      }

      this.selectedAssetClassData = null;
      this.selectedAssetClassSide = '';
      this.orderState = ''
      this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;

   }

   // -----------------------------------------------------------------

   public changeAssetClass = (event) => {
      if (event === AppConstants.ASSET_CLASS_EQUITIES) {
         AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
         AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
         this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
      }
      if (event === AppConstants.ASSET_CLASS_BONDS) {
         AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
         AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
         this.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
      }
   }

}

