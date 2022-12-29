
import { Component, ViewEncapsulation, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcGridXlsx from '@grapecity/wijmo.grid.xlsx';
import * as wjcXlsx from '@grapecity/wijmo.xlsx';
import * as pdf from '@grapecity/wijmo.pdf';
import * as gridPdf from '@grapecity/wijmo.grid.pdf';
import * as JSZip from 'jszip';
import { TranslateService } from '@ngx-translate/core';
import { Market } from 'app/models/market';
import { ComboItem } from 'app/models/combo-item';
import { AppConstants, AppUtility } from 'app/app.utility';
import { DialogCmpReports } from '../dialog-cmp-reports';
import { AppState } from 'app/app.service';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import { Order } from 'app/models/order';
import { Symbol } from 'app/models/symbol';
import { OrderTypes } from 'app/models/order-types';
import { Exchange } from 'app/models/exchange';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { Client } from 'app/models/client';



declare var jQuery: any;
//import 'slim_scroll/jquery.slimscroll.js';

/////////////////////////////////////////////////////////////////////////

@Component({
    selector: 'bond-event-log',
    templateUrl: './bond-event-log.html',
    encapsulation: ViewEncapsulation.None
})
export class BondEventLog implements OnInit, AfterViewInit {

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

    dateTimeFormat: string = AppConstants.DATE_TIME_FORMAT;
    noMarketFound: boolean = false;
    includeColumnHeader: boolean = true;
    public disabledCheckbox: Boolean = true;
    allTraders: Boolean = false;

    _pageSize = 0;
    data: any = [];
    data_temp: any = [];
    errorMsg: string = '';
    userType: string;
    lang: any

    filterColumns = ['exchange', 'market', 'symbol', 'order_no', 'ticket_no', 'account', 'username', 'custodian', 'order_state',
        'price', 'volume', 'trigger_price', 'filled_volume', 'remaining_volume', 'type', 'qualifier', 'discQuantity',
        'state_time', 'execution_time', 'tifOption', 'gtd'];

    @ViewChild('cmbExchange', { static: false }) cmbExchange: wjcInput.ComboBox;
    @ViewChild('cmbMarket', { static: false }) cmbMarket: wjcInput.ComboBox;
    @ViewChild('cmbTraders', { static: false }) cmbTraders: wjcInput.MultiSelect;
    @ViewChild('flexGrid', { static: false }) flexGrid: wjcGrid.FlexGrid;
    @ViewChild('dialogCmp', { static: false }) dialogCmp: DialogCmpReports;
    @ViewChild('client', { static: false }) client: wjcInput.ComboBox;
    username: string;
    // -------------------------------------------------------------------------

    constructor(private appState: AppState, private authService: AuthService, private orderSvc: OrderService,
        private listingSvc: ListingService, private _fb: FormBuilder, private translate: TranslateService, public splash: FuseLoaderScreenService) {
        this.userType = AppConstants.userType;
        this.isSubmitted = false;
        this.username = AppConstants.username;
        if (this.userType.toUpperCase() == 'PARTICIPANT' && this.userType.toUpperCase() == 'PARTICIPANT ADMIN')
            this.disabledCheckbox = false;
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
            //this.getEventLog();
        }

        this.loadExchanges();
        if (this.exchangeId > 0) {
            this.loadExchangeMarkets(this.exchangeId);
        }

        this.authService.socket.on('order_confirmation', (confirmation) => {
            if (!AppUtility.isValidVariable(confirmation)) {
                return;
            }

            if (confirmation.state === 'submitted' ||
                confirmation.state === 'changed' ||
                confirmation.state === 'cancelled') {
                this.getEventLog('', true);
            }
        });
    }

    // -------------------------------------------------------------------------

    ngAfterViewInit() {
        jQuery('.grid > div > div:nth-child(2)').addClass('slim_scroll');

        jQuery('.slim_scroll').slimScroll(
            {
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

    print(): void {
        window.print();
    };

    // -------------------------------------------------------------------------

    loadTraders(): void {
        this.splash.show();
        this.listingSvc.getUserList(AppConstants.participantId).subscribe(
            users => {
                this.splash.hide();
                if (AppUtility.isEmptyArray(users)) {
                    this.errorMsg = AppConstants.MSG_NO_DATA_FOUND;
                    return;
                }

                this.traders = [];
                let u: any = new Object();
                u.userName = AppConstants.loginName;
                u.email = AppConstants.username;
                this.traders.push(u);
                this.traders[0].selected = true;
                this.traders[0].$checked = true;
                for (let i = 1; i <= users.length; i++) {
                    this.traders[i] = users[i - 1];
                    if (this.traders[i].userName === AppConstants.loginName) {
                        this.traders[i].selected = true;
                        this.traders[i].$checked = true;
                    }
                }

                // this.getEventLog();
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

    getEventLog(model: any, isValid: boolean): void {
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
                console.log("bond event log, User name: " + AppConstants.username);
                usersOmsReports.users[0] = AppConstants.username                
                usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
                usersOmsReports.marketType = AppConstants.SYMBOL_TYPE_BONDS; 
            }
            AppUtility.printConsole(usersOmsReports);
            this.splash.show();
            this.orderSvc.getEventLog(usersOmsReports).subscribe(
                data => {
                    this.splash.hide();
                    this.updateData(data);
                },
                error => {
                    this.splash.hide();
                    this.errorMsg = <any>error;
                });
        }
    }
    // -------------------------------------------------------------------------

    updateData(eventLog): void {
        this.data = [];
        this.data_temp = [];
        let orders = eventLog.orders;
        let trades = eventLog.trades;

        if (orders == null) { return; }

        for (let i = 0; i < orders.length; i++) {
            if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === orders[i].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === orders[i].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === orders[i].symbol) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === orders[i].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === orders[i].account)) {
                if (orders[i].order_state !== 'partial_filled' && orders[i].order_state !== 'filled') {
                    Order.setStuffBasedOnType(orders[i], orders[i]);
                    if (orders[i].order_state === 'submitted') {
                        orders[i].filled_volume = '0';
                        orders[i].remaining_volume = orders[i].volume;
                    }
                    orders[i].state_time = wjcCore.Globalize.formatDate(new Date(orders[i].state_time), AppConstants.DATE_TIME_FORMAT);
                    orders[i].type = OrderTypes.getOrderTypeViewStr(orders[i].type);
                    orders[i].order_state = AppUtility.ucFirstLetter(orders[i].order_state);
                    orders[i].order_no = orders[i].order_no.toString();
                    if (AppUtility.isValidVariable(orders[i].ticket_no)) {
                        orders[i].ticket_no = orders[i].ticket_no.toString();
                    }
                    orders[i].volume = (eventLog.orders[i].volume > 0) ? wjcCore.Globalize.format(eventLog.orders[i].volume, 'n0') : '';
                    orders[i].price = (Number(eventLog.orders[i].price) > 0) ? eventLog.orders[i].price : '';
                    orders[i].yield = (Number(eventLog.orders[i].yield) > 0) ? eventLog.orders[i].yield : '';
                    orders[i].accrudeProfit = (Number(eventLog.orders[i].accrudeProfit) > 0) ? eventLog.orders[i].accrudeProfit : '';
                    orders[i].trigger_price = (Number(eventLog.orders[i].trigger_price) > 0) ? eventLog.orders[i].trigger_price : '';
                    this.data_temp.push(orders[i]);
                }
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === orders[i].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === orders[i].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === AppConstants.ALL_STR) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === orders[i].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === orders[i].account)) {
                if (orders[i].order_state !== 'partial_filled' && orders[i].order_state !== 'filled') {
                    Order.setStuffBasedOnType(orders[i], orders[i]);
                    if (orders[i].order_state === 'submitted') {
                        orders[i].filled_volume = '0';
                        orders[i].remaining_volume = orders[i].volume;
                    }
                    orders[i].state_time = wjcCore.Globalize.formatDate(new Date(orders[i].state_time), AppConstants.DATE_TIME_FORMAT);
                    orders[i].type = OrderTypes.getOrderTypeViewStr(orders[i].type);
                    orders[i].order_state = AppUtility.ucFirstLetter(orders[i].order_state);
                    orders[i].order_no = orders[i].order_no.toString();
                    if (AppUtility.isValidVariable(orders[i].ticket_no)) {
                        orders[i].ticket_no = orders[i].ticket_no.toString();
                    }
                    orders[i].volume = (eventLog.orders[i].volume > 0) ? wjcCore.Globalize.format(eventLog.orders[i].volume, 'n0') : '';
                    orders[i].price = (Number(eventLog.orders[i].price) > 0) ? eventLog.orders[i].price : '';
                    orders[i].yield = (Number(eventLog.orders[i].yield) > 0) ? eventLog.orders[i].yield : '';
                    orders[i].accrudeProfit = (Number(eventLog.orders[i].accrudeProfit) > 0) ? eventLog.orders[i].accrudeProfit : '';
                    orders[i].trigger_price = (Number(eventLog.orders[i].trigger_price) > 0) ? eventLog.orders[i].trigger_price : '';
                    this.data_temp.push(orders[i]);
                }
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === orders[i].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === orders[i].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === orders[i].symbol) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === orders[i].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === AppConstants.ALL_STR)) {
                if (orders[i].order_state !== 'partial_filled' && orders[i].order_state !== 'filled') {
                    Order.setStuffBasedOnType(orders[i], orders[i]);
                    if (orders[i].order_state === 'submitted') {
                        orders[i].filled_volume = '0';
                        orders[i].remaining_volume = orders[i].volume;
                    }
                    orders[i].state_time = wjcCore.Globalize.formatDate(new Date(orders[i].state_time), AppConstants.DATE_TIME_FORMAT);
                    orders[i].type = OrderTypes.getOrderTypeViewStr(orders[i].type);
                    orders[i].order_state = AppUtility.ucFirstLetter(orders[i].order_state);
                    orders[i].order_no = orders[i].order_no.toString();
                    if (AppUtility.isValidVariable(orders[i].ticket_no)) {
                        orders[i].ticket_no = orders[i].ticket_no.toString();
                    }
                    orders[i].volume = (eventLog.orders[i].volume > 0) ? wjcCore.Globalize.format(eventLog.orders[i].volume, 'n0') : '';
                    orders[i].price = (Number(eventLog.orders[i].price) > 0) ? eventLog.orders[i].price : '';
                    orders[i].yield = (Number(eventLog.orders[i].yield) > 0) ? eventLog.orders[i].yield : '';
                    orders[i].accrudeProfit = (Number(eventLog.orders[i].accrudeProfit) > 0) ? eventLog.orders[i].accrudeProfit : '';
                    orders[i].trigger_price = (Number(eventLog.orders[i].trigger_price) > 0) ? eventLog.orders[i].trigger_price : '';
                    this.data_temp.push(orders[i]);
                }
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === orders[i].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === orders[i].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === AppConstants.ALL_STR) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === orders[i].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === AppConstants.ALL_STR)) {
                if (orders[i].order_state !== 'partial_filled' && orders[i].order_state !== 'filled') {
                    Order.setStuffBasedOnType(orders[i], orders[i]);
                    if (orders[i].order_state === 'submitted') {
                        orders[i].filled_volume = '0';
                        orders[i].remaining_volume = orders[i].volume;
                    }
                    orders[i].state_time = wjcCore.Globalize.formatDate(new Date(orders[i].state_time), AppConstants.DATE_TIME_FORMAT);
                    orders[i].type = OrderTypes.getOrderTypeViewStr(orders[i].type);
                    orders[i].order_state = AppUtility.ucFirstLetter(orders[i].order_state);
                    orders[i].order_no = orders[i].order_no.toString();
                    if (AppUtility.isValidVariable(orders[i].ticket_no)) {
                        orders[i].ticket_no = orders[i].ticket_no.toString();
                    }
                    orders[i].volume = (eventLog.orders[i].volume > 0) ? wjcCore.Globalize.format(eventLog.orders[i].volume, 'n0') : '';
                    orders[i].price = (Number(eventLog.orders[i].price) > 0) ? eventLog.orders[i].price : '';
                    orders[i].yield = (Number(eventLog.orders[i].yield) > 0) ? eventLog.orders[i].yield : '';
                    orders[i].accrudeProfit = (Number(eventLog.orders[i].accrudeProfit) > 0) ? eventLog.orders[i].accrudeProfit : '';
                    orders[i].trigger_price = (Number(eventLog.orders[i].trigger_price) > 0) ? eventLog.orders[i].trigger_price : '';
                    this.data_temp.push(orders[i]);
                }
            }
        }



        for (let j = 0; j < trades.length; j++) {
            if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === trades[j].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === trades[j].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === trades[j].symbol) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === trades[j].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === trades[j].account)) {
                if (trades[j].remaining_volume > 0) {
                    trades[j].order_state = 'partial_filled';
                }
                else {
                    trades[j].order_state = 'Filled';
                }
                trades[j].filled_volume = (trades[j].volume > 0) ? wjcCore.Globalize.format(trades[j].volume, 'n0') : '0';
                trades[j].state_time = wjcCore.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMAT);
                trades[j].execution_time = wjcCore.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMAT);
                trades[j].side = trades[j].side;
                trades[j].order_no = trades[j].order_no.toString();
                trades[j].ticket_no = trades[j].ticket_no.toString();
                trades[j].volume = '';
                trades[j].price = (Number(trades[j].price) > 0) ? trades[j].price : '';
                trades[j].trigger_price = (Number(trades[j].trigger_price) > 0) ? trades[j].trigger_price : '';
                trades[j].yield = (Number(trades[j].yield) > 0) ? trades[j].yield : '';
                trades[j].accrudeProfit = (Number(trades[j].accrudeProfit) > 0) ? trades[j].accrudeProfit : '';

                let selectedOrder: any;
                selectedOrder = orders.find(item => Number(item.order_no) === Number(trades[j].order_no));
                AppUtility.printConsole('selectedOrder: ' + JSON.stringify(selectedOrder));
                if (!AppUtility.isValidVariable(selectedOrder.tifOption)) {
                    Order.setStuffBasedOnType(selectedOrder, selectedOrder);
                }
                trades[j].tifOption = selectedOrder.tifOption;
                trades[j].gtd = selectedOrder.gtd;
                trades[j].qualifier = selectedOrder.qualifier;
                trades[j].expiryDate = selectedOrder.expiryDate;
                trades[j].discQuantity = selectedOrder.discQuantity;
                trades[j].type = OrderTypes.getOrderTypeViewStr(selectedOrder.type);

                trades[j].short ? (trades[j].short = 'Yes') : (trades[j].short = 'No');

                this.data_temp.push(trades[j]);
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === trades[j].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === trades[j].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === AppConstants.ALL_STR) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === trades[j].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === trades[j].account)) {
                if (trades[j].remaining_volume > 0) {
                    trades[j].order_state = 'partial_filled';
                }
                else {
                    trades[j].order_state = 'Filled';
                }
                trades[j].filled_volume = (trades[j].volume > 0) ? wjcCore.Globalize.format(trades[j].volume, 'n0') : '0';
                trades[j].state_time = wjcCore.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMAT);
                trades[j].execution_time = wjcCore.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMAT);
                trades[j].side = trades[j].side;
                trades[j].order_no = trades[j].order_no.toString();
                trades[j].ticket_no = trades[j].ticket_no.toString();
                trades[j].volume = '';
                trades[j].price = (Number(trades[j].price) > 0) ? trades[j].price : '';
                trades[j].trigger_price = (Number(trades[j].trigger_price) > 0) ? trades[j].trigger_price : '';
                trades[j].yield = (Number(trades[j].yield) > 0) ? trades[j].yield : '';
                trades[j].accrudeProfit = (Number(trades[j].accrudeProfit) > 0) ? trades[j].accrudeProfit : '';

                let selectedOrder: any;
                selectedOrder = orders.find(item => Number(item.order_no) === Number(trades[j].order_no));
                AppUtility.printConsole('selectedOrder: ' + JSON.stringify(selectedOrder));
                if (!AppUtility.isValidVariable(selectedOrder.tifOption)) {
                    Order.setStuffBasedOnType(selectedOrder, selectedOrder);
                }
                trades[j].tifOption = selectedOrder.tifOption;
                trades[j].gtd = selectedOrder.gtd;
                trades[j].qualifier = selectedOrder.qualifier;
                trades[j].expiryDate = selectedOrder.expiryDate;
                trades[j].discQuantity = selectedOrder.discQuantity;
                trades[j].type = OrderTypes.getOrderTypeViewStr(selectedOrder.type);

                trades[j].short ? (trades[j].short = 'Yes') : (trades[j].short = 'No');

                this.data_temp.push(trades[j]);
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === trades[j].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === trades[j].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === trades[j].symbol) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === trades[j].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === AppConstants.ALL_STR)) {
                if (trades[j].remaining_volume > 0) {
                    trades[j].order_state = 'partial_filled';
                }
                else {
                    trades[j].order_state = 'Filled';
                }
                trades[j].filled_volume = (trades[j].volume > 0) ? wjcCore.Globalize.format(trades[j].volume, 'n0') : '0';
                trades[j].state_time = wjcCore.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMAT);
                trades[j].execution_time = wjcCore.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMAT);
                trades[j].side = trades[j].side;
                trades[j].order_no = trades[j].order_no.toString();
                trades[j].ticket_no = trades[j].ticket_no.toString();
                trades[j].volume = '';
                trades[j].price = (Number(trades[j].price) > 0) ? trades[j].price : '';
                trades[j].trigger_price = (Number(trades[j].trigger_price) > 0) ? trades[j].trigger_price : '';
                trades[j].yield = (Number(trades[j].yield) > 0) ? trades[j].yield : '';
                trades[j].accrudeProfit = (Number(trades[j].accrudeProfit) > 0) ? trades[j].accrudeProfit : '';

                let selectedOrder: any;
                selectedOrder = orders.find(item => Number(item.order_no) === Number(trades[j].order_no));
                AppUtility.printConsole('selectedOrder: ' + JSON.stringify(selectedOrder));
                if (!AppUtility.isValidVariable(selectedOrder.tifOption)) {
                    Order.setStuffBasedOnType(selectedOrder, selectedOrder);
                }
                trades[j].tifOption = selectedOrder.tifOption;
                trades[j].gtd = selectedOrder.gtd;
                trades[j].qualifier = selectedOrder.qualifier;
                trades[j].expiryDate = selectedOrder.expiryDate;
                trades[j].discQuantity = selectedOrder.discQuantity;
                trades[j].type = OrderTypes.getOrderTypeViewStr(selectedOrder.type);

                trades[j].short ? (trades[j].short = 'Yes') : (trades[j].short = 'No');

                this.data_temp.push(trades[j]);
            }
            else if (((AppUtility.isEmpty(this.exchangeCode) || this.exchangeId === 0) || this.exchangeCode === trades[j].exchange) &&
                ((AppUtility.isEmpty(this.marketCode) || this.marketId === 0) || this.marketCode === trades[j].market) &&
                (AppUtility.isEmpty(this.symbol.trim()) || this.symbol === AppConstants.ALL_STR) &&
                ((AppUtility.isEmpty(this.custodian)) || this.custodian === trades[j].custodian) &&
                (AppUtility.isEmpty(this.account.trim()) || this.account === AppConstants.ALL_STR)) {
                if (trades[j].remaining_volume > 0) {
                    trades[j].order_state = 'partial_filled';
                }
                else {
                    trades[j].order_state = 'Filled';
                }
                trades[j].filled_volume = (trades[j].volume > 0) ? wjcCore.Globalize.format(trades[j].volume, 'n0') : '0';
                trades[j].state_time = wjcCore.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMAT);
                trades[j].execution_time = wjcCore.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMAT);
                trades[j].side = trades[j].side;
                trades[j].order_no = trades[j].order_no.toString();
                trades[j].ticket_no = trades[j].ticket_no.toString();
                trades[j].volume = '';
                trades[j].price = (Number(trades[j].price) > 0) ? trades[j].price : '';
                trades[j].trigger_price = (Number(trades[j].trigger_price) > 0) ? trades[j].trigger_price : '';
                trades[j].yield = (Number(trades[j].yield) > 0) ? trades[j].yield : '';
                trades[j].accrudeProfit = (Number(trades[j].accrudeProfit) > 0) ? trades[j].accrudeProfit : '';

                let selectedOrder: any;
                selectedOrder = orders.find(item => Number(item.order_no) === Number(trades[j].order_no));
                AppUtility.printConsole('selectedOrder: ' + JSON.stringify(selectedOrder));
                if (!AppUtility.isValidVariable(selectedOrder.tifOption)) {
                    Order.setStuffBasedOnType(selectedOrder, selectedOrder);
                }
                trades[j].tifOption = selectedOrder.tifOption;
                trades[j].gtd = selectedOrder.gtd;
                trades[j].qualifier = selectedOrder.qualifier;
                trades[j].expiryDate = selectedOrder.expiryDate;
                trades[j].discQuantity = selectedOrder.discQuantity;
                trades[j].type = OrderTypes.getOrderTypeViewStr(selectedOrder.type);

                trades[j].short ? (trades[j].short = 'Yes') : (trades[j].short = 'No');

                this.data_temp.push(trades[j]);
            }
        }

        this.data = this.data_temp.sort((n1, n2) => new Date(n1.state_time).getTime() - new Date(n2.state_time).getTime());

    }

    // -------------------------------------------------------------------------

    fillTradeInfo(orderData, trades) {
        if (AppUtility.isEmpty(trades)) {
            return;
        }

        for (let i = 0; i < trades.length; i++) {
            if (orderData.order_no === trades[i].order_no && (orderData.order_state === 'filled' || orderData.order_state === 'partial_filled')) {
                if (trades[i].short) {
                    orderData.short = 'Yes';
                }
                else {
                    orderData.short = 'No';
                }

                orderData.ticket_no = trades[i].ticket_no;
                orderData.execution_time = wjcCore.Globalize.formatDate(new Date(trades[i].execution_time), AppConstants.DATE_TIME_FORMAT);

                orderData.volume = '';
                orderData.price = trades[i].price;
                orderData.yield = trades[i].yield;
                orderData.remaining_volume = trades[i].remaining_volume;
                orderData.filled_volume = trades[i].volume;
                orderData.accrudeProfit = trades[i].accrudeProfit;
            }
        }
    }

    // -------------------------------------------------------------------------

    loadExchanges(): void {
        // update exchanges data
        this.splash.show();
        this.listingSvc.getExchangeList().subscribe(
            exchanges => {
                this.splash.hide();
                if (exchanges == null)
                    return;

                this.exchanges = exchanges;
                let exchange: Exchange = new Exchange(0, AppConstants.PLEASE_SELECT_STR);
                this.exchanges.unshift(exchange);
                this.exchangeId = (AppConstants.exchangeId === null) ? this.exchanges[0].exchangeId : AppConstants.exchangeId;
            },
            error => { this.splash.hide(); this.errorMsg = <any>error });
    }

    // -------------------------------------------------------------------------

    loadExchangeMarkets(exchangeId): void {
        // update exchanges data
        //this.loadEmptyMarket();
        this.noMarketFound = true;
        this.getExchangeCustodians(exchangeId);
        this.splash.show();
        this.listingSvc.getMarketListByExchange(exchangeId).subscribe(
            exchangeMarkets => {
                this.splash.hide();
                if (exchangeMarkets == null)
                    return;

                this.noMarketFound = false;
                this.updateMarketData(exchangeMarkets);
            },
            error => { this.splash.hide; this.errorMsg = <any>error });
    }

    updateMarketData(markets) {

        this.markets = [];
        this.marketId = 0;
        for (let i = 0; i < markets.length; i++) {
            if (markets[i].marketType.description == AppConstants.MARKET_TYPE_BOND) {
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

    // -------------------------------------------------------------------------






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












    loadEmptyMarket(): void {
        this.markets = [];
        this.market = new Market();
        this.market.marketId = 1;
        this.market.marketCode = '';
        this.markets.push(this.market);
    }

    // -------------------------------------------------------------------------

    getExchangeCustodians(exchangeId) {
        this.splash.show();
        let obj: ComboItem;
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

    // -------------------------------------------------------------------------

    setMarketId(value): void {
        this.marketId = value;
    }

    // -------------------------------------------------------------------------

    getSymbols(exchangeId, marketId): void {

    }

    // -------------------------------------------------------------------------

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

    exportExcel() {
        wjcGridXlsx.FlexGridXlsxConverter.save(this.flexGrid, { includeColumnHeaders: this.includeColumnHeader, includeCellStyles: false }, 'EventLog ' + new Date().toLocaleString() + '.xlsx');
    }



    exportPDF() {
        gridPdf.FlexGridPdfConverter.export(this.flexGrid, 'Bonds EventLog' + new Date().toLocaleString() + '.pdf', {
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
                    this.getEventLog("", true);
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
