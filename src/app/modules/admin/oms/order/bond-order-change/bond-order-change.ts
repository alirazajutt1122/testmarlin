import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AlertMessage } from 'app/models/alert-message';
import { BestMarket } from 'app/models/best-market';
import { Order } from 'app/models/order';
import { ChangeOrder } from 'app/models/Order-change';
import { OrderConfirmation } from 'app/models/order-confirmation';
import { SecurityMarketDetails } from 'app/models/security-market-details';
import { SymbolStats } from 'app/models/symbol-stats';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import * as wjcInput from '@grapecity/wijmo.input';
import { AuthService2 } from 'app/services/auth2.service';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogCmpWatch } from '../../dialog-component';

// import * as jQuery from 'jquery';
declare var jQuery: any;

import { ComboItem } from 'app/models/combo-item';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { ThisWeekExpression } from 'igniteui-angular-core';


@Component({
  selector: 'bond-order-change',
  templateUrl: './bond-order-change.html',
  styleUrls: ['../components.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BondOrderChange implements OnInit, AfterViewInit {

  public myForm: FormGroup;
  public isSubmitted: boolean;

  @Input() modalId: string;

  claims: any;
  order: Order;
  securityMarketDetails: SecurityMarketDetails;
  changeOrder: ChangeOrder;
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
  securityId: number = 0;

  userType: string;
  side: string = '';
  errorMsg: string;
  statusMsg: string;
  orderConfirmMsg: string = '';
  submitted = false;
  alertMessage: AlertMessage;

  errorMessage: string;

  modal = true;
  dialogIsVisible: boolean = false;
  triggerPriceDisable: boolean = true;
  triggerPriceCollapse: string = 'collapse';

  isOrderNotFound: boolean = true;
  isPriceDisable: boolean = true;

  isFirstSubmission: boolean = false;
  isConfirmationSuccess: boolean = false;
  isConfirmationRejected: boolean = false;
  isBondPricingMechanismPercentage: boolean = true;
  isBondPricingModelDirty: boolean = false;
  public isDisable: boolean = false;
  lang: any;
  accruedInterest: number = 0;

  @ViewChild('orderSubmittedDlg', { static: false }) orderSubmittedDlg: wjcInput.Popup;
  @ViewChild('orderNo', { static: false }) orderNo: wjcInput.InputMask;
  @ViewChild('inputVolume', { static: false }) inputVolume: wjcInput.InputNumber;
  @ViewChild('inputPrice', { static: false }) inputPrice: wjcInput.InputNumber;
  @ViewChild('inputYield', { static: false }) inputYield: wjcInput.InputNumber;
  @ViewChild('subCategory', { static: false }) subCategory: wjcInput.InputMask;
  @ViewChild('dialogCmp', { static: false }) dialogCmp: DialogCmpWatch;

  onInitialized = new EventEmitter<BondOrderChange>();

  // ---------------------------------------------------------------------

  constructor(private appState: AppState, public authService: AuthService2, public authServiceOMS: AuthService, private listingService: ListingService,
    private dataService: DataServiceOMS, private orderService: OrderService,
    private _fb: FormBuilder, private translate: TranslateService) {
    this.claims = this.authService.claims;
    this.userType = AppConstants.userType;
    this.isDisable = false;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngx_translate__________________________________________
  }

  // ---------------------------------------------------------------------

  ngOnInit() {
      
    this.addFromValidations();

    this.init();
  }

  // ---------------------------------------------------------------------

  init() {
    let exchCode: string = '';
    let mktCode: string = '';

    this.isConfirmationSuccess = false;
    this.isConfirmationRejected = false;

    // this.orderNo.focus();
    // this.orderNo.value='';

    this.symbolStats = new SymbolStats();
    this.isSubmitted = false;
    this.order = new Order();
    this.order.order_no = null;
    this.securityMarketDetails = new SecurityMarketDetails();
    this.changeOrder = new ChangeOrder();
    this.isFirstSubmission = false;
    this.bestMarket = new BestMarket();
    this.symbolStats = new SymbolStats();
    this.orderConfirmation = new OrderConfirmation();
    this.alertMessage = new AlertMessage();

    this.usersOmsReports = new UsersOmsReports();
    this.orderTypesTemp = this.orderTypes;
    this.isDisable = false;
  }

  // ---------------------------------------------------------------------

  ngAfterViewInit() {
    this.authServiceOMS.socket.on('order_confirmation', (dataorderConfirmation) => { this.updateorderConfirmation(dataorderConfirmation); });
    this.authServiceOMS.socket.on('best_market', (dataBM) => { this.updateBestMarketData(dataBM); });
    this.authServiceOMS.socket.on('symbol_stat', (dataSS) => { this.updateSymbolStatsData(dataSS); });

    this.orderNo.focus();
    this.orderNo.value = '';
  }

  // ----------------------------------------------------------------------

  updateBestMarketData(data) {
  }

  // ---------------------------------------------------------------------

  show() {
    this.init();
    this.orderNo.value = '';
    this.order = new Order();
    this.order.order_no = null;
    jQuery('#editBond_dialogBox').modal({ backdrop: 'static', keyboard: true });
    jQuery('#editBond_dialogBox').modal('show');
    this.orderNo.value = '';
    this.order = new Order();
    this.order.order_no = null;
  }

  // ---------------------------------------------------------------------

  onClose() {

    this.orderNo.value = '';
    this.order = new Order();
    this.order.order_no = null;
    //jQuery('#editBond_dialogBox').on('hidden.bs.modal', function () {$(this).find('form').trigger('reset'); })
    this.init();
    jQuery('#change-order-all-menu').modal('hide');
    jQuery('#change-order-all-wo').modal('hide');
    AppConstants.selectedAssetClass = 'equities';

  }

  showFromWorkingOrders() {
    jQuery('#change-order-all-wo').modal({ backdrop: 'static', keyboard: true });
    jQuery('#change-order-all-wo').modal('show');
  }

  public loadOrderNo(orderNo, user: string = AppConstants.username) {
    debugger
    this.isConfirmationSuccess = false;
    this.isConfirmationRejected = false;
    this.isDisable = false;

    if (orderNo != null) {
      this.order.order_no = orderNo;
      this.orderNo.value = orderNo;
      this.isDisable = true;
    }
    else
      this.isDisable = false;

    this.orderNo.focus();

    if (AppUtility.isValidVariable(this.order.order_no) && this.order.order_no.length > 0) {
      this.getOrder(user);
    }
  }
  // ---------------------------------------------------------------------

  orderNoChanged() {
    this.isDisable = false;
    let temp = this.order.order_no;
    this.clearOrder();
    this.order.order_no = temp;
  }

  // ---------------------------------------------------------------------

  updateSymbolList(data) {
    let symbolList: any[] = [];
    let cmbItem: ComboItem;
    let bondIndex: number = 0;
    if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].marketTypeCode === AppConstants.MARKET_TYPE_BOND) {
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

  // ---------------------------------------------------------------------

  updateSymbolStatsData(data) {
    if (this.order.symbol === data.symbol) {
      this.symbolStats.updateSymbolStatsForOrderWindow(data);
    }
  }

  // ---------------------------------------------------------------------

  updateorderConfirmation(data) {
    this.clearOrder();
    this.securityMarketDetails = new SecurityMarketDetails();
    this.orderNo.focus();
    let alertMessage: AlertMessage = this.order.formatOrderConfirmationMsg(data, 'Bond');
    this.alertMessage = alertMessage;
    this.showOrderConfirmationMsg();
  }

  // ---------------------------------------------------------------------

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

  // ---------------------------------------------------------------------

  closeAlert() {
    this.isConfirmationSuccess = false;
    this.isConfirmationRejected = false;
  }

  // ---------------------------------------------------------------------

  onAlertCancel(): void {
    this.orderNo.focus();
  }

  // ---------------------------------------------------------------------

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

  // ---------------------------------------------------------------------

  changeOrderSubmit(model: any, isValid: boolean) {
    this.isSubmitted = true;
    this.order.order_no = this.order.order_no.replace(',', '');

    if (this.order.order_no.trim().length === 0) {
      this.orderNo.focus();
    }
    else if (this.order.order_no.trim().length > 0 && this.order.symbol.length > 0 && this.validateOrder()) {
      this.order.type_ = this.order.type_.toLowerCase();
      this.changeOrder.order = this.order;
      this.changeOrder.price = String(this.changeOrder.price_);
      this.changeOrder.volume = this.changeOrder.volume;

      this.changeOrder.order.type = this.order.type_.toLowerCase();
      this.statusMsg = this.changeOrder.formatOrderSubmitMsg('Bond');
      AppUtility.printConsole('order msg:' + this.statusMsg);

      this.showDialog(this.orderSubmittedDlg);
    }
    else {
      this.statusMsg = '';
      this.getOrder();
    }

    return false;
  }

  // ---------------------------------------------------------------------

  clearOrder(): void {
    this.order = new Order();
    this.changeOrder = new ChangeOrder();
    this.symbolStats = new SymbolStats();
    this.order.clearOrder();
    this.statusMsg = '';
    this.isOrderNotFound = true;
    this.isPriceDisable = true;
    this.isDisable = false;
  }

  // ---------------------------------------------------------------------

  updateOrder(orderResponse): void {
    if (!this.authService.isAuhtorized(this.authService.OM_BOND_ORDER_CHANGE))
      return;

    let marketTypeCode = this.dataService.getMarketType(orderResponse.order[0].exchange,
      orderResponse.order[0].market,
      orderResponse.order[0].symbol);

       
    if (marketTypeCode !== AppConstants.MARKET_TYPE_BOND && marketTypeCode !== AppConstants.MARKET_TYPE_QUOTE_
       && marketTypeCode !== AppConstants.MARKET_TYPE_ETF_ ) 
      return;

    this.isOrderNotFound = false;
    this.isPriceDisable = false;
    this.order.setOrder(orderResponse.order[0]);
    this.securityMarketDetails = this.dataService.getSecurityMarketDetails(this.order.exchange, this.order.market, this.order.symbol);
    this.getBondDetails();
    if (this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_SL ||
      this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_SM) {
      this.order.type_ = this.order.type_.toUpperCase();

      if (this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_SM) {
        this.isPriceDisable = true;
      }
    }
    else {
      this.order.type_ = AppUtility.ucFirstLetter(this.order.type_);
    }

    this.changeOrder.price = this.order.price;
    this.changeOrder.price_ = Number(this.order.price);
    this.changeOrder.volume = Number(this.order.volume);
    this.changeOrder.yield = Number(this.order.yield);

    if (!this.dataService.isSymbolSubscribed(this.order.exchange, this.order.market, this.order.symbol)) {
      this.authServiceOMS.socket.emit('symbol_sub', { 'exchange': this.order.exchange, 'market': this.order.market, 'symbol': this.order.symbol });
    }
    this.getExchangeData(this.order.exchange);
    this.getBestMarketAndSymbolSummary(this.order.exchange, this.order.market, this.order.symbol);

    this.order.yield = this.securityMarketDetails.calculatePriceToYield(this.changeOrder.price_, this.changeOrder.volume, this.changeOrder.yield, this.isBondPricingMechanismPercentage);

    
 
    console.log("settlement amount 1" + this.order.settlementValue); 
  }

  // ---------------------------------------------------------------------

  getBondDetails() {
    if (this.securityMarketDetails.exchangeId > 0 && this.securityMarketDetails.marketId > 0
      && this.securityMarketDetails.securityId > 0) {
      this.appState.showLoader = true;
      this.listingService.getSymbolMarket(this.securityMarketDetails.exchangeId,
        this.securityMarketDetails.marketId,
        this.securityMarketDetails.securityId)
        .subscribe(data => {
          this.appState.showLoader = false;
          if (AppUtility.isValidVariable(data)) {
            this.updateSecurityDetails(data);
          }
        },
          error => {
            this.appState.showLoader = false;
            this.errorMsg = <any>error;
          });
    }
  }

  // ---------------------------------------------------------------------

  updateSecurityDetails(data) {
    this.securityMarketDetails.updateSecurityMarketData(data);
    //this.order.yield = this.securityMarketDetails.calculatePriceYield(this.order.price);
    if ( this.securityMarketDetails.bondSubCategory != undefined && this.securityMarketDetails.bondSubCategory != null) {
      this.subCategory.value = this.securityMarketDetails.bondSubCategory.subCategory;
    }
  }

  // ---------------------------------------------------------------------

  getOrder(user: string = AppConstants.username): void {
    this.securityMarketDetails = new SecurityMarketDetails();
    this.securityMarketDetails.fisDetail.couponRate = 0;
    this.isFirstSubmission = false;
    this.order.order_no = this.order.order_no.replace(AppConstants.delimExp, '');
    this.usersOmsReports.users[0] = user;
    //this.usersOmsReports.symbolType = 2;

    this.appState.showLoader = true;
    this.orderService.getOrder(this.usersOmsReports, this.order.order_no).subscribe(
      data => {
        this.appState.showLoader = false;
        if (AppUtility.isEmpty(data)) {
          return;
        }

        this.updateOrder(data);
      },
      error => {
        this.appState.showLoader = false;
        this.statusMsg = error._body;
        this.orderNo.focus();
        this.errorMsg = <any>error;
        this.dialogCmp.statusMsg = error._body;
        if (this.modalId === 'edit_dialogBox') {
          this.dialogCmp.cssClass = 'order_dialog';
        }
        this.dialogCmp.showAlartDialog('Error');
      });
  }

  // ---------------------------------------------------------------------

  submitOrder() {
    this.appState.showLoader = true;
    this.orderService.changeOrder(this.changeOrder).subscribe(
      data => {
        this.appState.showLoader = false;
        AppUtility.printConsole('Data: ' + data);
      },
      error => {
        this.appState.showLoader = false;
        let alertMessage: AlertMessage = new AlertMessage();
        alertMessage.message = AppUtility.ucFirstLetter(AppUtility.removeQuotesFromStartAndEndOfString(JSON.parse(JSON.stringify(error)).error));
        if (alertMessage.message.length > 0) {
          alertMessage.type = 'danger';
        }
        else {
          alertMessage.type = 'success';
        }

        this.alertMessage = alertMessage;
        this.showOrderConfirmationMsg();

      });

    this.clearOrder();
    this.orderNo.focus();
  }

  // ---------------------------------------------------------------------

  onVolumeChange(): void {
    
    this.calculateAccruedInterest();
  }


  calculateAccruedInterest() {

    
    if (this.securityMarketDetails !== undefined && this.securityMarketDetails != null
      && this.securityMarketDetails.exchangeCode !== null) {
      console.log("volume: " + this.inputVolume.value);
      if (this.inputVolume.value == null || this.inputVolume.value == 0) {
        this.inputVolume.value = this.changeOrder.volume;
      }
      this.accruedInterest = this.securityMarketDetails.calculateAccruedProfit(Number(this.inputVolume.value));

      this.accruedInterest = this.securityMarketDetails.toTrunc(this.accruedInterest, 4);

      if (AppConstants.capitalTaxPercent > 0) {
        this.addTaxExpWithAccruedProfite();
      }

      this.updateSettlementAmount();
    }
  }

  //--------------------------------------------------------------------------
  addTaxExpWithAccruedProfite() {

    // difference
    let calculatedAccruedProfit = this.securityMarketDetails.accrudeProfit;

    let newAccruedProfit = 0;

    newAccruedProfit =
      calculatedAccruedProfit * (1 - Number(AppConstants.capitalTaxPercent) / 100);
    this.accruedInterest = this.securityMarketDetails.toTrunc(newAccruedProfit, 4);
    this.securityMarketDetails.setAccruedProfit(newAccruedProfit);

  };

  updateSettlementAmount() {

    if (this.inputPrice.value == null || this.inputPrice.value == 0) {
      this.inputPrice.value = this.changeOrder.price_;
    }

    if (this.isBondPricingMechanismPercentage)
    this.order.value = (Number(this.inputVolume.value) * this.securityMarketDetails.parValue) * (Number(this.inputPrice.value) / 100);
    else
    this.order.value = (Number(this.inputVolume.value) * this.securityMarketDetails.parValue) * (Number(this.inputPrice.value) );

    this.order.settlementValue = Number(this.order.value) + Number(this.securityMarketDetails.accrudeProfit);

    console.log("settlement amount 2" + this.order.settlementValue); 
  }
  // ---------------------------------------------------------------------


  onPriceChange(): void {
    console.log("price: " + this.inputPrice.value);
    this.order.yield = this.securityMarketDetails.calculatePriceToYield(this.inputPrice.value, this.inputVolume.value, this.inputYield.value, this.isBondPricingMechanismPercentage);
    //this.order.value = (Number(this.inputVolume.value) * this.securityMarketDetails.parValue) * (Number(this.inputPrice.value) / 100);
    
    this.updateSettlementAmount();
  }

  onYieldChange(): void {
    this.order.price_ = this.securityMarketDetails.calculateYieldToPrice(this.inputVolume.value, this.inputYield.value, this.isBondPricingMechanismPercentage);
    this.changeOrder.price_ = this.order.price_;

    this.updateSettlementAmount() ; 
    
  }

  // ---------------------------------------------------------------------

  validateOrder(): boolean {
    let errorMsg: string = '';

    if (this.changeOrder.volume === 0) {
      // this.statusMsg="Volume is required";
      this.inputVolume.focus();
    }
    else if (this.changeOrder.volume < 0) {
      // this.statusMsg="Volume should be greater than zero";
      this.inputVolume.focus();
    }
    else if ((this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_LIMIT ||
      this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_SL) &&
      this.order.price_ <= 0) {
      // this.statusMsg="Price is required";
      this.inputPrice.focus();
      return false;
    }
    else {
      return true;
    }
  }

  // ---------------------------------------------------------------------

  addFromValidations() {
    this.myForm = this._fb.group(
      {
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

        bondType: [''],
        subCategory: [''],
        orderSettlementValue: [''],
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

  // ---------------------------------------------------------------------

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

  // ---------------------------------------------------------------------

  getBestMarketAndSymbolSummary(exchangeCode, marketCode, securityCode) {
    if (AppUtility.isValidVariable(exchangeCode) &&
      AppUtility.isValidVariable(marketCode) &&
      AppUtility.isValidVariable(securityCode)) {
      this.appState.showLoader = true;
      this.orderService.getBestMarketAndSymbolStats(exchangeCode, marketCode, securityCode)
        .subscribe(data => {
          this.appState.showLoader = false;
          if (AppUtility.isValidVariable(data)) {
            this.updateBestMarketAndSymbolStats(data);
          }
        },
          error => { this.appState.showLoader = false; this.errorMsg = <any>error });
    }
  }

  // ---------------------------------------------------------------------

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
