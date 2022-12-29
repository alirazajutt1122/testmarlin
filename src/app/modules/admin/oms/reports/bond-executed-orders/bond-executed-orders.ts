
import { Component, ViewEncapsulation, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcXlsx from '@grapecity/wijmo.xlsx';
import * as wjcGridXlsx from '@grapecity/wijmo.grid.xlsx';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import * as pdf from '@grapecity/wijmo.pdf';
import * as gridPdf from '@grapecity/wijmo.grid.pdf';

import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Market } from 'app/models/market';
import { ComboItem } from 'app/models/combo-item';
import { Order } from 'app/models/order';
import { DialogCmpReports } from '../dialog-cmp-reports';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import { Exchange } from 'app/models/exchange';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { Symbol } from 'app/models/symbol';
import { Client } from 'app/models/client';


//import 'slim_scroll/jquery.slimscroll.js';
declare var jQuery: any;

////////////////////////////////////////////////////////////////////////////////

@Component({
    selector: 'bond-executed-orders',
    templateUrl: './bond-executed-orders.html',
    encapsulation: ViewEncapsulation.None
})
export class BondExecutedOrders implements OnInit, AfterViewInit {


    scaleMode = gridPdf.ScaleMode.ActualSize;
    orientation = pdf.PdfPageOrientation.Landscape;
    exportMode = gridPdf.ExportMode.All;


    public myForm: FormGroup;
    public isSubmitted: boolean;
    exchanges: any[];
    exchangeData: any[];
    custodians: any[];
    markets: any[];
    symbols: any[];
    traders: any[] = [];

    dateTimeFormat: string = AppConstants.DATE_TIME_FORMAT;

    market: Market;
    cmbItem: ComboItem;
    exchangeId: number = 0;
    marketId: number = 1;
    exchangeCode: string = '';
    marketCode: string = '';
    symbol: string = '';
    username: string = '';
    userId: number = 0;
    custodian: string = '';
    account: string = '';
    fromClientList: any[] = [];
    noMarketFound: boolean = false;

    order: Order;
    data: any = [];
    errorMsg: string = '';
    userType: string;
    lang: any

    includeColumnHeader: boolean = true;
    public disabledCheckbox: Boolean = true;
    allTraders: Boolean = false;

    filterColumns = ['exchange', 'market', 'symbol', 'ticket_no', 'order_no', 'account', 'username', 'custodian', 'price',
        'volume', 'type', 'trigger_price', 'execution_time'];
    @ViewChild('client', { static: false }) client: wjcInput.ComboBox;
    @ViewChild('flexGrid', { static: false }) flexGrid: wjcGrid.FlexGrid;
    @ViewChild('cmbMarket', { static: false }) cmbMarket: wjcInput.ComboBox;
    @ViewChild('cmbExchange', { static: false }) cmbExchange: wjcInput.ComboBox;
    @ViewChild('dialogCmp', { static: false }) dialogCmp: DialogCmpReports;
    @ViewChild('cmbTraders', { static: false }) cmbTraders: wjcInput.MultiSelect;

    private _pageSize = 0;

    // -----------------------------------------------------------------------

    constructor(private appState: AppState, private authService: AuthService,
        private orderSvc: OrderService, private listingSvc: ListingService, private _fb: FormBuilder, private translate: TranslateService, public splash: FuseLoaderScreenService) {
        this.userType = AppConstants.userType;
        this.username = AppConstants.username;
        this.isSubmitted = false;
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
    }

    // -----------------------------------------------------------------------
    ngOnInit() {
        this.addFromValidations();
        if (this.userType === 'PARTICIPANT' || this.userType === 'PARTICIPANT ADMIN') {
            this.loadTraders();
        }
        else {
            this.traders = [];
            let u: any = new Object();
            u.userName = AppConstants.loginName;
            u.email = AppConstants.username;
            this.traders.push(u);
            this.traders[0].selected = true;
            this.traders[0].$checked = true;
            // this.getExecutedOrders();
        }

        this.loadExchanges();
        if (this.exchangeId > 0) {
            this.loadExchangeMarkets(this.exchangeId);
        }

        this.authService.socket.on('order_confirmation', (dataorderConfirmation) => {
            this.updateorderConfirmation(dataorderConfirmation);
        });
    }

    // -----------------------------------------------------------------------

