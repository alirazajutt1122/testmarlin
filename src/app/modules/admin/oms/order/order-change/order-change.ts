import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AlertMessage } from 'app/models/alert-message';
import { BestMarket } from 'app/models/best-market';
import { Order } from 'app/models/order';
import { ChangeOrder } from 'app/models/Order-change';
import { OrderConfirmation } from 'app/models/order-confirmation';
import { SymbolStats } from 'app/models/symbol-stats';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import * as wjcInput from '@grapecity/wijmo.input';
import { DialogCmpWatch } from '../../dialog-component';
import { AppState } from 'app/app.service';
import { AuthService2 } from 'app/services/auth2.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { TranslateService } from '@ngx-translate/core';

// import * as jQuery from 'jquery';
declare var jQuery : any;
import { ComboItem } from 'app/models/combo-item';
import { AuthService } from 'app/services-oms/auth-oms.service';



@Component({
    selector: 'order-change',
    templateUrl: './order-change.html',
    styleUrls: ['../components.style.scss'],
    encapsulation: ViewEncapsulation.None,
  })
export class OrderChange implements OnInit, AfterViewInit {

    public myForm: FormGroup;
    public isSubmitted: boolean;

    @Input() modalId: string;

    claims: any;
    public order: Order;
    changeOrder: ChangeOrder;
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
    custodians: any[];
    orderSides: any[];
    orderTypes: any[];
    orderTypesTemp: any[];
    orderQualifiers: any[];

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
    public isDisable: boolean = false;
    lang:any

    usersOmsReports: UsersOmsReports;

    @ViewChild('orderSubmittedDlg',{ static: false }) orderSubmittedDlg: wjcInput.Popup;
    @ViewChild('orderNo',{ static: false }) orderNo: wjcInput.InputMask;
    @ViewChild('inputVolume',{ static: false }) inputVolume: wjcInput.InputNumber;
    @ViewChild('inputPrice',{ static: false }) inputPrice: wjcInput.InputNumber;
    @ViewChild('dialogCmp',{ static: false }) dialogCmp: DialogCmpWatch;

    onInitialized = new EventEmitter<OrderChange>();

    // ----------------------------------------------------------------------

    constructor(private appState: AppState, public authService: AuthService2, public authServiceOMS : AuthService ,private dataService: DataServiceOMS,
                private listingService: ListingService, private orderService: OrderService,
                private _fb: FormBuilder, private ref: ChangeDetectorRef,private translate: TranslateService,  )
    {
      this.claims = this.authService.claims;
      this.userType = AppConstants.userType;
      this.isDisable = false;
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
      this.isSubmitted = false;
      this.order = new Order();
      this.order.order_no=null;
      this.changeOrder = new ChangeOrder();
      this.isFirstSubmission = false;
      this.bestMarket = new BestMarket();
      this.symbolStats = new SymbolStats();
      this.orderConfirmation = new OrderConfirmation();
      this.alertMessage = new AlertMessage();
      this.symbolStats = new SymbolStats();
      this.usersOmsReports = new UsersOmsReports();

      // this.orderNo.focus();
      // this.orderNo.value='';

      let exchCode: string = '';
      let mktCode: string = '';
      this.orderTypesTemp = this.orderTypes;
    }

    // ----------------------------------------------------------------------

    ngAfterViewInit()
    {
      this.authServiceOMS.socket.on('order_confirmation', (dataorderConfirmation) => { this.updateorderConfirmation(dataorderConfirmation); });
      this.authServiceOMS.socket.on('best_market', (dataBM) => { this.updateBestMarketData(dataBM); });
      this.authServiceOMS.socket.on('symbol_stat', (dataSS) => { this.updateSymbolStatsData(dataSS); });

      this.orderNo.focus();
      this.ref.reattach();
      this.orderNo.value='';


    }

    // ----------------------------------------------------------------------

    show()
    {
      this.init();
      this.orderNo.value='';
      this.order = new Order();
      this.order.order_no=null;
      jQuery('#edit_dialogModal').modal({ backdrop: 'static', keyboard: true });
      jQuery('#edit_dialogModal').modal('show');
      this.orderNo.value='';
      this.order = new Order();
      this.order.order_no=null;
    }

    // ----------------------------------------------------------------------

    showFromWorkingOrders()
    {
      jQuery('#edit_dialogModalWO').modal('show');
    }

    // ----------------------------------------------------------------------

    public loadOrderNo(orderNo, user: string = AppConstants.username)
    {

      this.order = new Order();
      this.order.order_no = orderNo;
      this.isConfirmationSuccess = false;
      this.isConfirmationRejected = false;
      this.isDisable = false;

      if (orderNo != null)
      {
        this.order.order_no = orderNo;
        this.orderNo.value = orderNo;
        this.isDisable = true;
      }
      else
        this.isDisable = false;

      this.orderNo.focus();

      if (AppUtility.isValidVariable(this.order.order_no) && this.order.order_no.length > 0)
      {
        this.getOrder(user);
      }

    }

    // ----------------------------------------------------------------------

    onClose()
    {
      this.orderNo.value='';
      this.order = new Order();
      this.order.order_no=null;
      this.order.side = '';
      jQuery('#change-order-all-menu').modal('hide');
      jQuery('#change-order-all-wo').modal('hide');
      AppConstants.selectedAssetClass = 'equities';
    }

    // ----------------------------------------------------------------------

