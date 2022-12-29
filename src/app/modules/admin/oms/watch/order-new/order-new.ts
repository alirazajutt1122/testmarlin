'use strict';

import { Component, ViewEncapsulation, ViewChild, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import * as wjcInput from '@grapecity/wijmo.input';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Order } from 'app/models/order';
import { BestMarket } from 'app/models/best-market';
import { SymbolStats } from 'app/models/symbol-stats';
import { OrderConfirmation } from 'app/models/order-confirmation';
import { AlertMessage } from 'app/models/alert-message';
import { AppState } from 'app/app.service';
import { AuthService2 } from 'app/services/auth2.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { ComboItem } from 'app/models/combo-item';



/////////////////////////////////////////////////////////////////////

@Component({
  selector: 'order-new',
  templateUrl: './order-new.html',
  styleUrls: ['../components.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderNew implements OnInit, AfterViewInit, OnDestroy {
  public myForm: FormGroup;
  public isSubmitted: boolean;
  public checkClientCode:boolean;
  dateFormat = AppConstants.DATE_FORMAT;
  order: Order;
  bestMarket: BestMarket;
  symbolStats: SymbolStats;
  orderConfirmation: OrderConfirmation;

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

  @ViewChild('orderSubmittedDlg',{ static: false }) orderSubmittedDlg: wjcInput.Popup;
  @ViewChild('cmbSymbol',{ static: false }) cmbSymbol: wjcInput.ComboBox;
  @ViewChild('cmbOrderType',{ static: false }) cmbOrderType: wjcInput.ComboBox;
  @ViewChild('cmbOrderSide',{ static: false }) cmbOrderSide: wjcInput.ComboBox;
  @ViewChild('inputVolume',{ static: false }) inputVolume: wjcInput.InputNumber;
  @ViewChild('inputPrice',{ static: false }) inputPrice: wjcInput.InputNumber;
  @ViewChild('account',{ static: false }) account: wjcInput.InputMask;
  @ViewChild('inputTriggerPrice',{ static: false }) inputTriggerPrice: wjcInput.InputNumber;

  // -----------------------------------------------------------------------------

  constructor(private appState: AppState, public authService: AuthService2, private dataService: DataServiceOMS,
    private listingService: ListingService, private orderService: OrderService,
    private _fb: FormBuilder,private translate: TranslateService) {
    this.isSubmitted = false;
    this.checkClientCode = false;
    this.order = new Order();
    this.userType = AppConstants.userType;

    this.isFirstSubmission = false;
    this.bestMarket = new BestMarket();
    this.symbolStats = new SymbolStats();
    this.orderConfirmation = new OrderConfirmation();
    this.alertMessage = new AlertMessage();

    // order Confirmation
    this.authService.socket.on('order_confirmation', (dataorderConfirmation) => {
      this.updateorderConfirmation(dataorderConfirmation);
    });

    // Best Market Data Handling
    this.authService.socket.on('best_market', (dataBM) => { this.updateBestMarketData(dataBM); });
    // Symbol Stats Data Handling
    this.authService.socket.on('symbol_stat', (dataSS) => { this.updateSymbolStatsData(dataSS); });
    //_______________________________for ngx_translate_________________________________________

    this.lang=localStorage.getItem("lang");
    if(this.lang==null){ this.lang='en'}
    this.translate.use(this.lang)
    //______________________________for ngx_translate__________________________________________
  }

  // -----------------------------------------------------------------------------

  ngOnDestroy() {

  }

  // -----------------------------------------------------------------------------

  ngOnInit() {
    // Add form Validations
    this.addFromValidations();

    let exchCode: string = '';
    let mktCode: string = '';

    let symbolItems: any[] = [];

    // this.cmbSymbol.focus();
    // Updating symbol list
    // this.symbolExchMktList = this.orderService.getExchangeMarketSymbols();
    this.symbolExchMktList = [];

    // Getting Participant security exchanges
    if (AppUtility.isValidVariable(this.dataService.symbolsData) && this.dataService.symbolsData.length > 0) {
      this.updateSymbolList(this.dataService.symbolsData);
    }
    else {
      this.appState.showLoader = true;
      this.listingService.getParticipantSecurityExchanges(AppConstants.participantId)
        .subscribe(restData => {
          this.appState.showLoader = false;
          if (AppUtility.isValidVariable(restData)) {
            this.updateSymbolList(restData);
          }
        },
        error => {this.appState.showLoader = false; this.errorMessage = <any>error});
    }

    // Getting order sides
    this.orderSides = this.listingService.getOrderSides();

    // this.cmbSymbol.focus();
    this.symbolStats = new SymbolStats();

    this.orderTypesTemp = this.orderTypes;

    // if (this.userType === 'PARTICIPANT' || this.userType === 'PARTICIPANT ADMIN' )
    // {
    //     this.loadTraders();
    // }

  }

  // -----------------------------------------------------------------------------

  ngAfterViewInit(): void {
    this.cmbSymbol.invalidate();
    this.cmbSymbol.refresh();
    this.cmbSymbol.focus();

  }

  // -----------------------------------------------------------------------------

  updateSymbolList(data) {
    let symbolList: any[] = [];
    let cmbItem: ComboItem;
    let mktIndex: number = 0;
    if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].marketTypeCode !== AppConstants.MARKET_TYPE_BOND ||
          (data[i].marketTypeCode === AppConstants.MARKET_TYPE_BOND &&
            this.authService.isAuhtorized(this.authService.OM_BOND_ORDER_NEW))) {
          symbolList[mktIndex] = data[i];
          symbolList[mktIndex].value = data[i].displayName_;
          mktIndex++;
        }
      }

      cmbItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
      symbolList.unshift(cmbItem);
    }

    this.symbolExchMktList = symbolList;
  }

  // -----------------------------------------------------------------------------

  getOrderTypes(exchangeId, marketId) {
    // Updating order types
    this.appState.showLoader = true;
    this.listingService.getOrderTypesByExchangeMarket(exchangeId, marketId)
      .subscribe(restData => {
        this.appState.showLoader = false;
        this.updateOrderTypesData(restData);
      },
      error => {this.appState.showLoader = false; this.errorMessage = <any>error});
  }

  // -----------------------------------------------------------------------------

  updateOrderTypesData(orderTypesData): void {
    this.orderTypesTemp = [];
    this.orderTypes = [];

    if (!AppUtility.isEmpty(orderTypesData)) {
      for (let i = 0; i < orderTypesData.length; i++) {
        orderTypesData[i].value = orderTypesData[i].code.toLowerCase();
        this.orderTypes.push(orderTypesData[i]);
        this.orderTypesTemp.push(orderTypesData[i]);
      }
    }
  }

  // -----------------------------------------------------------------------------

  // TIF Options
  getTifOptions(exchangeId, marketId) {
    this.tifOptions = [];
    this.appState.showLoader = true;
    this.listingService.getTifOptionsByExchangeMarket(exchangeId, marketId)
      .subscribe(restData => {
        this.appState.showLoader = false;
        this.tifOptions = restData;
      },
      error => {this.appState.showLoader = false; this.errorMessage = <any>error});
  }

  // -----------------------------------------------------------------------------

  // Order Qualifiers
  getOrderQualifiers(exchangeId, marketId) {
    this.qualifiers = [];
    this.appState.showLoader = true;
    this.listingService.getOrderQualifiersByExchangeMarket(exchangeId, marketId)
      .subscribe(restData => {
        this.appState.showLoader = false;
        this.qualifiers = restData;
      },
      error => {this.appState.showLoader = false; this.errorMessage = <any>error});
  }

  // -----------------------------------------------------------------------------

  orderSideChanged(): void {
    this.order.side = this.cmbOrderSide.selectedValue;
    this.updateOrderTypes();
  }

  // -----------------------------------------------------------------------------

  updateOrderTypes(): void {
    this.orderTypes = [];

    if (this.orderTypes != null && this.orderTypesTemp != null) {
      for (let key in this.orderTypesTemp) {
        if (this.orderTypesTemp.hasOwnProperty(key)) {
          let orderType = this.orderTypesTemp[key];

          if (this.order.side === 'buy' &&
            !(orderType.code.toLowerCase() === 'sl' || orderType.code.toLowerCase() === 'sm')) {
            this.orderTypes.push(orderType);
          }
          if (this.order.side === 'sell') {
            this.orderTypes.push(orderType);
          }
        }
      }
    }
  }

  // -----------------------------------------------------------------------------

  updateBestMarketData(data) {
    // console.log("Best Market: " + JSON.stringify(data));
  }

  // -----------------------------------------------------------------------------

  updateSymbolStatsData(data) {
    if (this.order.symbol === data.symbol) {
      this.symbolStats.updateSymbolStatsForOrderWindow(data);
    }
  }

  // -----------------------------------------------------------------------------

  updateorderConfirmation(data) {
    let alertMessage: AlertMessage = this.order.formatOrderConfirmationMsg(data,'Equity');
    this.alertMessage = alertMessage;
    this.showOrderConfirmationMsg();
    this.resetForm();
  }

  // -----------------------------------------------------------------------------

  showOrderConfirmationMsg() {
    if (this.alertMessage.type === 'success') {
      this.isConfirmationSuccess = true;
      this.isConfirmationRejected = false;
    }
    else if (this.alertMessage.type === 'danger') {
      this.isConfirmationRejected = true;
      this.isConfirmationSuccess = false;
    }

    setTimeout(() => {
      this.isConfirmationRejected = false;
      this.isConfirmationSuccess = false;
    }, AppConstants.TIME_OUT_CONFIRMATION_MSG);
  }

  // -----------------------------------------------------------------------------

  closeAlert() {
    this.isConfirmationSuccess = false;
    this.isConfirmationRejected = false;
  }

  // -----------------------------------------------------------------------------

  onAlertOk(): void {
    this.resetForm();
    this.cmbSymbol.focus();
  }

  // -----------------------------------------------------------------------------

  onAlertCancel(): void {
    this.cmbSymbol.focus();
  }

  // -----------------------------------------------------------------------------

  resetForm(): void {
    this.isSubmitted = false;
    this.checkClientCode = false;
    this.order.volume = 0;
    this.order.price_ = 0;
    this.order.value = 0;
    this.order.type_ = 'limit';
    this.order.triggerPrice_ = 0;
    this.statusMsg = '';
    this.fromClientList = [];
  }

  // -----------------------------------------------------------------------------

  showDialog(dlg: wjcInput.Popup) {
    if (dlg) {
      let inputs = <NodeListOf<HTMLInputElement>>dlg.hostElement.querySelectorAll('input');
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type !== 'checkbox') {
          inputs[i].value = '';
        }
      }

      dlg.modal = this.modal;
      dlg.hideTrigger = dlg.modal ? wjcInput.PopupTrigger.None : wjcInput.PopupTrigger.Blur;
      dlg.show();
    }
  };

  // -----------------------------------------------------------------------------

  onSubmit(model: any, isValid: boolean) {
    this.isSubmitted = true;

    if (this.validateOrder()) {
      this.submitted = true;

      this.order.price = this.order.price_.toString();
      this.order.triggerPrice = this.order.triggerPrice_.toString();
      this.order.market = this.order.market.toUpperCase();
      this.statusMsg = this.order.formatOrderSubmitMsg('Equity');

      this.order.type = this.order.type_.toLowerCase();
      if (this.order.qualifier === 'HO') {
        this.order.type = 'ho';
        this.order.disclosedVolume = this.order.discQuantity;
      }

      if (this.order.qualifier === 'IOC') {
        this.order.type = 'ioc';
      }

      if (this.order.qualifier === 'FOK') {
        this.order.type = 'fok';
      }

      if (this.order.tifOption === 'GTC') {
        this.order.type = 'gtc';
      }

      if (this.order.tifOption === 'GTD') {
        this.order.type = 'gtd';
        this.order.expiryDate = AppUtility.toYYYYMMDD(this.order.gtd);
      }

      this.showDialog(this.orderSubmittedDlg);

    }
    else {
      this.isFirstSubmission = false;
    }
  }

  // -----------------------------------------------------------------------------

  submitOrder() {
    let alertMessage: AlertMessage = new AlertMessage();
    this.appState.showLoader = true;
    this.orderService.submitOrder(this.order).subscribe(
      data => {
        this.appState.showLoader = false;
        AppUtility.printConsole('Data: ' + data);
      },
      error => {
        this.appState.showLoader = false;
        alertMessage.message = AppUtility.ucFirstLetter(AppUtility.removeQuotesFromStartAndEndOfString(JSON.parse(JSON.stringify(error))._body));
        if (alertMessage.message.length > 0) {
          alertMessage.type = 'danger';
        }
        else {
          alertMessage.type = 'success';
        }

        this.alertMessage = alertMessage;
        this.showOrderConfirmationMsg();

      });

    this.onAlertOk();
  }

  // -----------------------------------------------------------------------------

  updateExchangeMarketIds() {
    if (AppUtility.isValidVariable(this.symbolExchMktList) && !AppUtility.isEmpty(this.symbolExchMktList)) {
      for (let i = 0; i < this.symbolExchMktList.length; i++) {
        if (this.symbolExchMktList[i].exchangeCode === this.order.exchange &&
          this.symbolExchMktList[i].marketCode === this.order.market &&
          this.symbolExchMktList[i].securityCode === this.order.symbol) {
          this.exchangeId = this.symbolExchMktList[i].exchangeId;
          this.marketId = this.symbolExchMktList[i].marketId;
        }
      }

      this.getOrderTypes(this.exchangeId, this.marketId);
      this.getTifOptions(this.exchangeId, this.marketId);
      this.getOrderQualifiers(this.exchangeId, this.marketId);
      this.getExchangeCustodians(this.exchangeId);
      this.getClientsList(this.exchangeId);
    }
  }

  // -----------------------------------------------------------------------------

  splitSymbolExchMkt() {
    AppUtility.printConsole('selected symbol (order new): ' + this.cmbSymbol.selectedValue);

    try {
      let strArr: any[];
      if (this.cmbSymbol.selectedValue != null && this.cmbSymbol.selectedValue.length > 0
        && this.cmbSymbol.selectedValue.indexOf(AppConstants.LABEL_SEPARATOR) >= 0) {
        strArr = this.cmbSymbol.selectedValue.split(AppConstants.LABEL_SEPARATOR);

        this.order.symbol = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
        this.order.market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
        this.order.exchange = (typeof strArr[2] === 'undefined') ? '' : strArr[2];

        if (this.dataService.isValidSymbol(this.order.exchange, this.order.market, this.order.symbol)) {
          this.errorMsg = undefined;
          this.getBestMarketAndSymbolSummary(this.order.exchange, this.order.market, this.order.symbol);
          this.updateExchangeMarketIds();

          if (!this.dataService.isSymbolSubscribed(this.order.exchange, this.order.market, this.order.symbol)) {
            this.authService.socket.emit('symbol_sub', { 'exchange': this.order.exchange, 'market': this.order.market, 'symbol': this.order.symbol });
          }
        }
      }
    }
    catch (error) {
    }
  }

  // -----------------------------------------------------------------------------

  onSymbolGotFocus(): void {
  }

  // -----------------------------------------------------------------------------

  onSymbolChange(): void {
    this.market = '';
    this.exchange = '';
    this.order.symbol = '';
    this.order.market = '';
    this.order.exchange = '';
    this.statusMsg = '';
    this.symbolStats = new SymbolStats();
    this.cmbSymbol.selectedValue = this.cmbSymbol.text.toUpperCase();
    this.fromClientList = [];
    this.splitSymbolExchMkt();
  }

  // -----------------------------------------------------------------------------

  onVolumeChange(): void {
    this.order.value = Number(this.inputVolume.value) * Number(this.inputPrice.value);
  }

  // -----------------------------------------------------------------------------

  orderTypeChanged(): void {
    if (this.cmbOrderType.selectedValue != null) {
      this.order.type_ = this.cmbOrderType.selectedValue;
      if (this.order.type_.toLowerCase() === 'market' || this.order.type_.toLowerCase() === 'sm') {
        this.order.price_ = 0;
        this.isPriceDisable = true;
      }
      else {
        this.isPriceDisable = false;
      }

      if (this.order.type_.toLowerCase() === 'sl' || this.order.type_.toLowerCase() === 'sm') {
        this.triggerPriceDisable = false;
      }
      else {
        this.order.triggerPrice_ = 0;
        this.triggerPriceDisable = true;
      }

      if (this.order.type_.toLowerCase() === 'limit' || this.order.type_.toLowerCase() === 'sl') {
        this.isPriceDisable = false;
      }
      else {
        this.isPriceDisable = true;
      }
    }
  }

  // -----------------------------------------------------------------------------

  tifOptionChanged(): void {

  }

  // -----------------------------------------------------------------------------

  qualifierChanged(): void {

  }

  // -----------------------------------------------------------------------------

  onPriceChange(): void {
    this.order.value = Number(this.inputVolume.value) * Number(this.inputPrice.value);
  }

  // -----------------------------------------------------------------------------

  validateOrder(): boolean {
    let errorMsg: string = '';
    if (this.cmbSymbol.text === '' || this.cmbSymbol.text === AppConstants.PLEASE_SELECT_STR) {
      // this.statusMsg="Symbol is required";
      this.cmbSymbol.focus();
      return false;
    }
    else if (!this.isValidSymbol(this.order.symbol)) {
      this.errorMsg = 'Invalid Security';
      this.cmbSymbol.focus();
      return false;
    }
    else if (this.order.volume === 0) {
      // this.statusMsg="Volume is required";
      this.inputVolume.focus();
      return false;
    }
    else if (this.order.volume < 0) {
      // this.statusMsg="Volume should be greater than zero";
      this.inputVolume.focus();
      return false;
    }
    else if ((this.order.type_ === 'limit' || this.order.type_ === 'sl') && this.order.price_ === 0) {
      // this.statusMsg="Price is required";
      this.inputPrice.focus();
      return false;
    }
    else if ((this.order.type_ === 'limit' || this.order.type_ === 'sl') && this.order.price_ < 0) {
      // this.statusMsg="Price should be greater than zero";
      this.inputPrice.focus();
      return false;
    }
    else if (!this.order.account || this.order.account.trim().length === 0) {
      this.statusMsg="Client is required";
      this.checkClientCode = true;
      this.account.focus();
      return false;
    }
    else if ((this.order.type_ === 'sl' || this.order.type_ === 'sm') && this.order.triggerPrice_ === 0) {
      // this.statusMsg="Trigger Price is required";
      this.inputTriggerPrice.focus();
      return false;
    }

    return true;
  }

  // -----------------------------------------------------------------------------

  addFromValidations() {
    this.myForm = this._fb.group({
      cmbSymbol: ['', Validators.compose([Validators.required])],
      side: ['', Validators.compose([Validators.required])],
      volume: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      account: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      type: ['', Validators.compose([Validators.required])],
      orderType: ['', Validators.compose([Validators.required])],
      orderValue: ['', Validators.compose([Validators.required])],
      // trader: [''],
      custodian: [''],
      tifOption: [''],
      gtd: [''],
      // gtc: [''],
      qualifier: [''],
      discQuantity: [''],
      yield: [''],
      triggerPrice: ['', Validators.compose([Validators.required])],
      statusMsg: ['']
    });
  }

  // -----------------------------------------------------------------------------

  isValidSymbol(symbol: string): boolean {
    let isValidSymbol: boolean = false;
    if (AppUtility.isValidVariable(symbol) && !AppUtility.isEmpty(this.symbolExchMktList)) {
      for (let i = 0; i < this.symbolExchMktList.length; i++) {
        if (this.symbolExchMktList[i].securityCode === symbol) {
          isValidSymbol = true;
        }
      }
    }

    return isValidSymbol;
  }

  // -----------------------------------------------------------------------------

  getExchangeCustodians(exchangeId) {
    let obj: ComboItem;
    this.appState.showLoader = true;
    this.listingService.getCustodianByExchange(exchangeId)
      .subscribe(restData => {
        this.appState.showLoader = false;
        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
          this.custodians = restData;
          for (let i = 0; i < restData.length; i++) {
            this.custodians[i] = new ComboItem(this.custodians[i].participantCode, this.custodians[i].participantCode);
          }

          obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
          this.custodians.unshift(obj);
        }
      },
      error => {this.appState.showLoader = false; this.errorMessage = <any>error});
  }
