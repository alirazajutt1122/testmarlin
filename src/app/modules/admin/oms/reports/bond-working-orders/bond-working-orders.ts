'use strict';
import { Component, ViewEncapsulation, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcGridXlsx from '@grapecity/wijmo.grid.xlsx';
import * as pdf from '@grapecity/wijmo.pdf';
import * as gridPdf from '@grapecity/wijmo.grid.pdf';

import { TranslateService } from '@ngx-translate/core';
import { Order } from 'app/models/order';
import { Market } from 'app/models/market';
import { ComboItem } from 'app/models/combo-item';
import { AppState } from 'app/app.service';
import { BondOrderChange } from '../../order/bond-order-change/bond-order-change';
import { BondOrderCancel } from '../../order/bond-order-cancel/bond-order-cancel';
import { DialogCmpReports } from '../dialog-cmp-reports';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import { Exchange } from 'app/models/exchange';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';
import { ChangeOrderAll } from '../../order/change-order-all/change-order-all';
import { CancelOrderAll } from '../../order/cancel-order-all/cancel-order-all';
import { Client } from 'app/models/client';
import { Symbol } from 'app/models/symbol';


//import 'slim_scroll/jquery.slimscroll.js';
declare var jQuery: any;

//////////////////////////////////////////////////////////////////////

@Component({
    selector: 'bond-working-orders',
    templateUrl: './bond-working-orders.html',
    encapsulation: ViewEncapsulation.None,
})
export class BondWorkingOrders implements OnInit, AfterViewInit {


    scaleMode = gridPdf.ScaleMode.ActualSize;
    orientation = pdf.PdfPageOrientation.Landscape;
    exportMode = gridPdf.ExportMode.All;

    public myForm: FormGroup;
    public isSubmitted: boolean;

    selectedOrder: Order;

    exchanges: any[];
    exchangeData: any[];
    markets: any[];
    symbols: any[];
    traders: any[] = [];
    custodians: any[];
    fromClientList: any[] = [];

    market: Market;
    cmbItem: ComboItem;
    exchangeId: number = 0;
    marketId: number = 1;
    exchangeCode: string = '';
    marketCode: string = '';
    symbol: string = '';
    custodian: string = '';
    account: string = '';

    noMarketFound: boolean = false;
    isChangeOrder: boolean = false;
    isCancelOrder: boolean = false;
    public disabledCheckbox: Boolean = true;
    allTraders: Boolean = false;

    data: any = [];
    errorMsg: string = '';
    userType: string;
    lang: any

    includeColumnHeader: boolean = true;

    filterColumns = ['exchange', 'market', 'symbol', 'order_no', 'username', 'custodian', 'account', 'price', 'volume',
        'type_', 'qualifier', 'state_time', 'discQuantity', 'triggerPrice', 'tifOption', 'gtd'];

    @ViewChild('cmbMarket', { static: false }) cmbMarket: wjcInput.ComboBox;
    @ViewChild('client', { static: false }) client: wjcInput.ComboBox;

    @ViewChild('cmbExchange', { static: false }) cmbExchange: wjcInput.ComboBox;
    @ViewChild('cmbTraders', { static: false }) cmbTraders: wjcInput.MultiSelect;
    @ViewChild('flexGrid', { static: false }) flexGrid: wjcGrid.FlexGrid;

    @ViewChild('orderSubmittedDlg', { static: false }) orderSubmittedDlg: wjcInput.Popup;

    @ViewChild('orderChangeWO', { static: false }) orderChangeWO: BondOrderChange;
    @ViewChild('orderCancelWO', { static: false }) orderCancelWO: BondOrderCancel;
    @ViewChild(DialogCmpReports) dialogCmp: DialogCmpReports;


    @ViewChild(ChangeOrderAll, { static: false }) changeOrderAll: ChangeOrderAll;
    @ViewChild(CancelOrderAll, { static: false }) cancelOrderAll: CancelOrderAll;


    private _pageSize = 0;
    username: string;

    // -------------------------------------------------------------------------

    constructor(private appState: AppState, public authService: AuthService, private orderSvc: OrderService,
        private listingSvc: ListingService, private _fb: FormBuilder, private translate: TranslateService, private splash: FuseLoaderScreenService,) {
        this.isSubmitted = false;
        this.userType = AppConstants.userType;
        this.username = AppConstants.username;
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
    }

    // -------------------------------------------------------------------------

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
            // this.getWorkingOrders();
        }

        this.loadExchanges();
        if (this.exchangeId > 0) {
            this.loadExchangeMarkets(this.exchangeId);
        }

        this.authService.socket.on('order_confirmation', (dataorderConfirmation) => {
            this.updateorderConfirmation(dataorderConfirmation);
        });
    }

    // -------------------------------------------------------------------------

    ngAfterViewInit() {
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

        // let host = this.flexGrid.hostElement;
        // show a message when the user double-clicks a cell
        // host.addEventListener('dblclick', function (e) {
        //     // var sel = this.flex.selection;
        //     alert('double clicked on cell ' + JSON.stringify(e));
        // });
    }

    // -------------------------------------------------------------------------

    print(): void {
        window.print();
    };

    // -------------------------------------------------------------------------

    get pageSize(): number {
        return this._pageSize;
    }

    // -------------------------------------------------------------------------

    set pageSize(value: number) {
        if (this._pageSize !== value) {
            this._pageSize = value;
            if (this.flexGrid) {
                (<wjcCore.IPagedCollectionView>this.flexGrid.collectionView).pageSize = value;
            }
        }
    }

    // -------------------------------------------------------------------------

    loadTraders(): void {

        this.splash.show();
        this.listingSvc.getUserList(AppConstants.participantId).subscribe(

            restData => {
                this.splash.hide();
                if (AppUtility.isEmptyArray(restData)) {
                    this.errorMsg = AppConstants.MSG_NO_DATA_FOUND;
                }
                else {
                    this.updateTraders(restData);
                    // this.getWorkingOrders();
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


    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------

    getWorkingOrders(model: any, isValid: boolean): void {
        this.splash.show();


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
                console.log("bond Working orders, User name: " + AppConstants.username);
                usersOmsReports.users[0] = AppConstants.username                
                usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
                usersOmsReports.marketType = AppConstants.MARKET_TYPE_BONDS;
                
            }

            this.splash.show();
            this.orderSvc.getOrders(usersOmsReports).subscribe(
                data => {

                    this.splash.hide();
                    this.updateWorkingOrders(data);

                },
                error => {
                    this.splash.hide();
                    this.errorMsg = <any>error.message;
                });
        }
    }

    // -------------------------------------------------------------------------

    dblclick(s: wjcGrid.FlexGrid, e: any) {
        AppUtility.printConsole('dblclick');
        if (AppUtility.isValidVariable(s.selectedRows[0])) {
            AppUtility.printConsole('dblclick: s.selectedRows[0].dataItem - ' + JSON.stringify(s.selectedRows[0].dataItem));
            this.loadChangeOrder();
        }
    }

    // -------------------------------------------------------------------------

    click(s: wjcGrid.FlexGrid, e: MouseEvent) {
        AppUtility.printConsole('click');
        if (e.ctrlKey) {
            AppUtility.printConsole('ctrl + click: s.selectedRows[0].dataItem - ' + JSON.stringify(s.selectedRows[0].dataItem));
            this.loadCancelOrder();
        }
    }

    // -------------------------------------------------------------------------

    selectionChanged(s, e) {
        if (AppUtility.isValidVariable(this.data) && this.data.length > 0) {
            // let rowIndex = e.row;
            // this.selectedOrder = this.data[rowIndex];
            AppUtility.printConsole('selectionChanged called.');
            this.selectedOrder = this.flexGrid.rows[this.flexGrid.selection.row].dataItem;
        }
        else {
            this.selectedOrder = null;
        }
    }

    // -------------------------------------------------------------------------

    updateorderConfirmation(data) {
        if (AppUtility.isValidVariable(data)) {
            if (data.state === 'submitted' || data.state === 'changed' || data.state === 'cancelled') {
                // 2 Nov, 22 Muhammad Hassan 
                // To avoid extra calls to back end 
                //   this.getWorkingOrders('', true);
            }
        }
    }

    // -------------------------------------------------------------------------

    updateWorkingOrders(workingOrders): void {
        this.data = [];

        let orders = workingOrders.orders;
        if (AppUtility.isEmpty(orders)) {
            return;
        }

        for (let i = 0; i < orders.length; i++) {
            if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === orders[i].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === orders[i].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === orders[i].symbol) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === orders[i].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === orders[i].account)) {
                    
                let o: Order = new Order();
                o.setOrder(orders[i]);
                o.type_ = AppUtility.ucFirstLetter(o.type_);
                o.state_time = <any>wjcCore.Globalize.formatDate(new Date(o.state_time), AppConstants.DATE_TIME_FORMAT);
                this.data.push(o);
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === orders[i].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === orders[i].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === AppConstants.ALL_STR) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === orders[i].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === orders[i].account)) {
                    
                let o: Order = new Order();
                o.setOrder(orders[i]);
                o.type_ = AppUtility.ucFirstLetter(o.type_);
                o.state_time = <any>wjcCore.Globalize.formatDate(new Date(o.state_time), AppConstants.DATE_TIME_FORMAT);
                this.data.push(o);
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === orders[i].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === orders[i].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === orders[i].symbol) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === orders[i].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === AppConstants.ALL_STR)) {

                     
                let o: Order = new Order();
                o.setOrder(orders[i]);
                o.type_ = AppUtility.ucFirstLetter(o.type_);
                o.state_time = <any>wjcCore.Globalize.formatDate(new Date(o.state_time), AppConstants.DATE_TIME_FORMAT);
                this.data.push(o);
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === orders[i].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === orders[i].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === AppConstants.ALL_STR) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === orders[i].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === AppConstants.ALL_STR)) {
                
                let o: Order = new Order();
                o.setOrder(orders[i]);
                o.type_ = AppUtility.ucFirstLetter(o.type_);
                o.state_time = <any>wjcCore.Globalize.formatDate(new Date(o.state_time), AppConstants.DATE_TIME_FORMAT);
                this.data.push(o);
            }
        }
    }

    // -------------------------------------------------------------------------

    loadExchanges(): void {
        // update exchanges data

        this.listingSvc.getExchangeList().subscribe(
            data => {
                this.splash.hide();
                if (data == null)
                    return;

                this.exchanges = data;
                this.exchangeId = this.exchanges[0].exchangeId;
                let exchange: Exchange = new Exchange(0, AppConstants.PLEASE_SELECT_STR);
                this.exchanges.unshift(exchange);
                this.exchangeId = (AppConstants.exchangeId === null) ? this.exchanges[0].exchangeId : AppConstants.exchangeId;
            },
            error => {
                this.splash.hide();
                this.errorMsg = <any>error;
            });
    }

    // -------------------------------------------------------------------------

    loadExchangeMarkets(exchangeId): void {
        //this.loadEmptyMarket();
        this.noMarketFound = true;
        this.getExchangeCustodians(exchangeId);
        this.splash.show();
        this.listingSvc.getMarketListByExchange(exchangeId).subscribe(
            data => {

                if (data == null) {
                    console.log('No data found');
                    return;
                }
                this.updateMarketData(data);

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
            //  let market: Market = new Market(0, AppConstants.PLEASE_SELECT_STR);
            //  this.markets.unshift(market);
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








    // -------------------------------------------------------------------------

    getExchangeCustodians(exchangeId) {
        let obj: ComboItem;
        this.splash.show();
        this.listingSvc.getCustodianByExchange(exchangeId).subscribe(
            restData => {
                this.splash.hide();
                if (!AppUtility.isValidVariable(restData) || AppUtility.isEmpty(restData)) {
                    return;
                }

                this.custodians = restData;
                for (let i = 0; i < restData.length; i++) {
                    this.custodians[i] = new ComboItem(this.custodians[i].participantCode, this.custodians[i].participantCode);
                }

                obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
                this.custodians.unshift(obj);
            },
            error => { this.splash.hide(); this.errorMsg = <any>error });
    }

    // -------------------------------------------------------------------------

    loadEmptyMarket(): void {
        this.markets = [];
        this.market = new Market();
        this.market.marketId = 1;
        this.market.marketCode = '';
        this.markets.push(this.market);
    }

    // -------------------------------------------------------------------------

    setMarketId(value): void {
        this.marketId = value;
    }

    // -------------------------------------------------------------------------

    getSymbols(exchangeId, marketId): void {

    }

    // -------------------------------------------------------------------------

    onExchangeChange(value): void {
        this.exchangeCode = value;
        this.loadExchangeMarkets(value);
        this.getClientsList(value);
    }

    // -------------------------------------------------------------------------

    onMarketChange(): void {
        this.marketCode = this.cmbMarket.text;
    }

    // -------------------------------------------------------------------------

    public onChangeOrder() {
        this.isChangeOrder = true;
        this.isCancelOrder = false;
    }

    // -------------------------------------------------------------------------

    public onCancelOrder() {
        this.isCancelOrder = true;
        this.isChangeOrder = false;
    }

    // -------------------------------------------------------------------------

    public onCancelAction() {

    }

    // -------------------------------------------------------------------------

    exportExcel() {
        wjcGridXlsx.FlexGridXlsxConverter.save(this.flexGrid, { includeColumnHeaders: this.includeColumnHeader, includeCellStyles: false }, 'Bond Working Orders.xlsx');
    }




    exportPDF() {
        gridPdf.FlexGridPdfConverter.export(this.flexGrid, 'Bonds Working Orders ' + new Date().toLocaleString() + '.pdf', {
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




    // -------------------------------------------------------------------------

    loadChangeOrder() {

        let orderNo: string = '';
        if (!AppUtility.isValidVariable(this.selectedOrder)) {
            return;
        }

        AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
        orderNo = this.selectedOrder.order_no;
        this.changeOrderAll.loadOrderNo(orderNo, this.selectedOrder.username);
    }

    // -------------------------------------------------------------------------

    loadCancelOrder() {

        let orderNo: string = '';
        if (!AppUtility.isValidVariable(this.selectedOrder)) {
            return;
        }
        AppConstants.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS;
        orderNo = this.selectedOrder.order_no;
        this.cancelOrderAll.loadOrderNo(orderNo, this.selectedOrder.username);

    }

    // -------------------------------------------------------------------------

    public getNotification(btnClicked) {
    }

    // -------------------------------------------------------------------------

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
                        this.getWorkingOrders('' , true);
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