    orderNoChanged()
    {
      this.isDisable = false;
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
          if (data[i].marketCode === AppConstants.MARKET_TYPE_BOND)
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
      this.orderNo.focus();
      let alertMessage: AlertMessage = this.order.formatOrderConfirmationMsg(data,'Equity');
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

    changeOrderSubmit(model: any, isValid: boolean)
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
        this.changeOrder.order = this.order;
        this.changeOrder.price = String(this.changeOrder.price_);
        this.changeOrder.volume = this.changeOrder.volume;

        this.changeOrder.order.type_ = this.order.type_.toLowerCase();
        this.statusMsg = this.changeOrder.formatOrderSubmitMsg('Equity');

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
      this.isDisable = false;
      this.order = new Order();
      this.changeOrder = new ChangeOrder();
      this.symbolStats = new SymbolStats();
      this.order.clearOrder();
      this.statusMsg = '';
      this.isOrderNotFound = true;
      this.isPriceDisable = true;
    }

    // ----------------------------------------------------------------------

    updateOrder(orderResponse): void
    {
        debugger
      if ( this.modalId !== 'edit_dialogBox' && this.modalId !== 'edit_dialogModalWO' )
      {
        if (!this.authService.isAuhtorized(this.authService.OM_EQUITY_ORDER_CHANGE))
          return;

        let marketTypeCode = this.dataService.getMarketType(orderResponse.order[0].exchange,
                                  orderResponse.order[0].market,
                                  orderResponse.order[0].symbol);

        if (marketTypeCode !== AppConstants.MARKET_TYPE_EQUITY && marketTypeCode !== AppConstants.MARKET_TYPE_ODD_LOT)
          return;
      }


      this.isOrderNotFound = false;
      this.isPriceDisable = false;
      this.order.setOrder(orderResponse.order[0]);

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

      this.changeOrder.price = this.order.price;
      this.changeOrder.price_ = Number(this.order.price);
      this.changeOrder.volume = Number(this.order.volume);
      this.order.value = Number(this.order.volume)*Number(this.order.price);

      if (!this.dataService.isSymbolSubscribed(this.order.exchange, this.order.market, this.order.symbol))
      {
        this.authServiceOMS.socket.emit('symbol_sub', { 'exchange': this.order.exchange, 'market': this.order.market, 'symbol': this.order.symbol });
      }

      this.getBestMarketAndSymbolSummary(this.order.exchange, this.order.market, this.order.symbol);
    }

    // ----------------------------------------------------------------------

    getOrder(user: string = AppConstants.username): void
    {
        debugger
      this.isFirstSubmission = false;
      this.order.order_no = this.order.order_no.replace(',', '');
      this.usersOmsReports.users[0] = user;
      if (this.order.order_no.length <= 0)
      {
        return;
      }
      this.appState.showLoader = true;
      this.orderService.getOrder(this.usersOmsReports, this.order.order_no).subscribe(
        data =>
        {
            debugger
          this.appState.showLoader = false;
          if (AppUtility.isEmpty(data))
          {
            return;
          }

          this.updateOrder(data);
        },
        error =>
        {

          this.appState.showLoader = false;
          this.statusMsg = error.error;
          this.orderNo.focus();
          this.errorMsg = <any>error;
          this.dialogCmp.statusMsg = error.error;
          if (this.modalId === 'edit_dialogBox') {
            this.dialogCmp.cssClass = 'order_dialog';
          }
          this.dialogCmp.showAlartDialog('Error');
        });
    }

    // ----------------------------------------------------------------------

    submitOrder()
    {
      let alertMessage: AlertMessage = new AlertMessage();
      this.appState.showLoader = true;
      this.orderService.changeOrder(this.changeOrder).subscribe(
        data =>
        {
          this.appState.showLoader = false;
          console.log("Success Order Change" , data);
          debugger
        },
        error =>
        {
          console.log("Error Order Change : " , error);
          this.appState.showLoader = false;
          alertMessage.message = AppUtility.ucFirstLetter(AppUtility.removeQuotesFromStartAndEndOfString(JSON.parse(JSON.stringify(error)).error));
          debugger
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

    onSymbolGotFocus(): void
    {

    }

    // ----------------------------------------------------------------------

    onVolumeChange(): void
    {
      this.order.value = Number(this.inputVolume.value) * Number(this.inputPrice.value);
    }

    // ----------------------------------------------------------------------

    onPriceChange(): void
    {
      this.order.value = Number(this.inputVolume.value) * Number(this.inputPrice.value);
    }

    // ----------------------------------------------------------------------

    validateOrder(): boolean
    {
      let errorMsg: string = '';

      if (this.changeOrder.volume === 0)
      {
        // this.statusMsg="Volume is required";
        this.inputVolume.focus();
      }
      else if (this.changeOrder.volume < 0)
      {
        // this.statusMsg="Volume should be greater than zero";
        this.inputVolume.focus();
      }
      else if ((this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_LIMIT ||
                this.order.type_.toLowerCase() === AppConstants.ORDER_TYPE_SL) &&
                this.order.price_ <= 0)
      {
        // this.statusMsg="Price is required";
        this.inputPrice.focus();
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

    onAlertCancel(): void
    {
      this.orderNo.focus();
    }

    // ----------------------------------------------------------------------

    getBestMarketAndSymbolSummary(exchangeCode, marketCode, securityCode)
    {
      this.appState.showLoader = true;
      if (AppUtility.isValidVariable(exchangeCode) && AppUtility.isValidVariable(marketCode) && AppUtility.isValidVariable(securityCode))
      {
        this.orderService.getBestMarketAndSymbolStats(exchangeCode, marketCode, securityCode)
          .subscribe(data =>
          {
            this.appState.showLoader = false;
            if (AppUtility.isValidVariable(data))
            {
              this.updateBestMarketAndSymbolStats(data);
            }
          },
          error => {this.appState.showLoader = false; this.errorMsg = <any>error});
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

}