getClientsList(exchangeId){
  this.appState.showLoader = true;
  this.listingService.getClientListByExchangeBroker(exchangeId, AppConstants.participantId, true, true)
      .subscribe(restData => {
        this.appState.showLoader = false;
        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
          this.fromClientList = restData;
        }else{
          this.fromClientList = [];
        }
      },
      error => {this.appState.showLoader = false; this.errorMessage = <any>error});
}
  // -------------------------------------------------------------------------

  // loadTraders(): void
  // {
  //     this.listingService.getUserList(AppConstants.participantId).subscribe(
  //         restData =>
  //         {
  //             if (restData == null)
  //             {
  //                 return;
  //             }

  //             this.traders = [];
  //             for (let i = 0; i < restData.length; i++)
  //             {
  //               this.traders[i] = new ComboItem((<any>restData[i]).userName, (<any>restData[i]).email);
  //             }

  //             this.traders.unshift(new ComboItem(AppConstants.PLEASE_SELECT_STR, ''));
  //         },
  //         error =>
  //         {
  //             this.errorMessage = <any>error;
  //         });
  // }

  // -----------------------------------------------------------------------------

  getBestMarketAndSymbolSummary(exchangeCode, marketCode, securityCode) {
    if (AppUtility.isValidVariable(exchangeCode) &&
      AppUtility.isValidVariable(marketCode) && AppUtility.isValidVariable(securityCode)) {

        this.appState.showLoader = true;
      this.orderService.getBestMarketAndSymbolStats(exchangeCode, marketCode, securityCode)
        .subscribe(data => {
          this.appState.showLoader = false;
          if (AppUtility.isValidVariable(data)) {
            this.updateBestMarketAndSymbolStats(data);
          }
        },
        error => {this.appState.showLoader = false; this.errorMessage = <any>error});
    }
  }

  // -----------------------------------------------------------------------------

  updateBestMarketAndSymbolStats(data) {
    if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
      // update symbol stats
      if (AppUtility.isValidVariable(data.symbol_summary.stats)) {
        if (this.order.exchange === data.symbol_summary.stats.exchange
          && this.order.market === data.symbol_summary.stats.market
          && this.order.symbol.toString().toUpperCase() === data.symbol_summary.symbol.code.toString().toUpperCase()) {
          data.symbol_summary.stats.symbol = data.symbol_summary.symbol.code;
          this.updateSymbolStatsData(data.symbol_summary.stats);
        }
      }
    }
  }

  // -----------------------------------------------------------------------------

  loadSelectedSymbolFromMarketWatch() {
    this.order.symbolMktExch = this.dataService.symbolMktExch;
    this.cmbSymbol.selectedValue = this.dataService.symbolMktExch;
    this.cmbSymbol.text = this.dataService.symbolMktExch;

    this.onSymbolChange();

    if (this.dataService.symbolMktExch.length > 0) {
      this.cmbOrderSide.focus();
    }
    else {
      this.cmbSymbol.focus();
    }
  }

}
