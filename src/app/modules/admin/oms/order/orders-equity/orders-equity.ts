import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AlertMessage } from 'app/models/alert-message';
import { BestMarket } from 'app/models/best-market';
import { Order } from 'app/models/order';
import { OrderConfirmation } from 'app/models/order-confirmation';
import { OrderTypes } from 'app/models/order-types';
import { SecurityMarketDetails } from 'app/models/security-market-details';
import { SymbolStats } from 'app/models/symbol-stats';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcXlsx from '@grapecity/wijmo.xlsx';
import * as wjcGridXlsx from '@grapecity/wijmo.grid.xlsx';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';

import * as jQuery from 'jquery';
import { Market } from 'app/models/market';
import { ComboItem } from 'app/models/combo-item';
import { AuthService2 } from 'app/services/auth2.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { Exchange } from 'app/models/exchange';

@Component ({

    selector: 'orders-equity',
    templateUrl: './orders-equity.html',
    encapsulation: ViewEncapsulation.None,


  })
export class OrdersEquity   {

    public myForm: FormGroup;
    public isSubmitted: boolean;

    claims: any;
    order:Order;
    securityMarketDetails:SecurityMarketDetails;
    bestMarket:BestMarket;
    symbolStats:SymbolStats;
    alertMessage:AlertMessage;
    orderConfirmation: OrderConfirmation;

    exchanges: any[];
    markets: any[];
    symbols: any[];
    traders: any[]=[];
    custodians: any[];

    dateTimeFormat:string=AppConstants.DATE_TIME_FORMATT;
    market:Market;
    cmbItem:ComboItem;
    exchangeId:number=0;
    marketId:number=1;
    exchangeCode:string='';
    marketCode:string='';
    symbol:string='';
    username:string='';
    userId:number=0;
    custodian:string='';
    account:string='';

    volume:number=0;
    price:number=0;

    noMarketFound:boolean=false;

    isChangeOrder:boolean=false;
    isCancelOrder:boolean=false;

    private _pageSize = 0;

    data:any=[];
    //data: wjcCore.CollectionView;
    errorMsg:string='';

    includeColumnHeader:boolean = true;

    @ViewChild('flexGrid',{ static: false }) flexGrid: wjcGrid.FlexGrid;
    @ViewChild('cmbMarket',{ static: false }) cmbMarket: wjcInput.ComboBox;
    @ViewChild('cmbExchange',{ static: false }) cmbExchange: wjcInput.ComboBox;
    @ViewChild('orderSubmittedDlg',{ static: false }) orderSubmittedDlg: wjcInput.Popup;
    @ViewChild('inputVolume',{ static: false }) inputVolume: wjcInput.InputNumber;
    @ViewChild('inputPrice',{ static: false }) inputPrice: wjcInput.InputNumber;


    constructor (public authService: AuthService2, private orderSvc:OrderService,
                private listingSvc: ListingService, private _fb: FormBuilder) {

        //this.getOrders();
        this.claims = this.authService.claims;
        this.isSubmitted = false;
        this.order = new Order();
        this.securityMarketDetails=new SecurityMarketDetails();
        this.symbolStats = new SymbolStats();
        this.bestMarket = new BestMarket();
        this.orderConfirmation = new OrderConfirmation();
        this.alertMessage = new AlertMessage();

        this.initTraders();
        this.loadExchanges();
        if ( this.exchangeId > 0 ) {
            this.loadExchangeMarkets(this.exchangeId);
        }
        //this.initReportsGridData(AppConstants.noOfRowsReports);
    }

    ngOnInit() {
        // Add form Validations
        this.addFromValidations();
    }
    ngAfterViewInit(){
        this.getWorkingOrders();
    }

    print(): void {
        window.print();
    };