    ngAfterViewInit() {
        //  this.getExecutedOrders();
        jQuery('.grid > div > div:nth-child(2)').addClass('slim_scroll');

        jQuery('.slim_scroll').slimScroll({
            height: '100%',
            width: '100%',
            wheelStep: 10,
            alwaysVisible: true,
            allowPageScroll: false,
            railVisible: true,
            size: '7px',
            opacity: 1,
            axis: 'both'
        });
    }

    // -----------------------------------------------------------------------

    get pageSize(): number {
        return this._pageSize;
    }

    // -----------------------------------------------------------------------

    set pageSize(value: number) {
        if (this._pageSize !== value) {
            this._pageSize = value;
            if (this.flexGrid) {
                (<wjcCore.IPagedCollectionView>this.flexGrid.collectionView).pageSize = value;
            }
        }
    }

    // -----------------------------------------------------------------------

    print(): void {
        window.print();
    };

    // -----------------------------------------------------------------------

    loadTraders() {
        this.splash.show();
        this.listingSvc.getUserList(AppConstants.participantId).subscribe(
            restData => {
                this.splash.hide();
                if (AppUtility.isEmptyArray(restData)) {
                    this.errorMsg = AppConstants.MSG_NO_DATA_FOUND;
                }
                else {
                    this.updateTraders(restData);
                    // this.getExecutedOrders();
                }
            },
            error => {
                this.splash.hide();
                this.errorMsg = <any>error;
                this.dialogCmp.statusMsg = this.errorMsg;
                this.dialogCmp.showAlartDialog('Error');
            });
    }

    public onAllSelected(e) {
        if (e.target.checked) {
            this.cmbTraders.isDisabled = true;
            this.allTraders = true;
        } else {
            this.cmbTraders.isDisabled = false;
            this.allTraders = false;
        }
    }

    // -----------------------------------------------------------------------

    updateTraders(data) {
        if (!AppUtility.isValidVariable(data)) {
            return;
        }

        this.traders = [];
        let u: any = new Object();
        u.userName = AppConstants.loginName;
        u.email = AppConstants.username;
        this.traders.push(u);
        this.traders[0].selected = true;
        this.traders[0].$checked = true;
        for (let i = 1; i <= data.length; i++) {
            this.traders[i] = data[i - 1];
            if (data[i].userName === AppConstants.loginName) {
                this.traders[i].selected = true;
                this.traders[i].$checked = true;
            }
        }
    }

    // -----------------------------------------------------------------------

    updateorderConfirmation(data) {
        if (AppUtility.isValidVariable(data)) {
            if (data.state === 'trade') {
                this.getExecutedOrders('', true);
            }
        }

    }

    // -----------------------------------------------------------------------

    getExecutedOrders(model: any, isValid: boolean): void {
        this.isSubmitted = true;
        if (isValid) {
            this.symbol = this.symbol.toUpperCase();
            this.exchangeCode = this.cmbExchange.text;
            this.marketCode = this.cmbMarket.text;
            this.account = "";
            if (this.client.text) {
                this.account = this.client.text;
            }
            this.getExchangeData(this.exchangeCode);
            let usersOmsReports: UsersOmsReports = null;
            if (this.userType === 'PARTICIPANT' || this.userType === 'PARTICIPANT ADMIN') {
                if (!this.allTraders) {
                    if (this.cmbTraders.checkedItems.length > 0) {
                        usersOmsReports = new UsersOmsReports();
                        for (let i = 0; i < this.cmbTraders.checkedItems.length; i++) {
                            usersOmsReports.users[i] = this.cmbTraders.checkedItems[i].email;
                        }
                    }
                    usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
                    usersOmsReports.marketType = AppConstants.MARKET_TYPE_BONDS;
                }
                else {
                    usersOmsReports = new UsersOmsReports();
                    for (let i = 0; i < this.traders.length; i++) {
                        usersOmsReports.users[i] = this.traders[i].email;
                    }
                    usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
                    usersOmsReports.marketType = AppConstants.MARKET_TYPE_BONDS;
                }
            } else {
                usersOmsReports = new UsersOmsReports();
                console.log("Working orders, User name: " + AppConstants.username);
                usersOmsReports.users[0] = AppConstants.username                
                usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
                usersOmsReports.marketType = AppConstants.SYMBOL_TYPE_BONDS; 
            }

            AppUtility.printConsole(usersOmsReports);
            this.splash.show();
            this.orderSvc.getExecutedOrders(usersOmsReports).subscribe(
                data => {
                    this.splash.hide();
                    this.updateExecutedOrders(data);
                },
                error => {
                    this.splash.hide();
                    this.errorMsg = <any>error;
                });
        }
    }
    // -----------------------------------------------------------------------

