'use strict';

import { Component, ViewEncapsulation, ViewChild, OnInit,Input, AfterViewInit,EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcInput from '@grapecity/wijmo.input';
import { WjPopup } from '@grapecity/wijmo.angular2.input';
import { TranslateService } from '@ngx-translate/core';
import { Order } from 'app/models/order';
import { SecurityMarketDetails } from 'app/models/security-market-details';
import { CancelOrder } from 'app/models/Order-cancel';
import { BestMarket } from 'app/models/best-market';
import { SymbolStats } from 'app/models/symbol-stats';
import { OrderConfirmation } from 'app/models/order-confirmation';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import { AlertMessage } from 'app/models/alert-message';
import { AppConstants, AppUtility } from 'app/app.utility';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AppState } from 'app/app.service';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { ComboItem } from 'app/models/combo-item';
import { AuthService } from 'app/services-oms/auth-oms.service';



declare var jQuery: any;

///////////////////////////////////////////////////////////////////////

@Component({
  selector: 'bond-order-cancel',
  templateUrl: './bond-order-cancel.html',
  styleUrls: ['../components.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BondOrderCancel implements OnInit, AfterViewInit
{
  public myForm: FormGroup;
  public isSubmitted: boolean;

  @Input() modalId: string;

  claims: any;

  order: Order;
  securityMarketDetails: SecurityMarketDetails;
  cancelOrder: CancelOrder;
  bestMarket: BestMarket;
  symbolStats: SymbolStats;
  orderConfirmation: OrderConfirmation;

  dateFormat = AppConstants.DATE_FORMAT;

  exchangeData: any[];
  markets = [];
  symbols = [];
  exchange: string;
  market: string;
  symbolExchMktList: any[];
  custodians: any[];
  orderSides: any[];
  orderTypes: any[];
  orderTypesTemp: any[];
  orderQualifiers: any[];

  usersOmsReports: UsersOmsReports;

  exchangeId: number = 0;
  marketId: number = 0;

  userType: string;
  side: string = '';
  errorMsg: string;
  statusMsg: string;
  orderConfirmMsg: string = '';
  submitted = false;
  alertMessage: AlertMessage;

  modal = true;
  dialogIsVisible: boolean = false;
  triggerPriceDisable: boolean = true;
  triggerPriceCollapse: string = 'collapse';

  isOrderNotFound: boolean = true;
  isPriceDisable: boolean = true;

  isFirstSubmission: boolean = false;
  isConfirmationSuccess: boolean = false;
  isConfirmationRejected: boolean = false;
  isBondPricingMechanismPercentage: boolean = true ;
  isBondPricingModelDirty: boolean = false;
  lang:any

  errorMessage: string;

  @ViewChild('orderSubmittedDlg',{ static: false }) orderSubmittedDlg: wjcInput.Popup;
  @ViewChild('orderNo',{ static: false }) orderNo: wjcInput.InputMask;
  @ViewChild('inputVolume',{ static: false }) inputVolume: wjcInput.InputNumber;
  @ViewChild('inputPrice',{ static: false }) inputPrice: wjcInput.InputNumber;
  @ViewChild('subCategory',{ static: false }) subCategory: wjcInput.InputMask;
  @ViewChild('dialogCmp',{ static: false }) dialogCmp: DialogCmp;

  onInitialized = new EventEmitter<BondOrderCancel>();

  // ----------------------------------------------------------------------

  constructor(private appState: AppState, public authService: AuthService2, public authServiceOMS : AuthService, private listingService: ListingService,
              private dataService: DataServiceOMS, private orderService: OrderService,
              private _fb: FormBuilder,private translate: TranslateService)
  {
    this.claims = this.authService.claims;
    this.userType = AppConstants.userType;
        //_______________________________for ngx_translate_________________________________________

        this.lang=localStorage.getItem("lang");
        if(this.lang==null){ this.lang='en'}
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
  }

  // ----------------------------------------------------------------------

  ngOnInit()
  {
    this.addFromValidations();

    this.init();
  }

  // ----------------------------------------------------------------------

  init()
  {
    let exchCode: string = '';
    let mktCode: string = '';

    this.isConfirmationSuccess = false;
    this.isConfirmationRejected = false;

    // this.orderNo.focus();
    this.symbolStats = new SymbolStats();
    this.isSubmitted = false;
    this.order = new Order();
    this.securityMarketDetails = new SecurityMarketDetails();
    this.cancelOrder = new CancelOrder();
    this.isFirstSubmission = false;
    this.bestMarket = new BestMarket();
    this.symbolStats = new SymbolStats();
    this.orderConfirmation = new OrderConfirmation();
    this.alertMessage = new AlertMessage();

    this.usersOmsReports = new UsersOmsReports();

    this.orderTypesTemp = this.orderTypes;
  }


  // ----------------------------------------------------------------------

  ngAfterViewInit()
  {
    this.authServiceOMS.socket.on('order_confirmation', (dataorderConfirmation) => { this.updateorderConfirmation(dataorderConfirmation); });
    this.authServiceOMS.socket.on('best_market', (dataBM) => { this.updateBestMarketData(dataBM); });
    this.authServiceOMS.socket.on('symbol_stat', (dataSS) => { this.updateSymbolStatsData(dataSS); });

    this.orderNo.focus();
  }

  // ----------------------------------------------------------------------

  show()
  {
    this.init();

    jQuery('#cancelBond_dialogBox').modal({ backdrop: 'static', keyboard: true });
    jQuery('#cancelBond_dialogBox').modal('show');
  }

  // ----------------------------------------------------------------------

  onClose()
  {
    this.init();
    jQuery('#cancel-order-all-menu').modal('hide');
    jQuery('#cancel-order-all-wo').modal('hide');
    AppConstants.selectedAssetClass = 'equities';
  }

  showFromWorkingOrders()
  {
    jQuery('#cancel_dialogModalWO').modal('show');
  }
  // ----------------------------------------------------------------------

  orderNoChanged()
  {
    let temp = this.order.order_no;
    this.clearOrder();
    this.order.order_no = temp;
  }

  // ----------------------------------------------------------------------

  updateSymbolList(data)
  {
    let symbolList: any[] = [];
    let cmbItem: ComboItem;
    let bondIndex: number = 0;
    if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data))
    {
      for (let i = 0; i < data.length; i++)
      {
        if (data[i].marketTypeCode === AppConstants.MARKET_TYPE_BOND)
        {
          symbolList[bondIndex] = data[i];
          symbolList[bondIndex].value = data[i].displayName_;
          bondIndex++;
        }
      }

      cmbItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
      symbolList.unshift(cmbItem);
      this.order.symbolMktExch = '';
    }

    this.symbolExchMktList = symbolList;
  }

  // ----------------------------------------------------------------------

  updateBestMarketData(data)
  {
  }

  // ----------------------------------------------------------------------

  updateSymbolStatsData(data)
  {
    if (this.order.symbol === data.symbol)
    {
      this.symbolStats.updateSymbolStatsForOrderWindow(data);
    }
  }

  // ----------------------------------------------------------------------

  updateorderConfirmation(data)
  {
    this.clearOrder();
    this.securityMarketDetails = new SecurityMarketDetails();
    this.orderNo.focus();
    let alertMessage: AlertMessage = this.order.formatOrderConfirmationMsg(data,'Bond');
    this.alertMessage = alertMessage;
    this.showOrderConfirmationMsg();
  }

  // ----------------------------------------------------------------------

  showOrderConfirmationMsg()
  {
    if (this.alertMessage.type === 'success')
    {
      this.isConfirmationSuccess = true;
      this.isConfirmationRejected = false;
    }
    else if (this.alertMessage.type === 'danger')
    {
      this.isConfirmationRejected = true;
      this.isConfirmationSuccess = false;
    }

    setTimeout(() =>
    {
      this.isConfirmationRejected = false;
      this.isConfirmationSuccess = false;
    }, AppConstants.TIME_OUT_CONFIRMATION_MSG);

  }

  // ----------------------------------------------------------------------

  closeAlert()
  {
    this.isConfirmationSuccess = false;
    this.isConfirmationRejected = false;
  }

  // ----------------------------------------------------------------------

  onAlertCancel(): void
  {
    this.orderNo.focus();
  }

  // ----------------------------------------------------------------------

  showDialog(dlg: wjcInput.Popup)
  {
    if (dlg)
    {
      let inputs = <NodeListOf<HTMLInputElement>>dlg.hostElement.querySelectorAll('input');
      for (let i = 0; i < inputs.length; i++)
      {
        if (inputs[i].type !== 'checkbox')
        {
          inputs[i].value = '';
        }
      }

      dlg.modal = this.modal;
      dlg.hideTrigger = dlg.modal ? wjcInput.PopupTrigger.None : wjcInput.PopupTrigger.Blur;
      dlg.show();
    }
  };

  // ----------------------------------------------------------------------

  cancelOrderSubmit(model: any, isValid: boolean)
  {
    this.isSubmitted = true;
    this.order.order_no = this.order.order_no.replace(',', '');

    if (this.order.order_no.trim().length === 0)
    {
      this.orderNo.focus();
    }
    else if (this.order.order_no.trim().length > 0 && this.order.symbol.length > 0 && this.validateOrder())
    {
      this.order.type_ = this.order.type_.toLowerCase();
      this.cancelOrder.order = this.order;

      this.cancelOrder.order.type = this.order.type_.toLowerCase();
      this.statusMsg = this.cancelOrder.formatOrderSubmitMsg('Bond');

      this.showDialog(this.orderSubmittedDlg);
    }
    else
    {
      this.statusMsg = '';
      this.getOrder();
    }

    return false;
  }


  // ----------------------------------------------------------------------

  clearOrder(): void
  {
    this.order = new Order();
    this.cancelOrder = new CancelOrder();
    this.symbolStats = new SymbolStats();
    this.order.clearOrder();
    this.statusMsg = '';
    this.isOrderNotFound = true;
    this.isPriceDisable = true;

  }

  // ----------------------------------------------------------------------

  updateOrder(orderResponse): void
  {
    if (!this.authService.isAuhtorized(this.authService.OM_BOND_ORDER_CANCEL))
      return;

    let marketTypeCode = this.dataService.getMarketType(orderResponse.order[0].exchange,
                                                        orderResponse.order[0].market,
                                                        orderResponse.order[0].symbol);

    if (marketTypeCode !== AppConstants.MARKET_TYPE_BOND)
      return;

    this.isOrderNotFound = false;
    this.isPriceDisable = false;
    this.order.setOrder(orderResponse.order[0]);
    this.securityMarketDetails = this.dataService.getSecurityMarketDetails(this.order.exchange, this.order.market, this.order.symbol);
    this.getBondDetails();

    if (this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_SL ||
        this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_SM)
    {
      this.order.type_ = this.order.type_.toUpperCase();

      if (this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_SM)
      {
        this.isPriceDisable = true;
      }
    }
    else
    {
      this.order.type_ = AppUtility.ucFirstLetter(this.order.type_);
    }

    if (!this.dataService.isSymbolSubscribed(this.order.exchange, this.order.market, this.order.symbol))
    {
      this.authServiceOMS.socket.emit('symbol_sub', { 'exchange': this.order.exchange, 'market': this.order.market, 'symbol': this.order.symbol });
    }
    this.getExchangeData(this.order.exchange);
    this.getBestMarketAndSymbolSummary(this.order.exchange, this.order.market, this.order.symbol);

   // this.order.yield = this.securityMarketDetails.calculatePriceToYield(this.order.price_, this.order.volume, this.order.yield , this.isBondPricingMechanismPercentage);

    if (this.isBondPricingMechanismPercentage)
      this.order.value = (this.order.volume * this.order.price_) / 100;
    else
      this.order.value = this.order.volume * this.order.price_;

  }

  // ----------------------------------------------------------------------

  getOrder(user: string = AppConstants.username): void
  {
    this.securityMarketDetails = new SecurityMarketDetails();
    this.securityMarketDetails.fisDetail.couponRate = 0;
    this.isFirstSubmission = false;
    this.order.order_no = this.order.order_no.replace(AppConstants.delimExp, '');
    this.usersOmsReports.users[0] = user;
    this.orderService.getOrder(this.usersOmsReports, this.order.order_no).subscribe(
      data =>
      {
        if (!AppUtility.isEmpty(data))
        {
          this.updateOrder(data);
        }
      },
      error =>
      {
        this.statusMsg = error._body;
        this.orderNo.focus();
        this.errorMsg = <any>error;
        this.dialogCmp.statusMsg = error._body;
        if (this.modalId === 'cancel_dialogBox') {
          this.dialogCmp.cssClass = 'order_dialog';
        }
        this.dialogCmp.showAlartDialog('Error');
      });
  }

  public loadOrderNo(orderNo, user: string = AppConstants.username)
  {
    this.isConfirmationSuccess = false;
    this.isConfirmationRejected = false;

    if (orderNo != null)
    {
      this.order.order_no = orderNo;
      this.orderNo.value = orderNo;
    }

    this.orderNo.focus();

    if (AppUtility.isValidVariable(this.order.order_no) && this.order.order_no.length > 0)
    {
      this.getOrder(user);
    }
  }

  // ----------------------------------------------------------------------

  getBondDetails()
  {
    if (this.securityMarketDetails.exchangeId > 0 &&
        this.securityMarketDetails.marketId > 0 &&
        this.securityMarketDetails.securityId > 0)
    {
      this.appState.showLoader = true;
      this.listingService.getSymbolMarket(this.securityMarketDetails.exchangeId, this.securityMarketDetails.marketId,
        this.securityMarketDetails.securityId)
        .subscribe(data =>
        {
          this.appState.showLoader = false;
          if (AppUtility.isValidVariable(data))
          {
            this.updateSecurityDetails(data);
          }
        },
        error =>
        {
          this.appState.showLoader = false;
          this.errorMsg = <any>error;
        });
    }
  }

  // ----------------------------------------------------------------------

  updateSecurityDetails(data)
  {
    this.securityMarketDetails.updateSecurityMarketData(data);
   // this.order.yield = this.securityMarketDetails.calculatePriceYield(this.order.price);
    this.subCategory.value = this.securityMarketDetails.bondSubCategory.subCategory;
  }

  // ----------------------------------------------------------------------

  submitOrder()
  {
    this.orderService.cancelOrder(this.cancelOrder).subscribe(
      data =>
      {
        AppUtility.printConsole('Data: ' + data);
      },
      error =>
      {
        let alertMessage: AlertMessage = new AlertMessage();
        alertMessage.message = AppUtility.ucFirstLetter(AppUtility.removeQuotesFromStartAndEndOfString(JSON.parse(JSON.stringify(error)).error));
        if (alertMessage.message.length > 0)
        {
          alertMessage.type = 'danger';
        }
        else
        {
          alertMessage.type = 'success';
        }

        this.alertMessage = alertMessage;
        this.showOrderConfirmationMsg();

      });

    this.clearOrder();
    this.orderNo.focus();
  }

  // ----------------------------------------------------------------------

  onVolumeChange(): void
  {
   // this.order.value = Number(this.inputVolume.value) * Number(this.inputPrice.value);
  }

  // ----------------------------------------------------------------------

  onPriceChange(): void
  {
   // this.order.value = Number(this.inputVolume.value) * Number(this.inputPrice.value);
  }

  // ----------------------------------------------------------------------

  validateOrder(): boolean
  {
    let errorMsg: string = '';
    if (this.order.symbol.length === 0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  // ----------------------------------------------------------------------

  addFromValidations()
  {
    this.myForm = this._fb.group({
      orderNo: ['', Validators.compose([Validators.required])],
      symbol: [''],
      exchange: [''],
      market: [''],
      side: [''],
      volume: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      yield: [''],
      account: [''],
      type: [''],
      orderType: [''],
      orderValue: [''],
      trader: [''],
      custodian: [''],
      triggerPrice: [''],
      orderSettlementValue: [''],
      bondType: [''],
      subCategory: [''],
      couponRate: [''],
      lastCouponDate: [''],
      nextCouponDate: [''],
      accrudeProfit: [''],
      maturityDate: [''],
      tenure: [''],
      parValue: [''],

      statusMsg: [''],
      tifOption: [''],
      gtd: [''],
      // gtc: [''],
      qualifier: [''],
      discQuantity: ['']
    });
  }

  // ----------------------------------------------------------------------
  isValidSymbol(symbol: string): boolean
  {
    let isValidSymbol: boolean = false;
    if (AppUtility.isValidVariable(symbol) && !AppUtility.isEmpty(this.symbolExchMktList))
    {
      for (let i = 0; i < this.symbolExchMktList.length; i++)
      {
        if (this.symbolExchMktList[i].securityCode === symbol)
        {
          isValidSymbol = true;
        }
      }
    }

    return isValidSymbol;
  }
  // ----------------------------------------------------------------------
  getExchangeCustodians(exchangeId)
  {
    let obj: ComboItem;
    this.appState.showLoader = true;
    this.listingService.getCustodianByExchange(exchangeId)
      .subscribe(restData =>
      {
        this.appState.showLoader = false;
        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData))
        {
          this.custodians = restData;
          for (let i = 0; i < restData.length; i++)
          {
            this.custodians[i] = new ComboItem(this.custodians[i].participantCode, this.custodians[i].participantCode);
          }

          obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
          this.custodians.unshift(obj);
        }
      },
      error => {this.appState.showLoader = false; this.errorMsg = <any>error});
  }
  // ----------------------------------------------------------------------
  getBestMarketAndSymbolSummary(exchangeCode, marketCode, securityCode)
  {
    if (AppUtility.isValidVariable(exchangeCode) &&
        AppUtility.isValidVariable(marketCode) &&
        AppUtility.isValidVariable(securityCode))
    {
      this.appState.showLoader = true;
      this.orderService.getBestMarketAndSymbolStats(exchangeCode, marketCode, securityCode)
        .subscribe(data =>
        {
          this.appState.showLoader = false;
          if (AppUtility.isValidVariable(data))
          {
            this.updateBestMarketAndSymbolStats(data);
          }
        },
        error => {this.appState.showLoader = true; this.errorMsg = <any>error});
    }
  }
  // ----------------------------------------------------------------------

  updateBestMarketAndSymbolStats(data)
  {
    if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data))
    {
      // update symbol stats
      if (AppUtility.isValidVariable(data.symbol_summary.stats))
      {
        if (this.order.exchange === data.symbol_summary.stats.exchange &&
            this.order.market === data.symbol_summary.stats.market &&
            this.order.symbol.toString().toUpperCase() === data.symbol_summary.symbol.code.toString().toUpperCase())
        {
          data.symbol_summary.stats.symbol = data.symbol_summary.symbol.code;
          this.updateSymbolStatsData(data.symbol_summary.stats);
        }
      }
    }
  }

  public getExchangeData(exchangeCode: string) {
    this.appState.showLoader = true;
    this.listingService.getExchangeByExchangeCode(exchangeCode)
      .subscribe(restData => {
        this.appState.showLoader = false;
        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
          this.exchangeData = restData;
          if (this.exchangeData["bondPricingMechanism"] == 2)
            this.isBondPricingMechanismPercentage = true;
          else
            this.isBondPricingMechanismPercentage = false;

          if (this.exchangeData["bondPricingModel"] == 2)
            this.isBondPricingModelDirty = true;
          else
            this.isBondPricingModelDirty = false;
        } else {
          this.exchangeData = [];
          this.isBondPricingMechanismPercentage = false;
          this.isBondPricingModelDirty = false;
        }
      },
        error => { this.appState.showLoader = false; this.errorMessage = <any>error });
  }

}