    get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    if (this._pageSize != value) {
      this._pageSize = value;
      if (this.flexGrid) {
         (<wjcCore.IPagedCollectionView>this.flexGrid.collectionView).pageSize = value;
      }
    }
  }

    initTraders():void {
        this.cmbItem = new ComboItem(AppConstants.username,AppConstants.username);
        this.traders.push(this.cmbItem);
    }
    getWorkingOrders():void {
        AppUtility.printConsole("getWorkingOrders is called...");
        this.symbol = this.symbol.toUpperCase();
        this.exchangeCode = this.cmbExchange.text;
        this.marketCode =this.cmbMarket.text;

        //console.log("Exchange: "+this.exchangeCode+", Market: "+this.marketCode+", Symbol: "+this.symbol );
        // Populate country combo
    this.orderSvc.getOrders(AppConstants.username).subscribe(
      data =>
      {
        //   window.alert(data);
        //   window.alert(data);
        //   window.alert(JSON.stringify(data));
        this.updateWorkingOrders(data);
      },
      error =>
      {
          //window.alert(error);
          this.errorMsg = <any>error.message
      });
    }

    updateWorkingOrders(workingOrders):void {

        console.log("Orders Received: "+ JSON.stringify(workingOrders));

        this.data = [];
        let orders = workingOrders.orders;
       // alert( this.symbol);
        if ( !AppUtility.isEmpty (orders)) {

            for (let i=0; i < orders.length; i++) {

                if (   ( (AppUtility.isEmpty(this.exchangeCode) || this.exchangeId==0) || this.exchangeCode==orders[i].exchange) &&
                        ( (AppUtility.isEmpty(this.marketCode) || this.marketId ==0) || this.marketCode==orders[i].market) &&
                        ( AppUtility.isEmpty(this.symbol.trim()) || this.symbol==orders[i].symbol) &&
                        ( AppUtility.isEmpty(this.username) || this.username==orders[i].username) &&
                        ( (AppUtility.isEmpty(this.custodian)) || this.custodian==orders[i].custodian) &&
                        ( AppUtility.isEmpty(this.account.trim()) || this.account==orders[i].account)
                    ) {

                    workingOrders.orders[i].type = OrderTypes.getOrderTypeViewStr(workingOrders.orders[i].type);
                    workingOrders.orders[i].state_time = new Date(workingOrders.orders[i].state_time);

                    workingOrders.orders[i].state_time = wjcCore.Globalize.formatDate(workingOrders.orders[i].state_time, AppConstants.DATE_TIME_FORMATT) ;
                    workingOrders.orders[i].order_state = AppUtility.ucFirstLetter(workingOrders.orders[i].order_state);
                    workingOrders.orders[i].side = AppUtility.ucFirstLetter(workingOrders.orders[i].side);

                    workingOrders.orders[i].order_no = workingOrders.orders[i].order_no.toString();

                    workingOrders.orders[i].price = (Number(workingOrders.orders[i].price)>0)?Number(workingOrders.orders[i].price):"";
                    workingOrders.orders[i].trigger_price = (Number(workingOrders.orders[i].trigger_price)>0)?Number(workingOrders.orders[i].trigger_price):"";
                    AppUtility.printConsole("State Time: "+  workingOrders.orders[i].state_time);
                    this.data.push(workingOrders.orders[i]);
                }
            }
        }

        //console.log("Data: "+ this.data);
    }
    loadExchanges():void {
        // update exchanges data
        console.log("getting exchanges");
        this.listingSvc.getExchangeList().subscribe(
        data => {
            if ( data != null ) {
                //console.log("Exchanges: "+ data);
                this.exchanges = data;
                this.exchangeId = this.exchanges[0].exchangeId;
                var exchange:Exchange = new Exchange (0, AppConstants.PLEASE_SELECT_STR);
                this.exchanges.unshift(exchange);
                this.exchangeId = this.exchanges[0].exchangeId;

            }
        },
        error => this.errorMsg = <any>error);
    }

    loadExchangeMarkets(exchangeId):void {
        // update exchanges data
       this.loadEmptyMarket();
       this.noMarketFound=true;
       this.getExchangeCustodians(exchangeId);
        console.log("Loading exchange markets");
        this.listingSvc.getMarketListByExchange(exchangeId).subscribe(
        data => {
            if ( data != null) {
                this.noMarketFound=false;
                 this.markets = [];
                this.markets = data;
                var market:Market = new Market (0, AppConstants.PLEASE_SELECT_STR);
                this.markets.unshift(market);
                this.marketId = this.markets[0].marketId;
                //this.marketId = this.markets[0].marketId;
            } else {
                if ( AppConstants.debug)
                console.log("No data found");

            }
        },
        error => this.errorMsg = <any>error);
    }
    getExchangeCustodians(exchangeId) {

    let obj:ComboItem;
    this.listingSvc.getCustodianByExchange(exchangeId)
                     .subscribe(restData => {

                       if ( AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                        this.custodians=restData;
                        for ( let i=0; i < restData.length; i++) {
                          this.custodians[i]=new ComboItem(this.custodians[i].participantCode, this.custodians[i].participantCode);
                        }

                        obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, "");
                        this.custodians.unshift(obj);
                        //this.order.custodian= "";
                       }
                    },
                     error =>  this.errorMsg = <any>error);
    }

    loadEmptyMarket():void {
        this.markets = [];
        this.market = new Market();
        this.market.marketId = 1;
        this.market.marketCode='';
        this.markets.push(this.market);
    }
    setMarketId(value):void {
        this.marketId = value;
    }

    getSymbols(exchangeId, marketId):void {

    }

    initReportsGridData(count):void {
        let items = [];
        let order:Order;
        for (let i=0; i < count; i++) {
            order = new Order();
            order.clearOrder();
            items.push(order);
        }

        this.data = new wjcCore.CollectionView(items);
    }

    private addFromValidations() {
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
       custodian: [''],
       triggerPrice: [''],

       bondType:[''],
       couponRate:[''],
       lastCouponDate:[''],
       nextCouponDate:[''],
       accrudeProfit:[''],
       maturityDate:[''],
       tenure:[''],
       parValue:[''],

       statusMsg: [''],

    });
  }

    onExchangeChange(value):void {
        console.log("selected exchange: "+ value);
        this.exchangeCode = value;
        this.loadExchangeMarkets(value);
    }

    onMarketChange():void {
        this.marketCode = this.cmbMarket.text;
    }

    public onChangeOrder() {
        this.isChangeOrder=true;
        this.isCancelOrder=false;
    }
    public onCancelOrder() {
        this.isCancelOrder=true;
        this.isChangeOrder=false;
    }

    public onCancelAction() {

    }

    private onVolumeChange():void {
        this.order.value= Number(this.inputVolume.value)*Number(this.inputPrice.value);
    }

    private onPriceChange():void {
        this.order.value= Number(this.inputVolume.value)*Number(this.inputPrice.value);
        this.order.yield = this.securityMarketDetails.calculatePriceYield(this.inputPrice.value);
    }
    exportExcel() {
       // wjcGridXlsx.FlexGridXlsxConverter.save(this.flexGrid, { includeColumnHeaders: this.includeColumnHeader, includeCellStyles: false }, 'FlexGrid.xlsx');
    }


}