    updateExecutedOrders(executedOrders): void {
        this.data = [];
        let trades = executedOrders.trades;

        if (!AppUtility.isEmpty(trades)) {
            for (let i = 0; i < trades.length; i++) {
                if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === trades[i].exchange) &&
                    ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === trades[i].market) &&
                    (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === trades[i].symbol) &&
                    ((AppUtility.isEmpty(this.custodian)) || this.custodian === trades[i].custodian) &&
                    (AppUtility.isEmpty(this.account.trim()) || this.account === trades[i].account)) {
                    if (trades[i].short) {
                        trades[i].short = 'Yes';
                    }
                    else {
                        trades[i].short = 'No';
                    }

                    trades[i].execution_time = wjcCore.Globalize.formatDate(new Date(trades[i].execution_time), AppConstants.DATE_TIME_FORMAT);
                    trades[i].side = AppUtility.ucFirstLetter(trades[i].side);

                    trades[i].order_no = trades[i].order_no.toString();
                    trades[i].ticket_no = trades[i].ticket_no.toString();
                    trades[i].volume = (trades[i].volume > 0) ? trades[i].volume : '';
                    trades[i].price = (Number(trades[i].price) > 0) ? trades[i].price : '';
                    trades[i].yield = (Number(trades[i].yield) > 0) ? trades[i].yield : '';
                    trades[i].accrudeProfit = (Number(trades[i].accrudeProfit) > 0) ? trades[i].accrudeProfit : '';
                    trades[i].trigger_price = (Number(trades[i].trigger_price) > 0) ? trades[i].trigger_price : '';

                    this.data.push(trades[i]);
                }
                else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === trades[i].exchange) &&
                    ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === trades[i].market) &&
                    (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === AppConstants.ALL_STR) &&
                    ((AppUtility.isEmpty(this.custodian)) || this.custodian === trades[i].custodian) &&
                    (AppUtility.isEmpty(this.account.trim()) || this.account === trades[i].account)) {
                    if (trades[i].short) {
                        trades[i].short = 'Yes';
                    }
                    else {
                        trades[i].short = 'No';
                    }

                    trades[i].execution_time = wjcCore.Globalize.formatDate(new Date(trades[i].execution_time), AppConstants.DATE_TIME_FORMAT);
                    trades[i].side = AppUtility.ucFirstLetter(trades[i].side);

                    trades[i].order_no = trades[i].order_no.toString();
                    trades[i].ticket_no = trades[i].ticket_no.toString();
                    trades[i].volume = (trades[i].volume > 0) ? trades[i].volume : '';
                    trades[i].price = (Number(trades[i].price) > 0) ? trades[i].price : '';
                    trades[i].yield = (Number(trades[i].yield) > 0) ? trades[i].yield : '';
                    trades[i].accrudeProfit = (Number(trades[i].accrudeProfit) > 0) ? trades[i].accrudeProfit : '';
                    trades[i].trigger_price = (Number(trades[i].trigger_price) > 0) ? trades[i].trigger_price : '';

                    this.data.push(trades[i]);
                }
                else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === trades[i].exchange) &&
                    ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === trades[i].market) &&
                    (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === trades[i].symbol) &&
                    ((AppUtility.isEmpty(this.custodian)) || this.custodian === trades[i].custodian) &&
                    (AppUtility.isEmpty(this.account.trim()) || this.account === AppConstants.ALL_STR)) {
                    if (trades[i].short) {
                        trades[i].short = 'Yes';
                    }
                    else {
                        trades[i].short = 'No';
                    }

                    trades[i].execution_time = wjcCore.Globalize.formatDate(new Date(trades[i].execution_time), AppConstants.DATE_TIME_FORMAT);
                    trades[i].side = AppUtility.ucFirstLetter(trades[i].side);

                    trades[i].order_no = trades[i].order_no.toString();
                    trades[i].ticket_no = trades[i].ticket_no.toString();
                    trades[i].volume = (trades[i].volume > 0) ? trades[i].volume : '';
                    trades[i].price = (Number(trades[i].price) > 0) ? trades[i].price : '';
                    trades[i].yield = (Number(trades[i].yield) > 0) ? trades[i].yield : '';
                    trades[i].accrudeProfit = (Number(trades[i].accrudeProfit) > 0) ? trades[i].accrudeProfit : '';
                    trades[i].trigger_price = (Number(trades[i].trigger_price) > 0) ? trades[i].trigger_price : '';

                    this.data.push(trades[i]);
                }
                else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === trades[i].exchange) &&
                    ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === trades[i].market) &&
                    (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === AppConstants.ALL_STR) &&
                    ((AppUtility.isEmpty(this.custodian)) || this.custodian === trades[i].custodian) &&
                    (AppUtility.isEmpty(this.account.trim()) || this.account === AppConstants.ALL_STR)) {
                    if (trades[i].short) {
                        trades[i].short = 'Yes';
                    }
                    else {
                        trades[i].short = 'No';
                    }

                    trades[i].execution_time = wjcCore.Globalize.formatDate(new Date(trades[i].execution_time), AppConstants.DATE_TIME_FORMAT);
                    trades[i].side = AppUtility.ucFirstLetter(trades[i].side);

                    trades[i].order_no = trades[i].order_no.toString();
                    trades[i].ticket_no = trades[i].ticket_no.toString();
                    trades[i].volume = (trades[i].volume > 0) ? trades[i].volume : '';
                    trades[i].price = (Number(trades[i].price) > 0) ? trades[i].price : '';
                    trades[i].yield = (Number(trades[i].yield) > 0) ? trades[i].yield : '';
                    trades[i].accrudeProfit = (Number(trades[i].accrudeProfit) > 0) ? trades[i].accrudeProfit : '';
                    trades[i].trigger_price = (Number(trades[i].trigger_price) > 0) ? trades[i].trigger_price : '';

                    this.data.push(trades[i]);
                }

            }
        }
    }

    // -----------------------------------------------------------------------

    loadExchanges(): void {
        this.splash.show();
        this.listingSvc.getExchangeList().subscribe(
            data => {
                this.splash.hide();
                if (data != null) {
                    this.exchanges = data;
                    this.exchangeId = this.exchanges[0].exchangeId;
                    let exchange: Exchange = new Exchange(0, AppConstants.PLEASE_SELECT_STR);
                    this.exchanges.unshift(exchange);
                    this.exchangeId = (AppConstants.exchangeId === null) ? this.exchanges[0].exchangeId : AppConstants.exchangeId;
                }
            },
            error => { this.splash.hide(); this.errorMsg = <any>error });
    }

    // -----------------------------------------------------------------------

    loadExchangeMarkets(exchangeId): void {
        // this.loadEmptyMarket();
        this.noMarketFound = true;
        this.getExchangeCustodians(exchangeId);
        this.splash.show();
        this.listingSvc.getMarketListByExchange(exchangeId).subscribe(
            data => {
                this.splash.hide();
                if (data != null) {
                    this.updateMarketData(data);
                }
                else {
                    if (AppConstants.debug)
                        console.log('No data found');
                }
            },
            error => { this.splash.hide(); this.errorMsg = <any>error });
    }



    updateMarketData(markets) {
        this.markets = [];
        this.marketId = 0;
        
        for (let i = 0; i < markets.length; i++) {
            if (markets[i].marketType.description === AppConstants.MARKET_TYPE_BOND) {
                this.markets[0] = markets[i];
            }
        }
        if (this.markets.length > 0) {
            this.noMarketFound = false;
            // let market: Market = new Market(0, AppConstants.PLEASE_SELECT_STR);
            // this.markets.unshift(market);
            this.marketId = this.markets[0].marketId;
            this.getExchangeMarketSecuritiesList(this.exchangeId, this.marketId);
        }

    }




    getExchangeMarketSecuritiesList(exchangeId, marketId) {
        this.listingSvc.getExchangeMarketSecuritiesList(exchangeId, marketId).subscribe(
            data => {
                this.splash.hide();
                if (data == null) { return; }
                this.symbols = data;
                let symbol: Symbol = new Symbol(AppConstants.ALL_VAL, AppConstants.ALL_STR);
                this.symbols.unshift(symbol);
                this.symbol = this.symbols[0].symbol;
            },
            error => {
                this.splash.hide();
                this.errorMsg = <any>error;
            });
    }




    // -----------------------------------------------------------------------

    getExchangeCustodians(exchangeId) {
        let obj: ComboItem;
        this.splash.show();
        this.listingSvc.getCustodianByExchange(exchangeId).subscribe(
            restData => {
                this.splash.hide();
                if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                    this.custodians = restData;
                    for (let i = 0; i < restData.length; i++) {
                        this.custodians[i] = new ComboItem(this.custodians[i].participantCode, this.custodians[i].participantCode);
                    }

                    obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
                    this.custodians.unshift(obj);
                }
            },
            error => { this.splash.hide(); this.errorMsg = <any>error });
    }

    // -----------------------------------------------------------------------

    loadEmptyMarket(): void {
        this.markets = [];
        this.market = new Market();
        this.market.marketId = 1;
        this.market.marketCode = '';
        this.markets.push(this.market);
    }

    // -----------------------------------------------------------------------

    setMarketId(value): void {
        this.marketId = value;
    }

    // -----------------------------------------------------------------------

    getSymbols(exchangeId, marketId): void {

    }

    // -----------------------------------------------------------------------

    initReportsGridData(count): void {
        let items = [];
        let order: Order;
        for (let i = 0; i < count; i++) {
            order = new Order();
            order.clearOrder();
            items.push(order);
        }

        this.data = items;
    }

    // -----------------------------------------------------------------------

    onExchangeChange(value): void {
        this.exchangeCode = value;
        this.loadExchangeMarkets(value);
        this.getClientsList(value);
    }

    // -----------------------------------------------------------------------

    onMarketChange(): void {
        this.marketCode = this.cmbMarket.text;
    }

    // -----------------------------------------------------------------------

    exportExcel() {
        wjcGridXlsx.FlexGridXlsxConverter.save(this.flexGrid, { includeColumnHeaders: this.includeColumnHeader, includeCellStyles: false }, 'Bonds Executed Orders.xlsx');
    }


    exportPDF() {
        gridPdf.FlexGridPdfConverter.export(this.flexGrid, 'Bonds Executed Orders ' + new Date().toLocaleString() + '.pdf', {
            maxPages: 10,
            exportMode: this.exportMode,
            scaleMode: this.scaleMode,
            documentOptions: {
                pageSettings: {
                    layout: this.orientation
                },
                header: {
                    declarative: {
                        text: '\t&[Page]\\&[Pages]'
                    }
                },
                footer: {
                    declarative: {
                        text: '\t&[Page]\\&[Pages]'
                    }
                }
            },
            styles: {
                cellStyle: {
                    backgroundColor: '#ffffff',
                    borderColor: '#c6c6c6'
                },
                altCellStyle: {
                    backgroundColor: '#f9f9f9'
                },
                groupCellStyle: {
                    backgroundColor: '#dddddd'
                },
                headerCellStyle: {
                    backgroundColor: '#eaeaea'
                }
            }
        });
    }


    // -----------------------------------------------------------------------
    private addFromValidations() {
        this.myForm = this._fb.group({
            exchange: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            market: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            account: [''],
            custodian: [''],
            username: [''],
            symbol: ['']
        });
    }

    public getNotification(btnClicked) { }


    getClientsList(exchangeId) {
        this.splash.show();
        this.listingSvc.getClientListByExchangeBroker(exchangeId, AppConstants.participantId, true, true)
            .subscribe(restData => {
                this.splash.hide();
                if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                    this.fromClientList = restData;
                    let c: Client = new Client(AppConstants.ALL_STR, AppConstants.ALL_STR);
                    this.fromClientList.unshift(c);
                    this.account = this.fromClientList[0].clientCode;
                    this.getExecutedOrders("", true);
                } else {
                    this.fromClientList = [];
                }
            },
                error => { this.splash.hide(); this.errorMsg = <any>error });
    }

    public getExchangeData(exchangeCode: string) {
        this.splash.show();
        var colYield = this.flexGrid.columns.getColumn('yield');
        var colPrice = this.flexGrid.columns.getColumn('price');


        this.listingSvc.getExchangeByExchangeCode(exchangeCode)
            .subscribe(restData => {
                this.splash.hide();
                if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                    this.exchangeData = restData;

                    if (this.exchangeData["bondPricingMechanism"] == 2) {
                        colYield.header = 'Yield %';
                        colPrice.header = 'Price %';
                    }
                    else {
                        colYield.header = 'Yield';
                        colPrice.header = 'Price';
                    }
                } else {
                    this.exchangeData = [];
                    colYield.header = 'Yield';
                    colPrice.header = 'Price';
                }
            },
                error => { this.splash.hide(); this.errorMsg = <any>error });
    }
}

