import { Component, ViewEncapsulation, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';

import { Order } from 'app/models/order';
import { AppState } from 'app/app.service';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { FormBuilder } from '@angular/forms';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { AppConstants, AppUtility } from 'app/app.utility';
import { DialogCmpReports } from 'app/modules/admin/oms/reports/dialog-cmp-reports';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import { OrderTypes } from 'app/models/order-types';
import { Subject } from 'rxjs';
import { elementAt, takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';

declare var jQuery: any;
//import 'slim_scroll/jquery.slimscroll.js';
@Component({
    selector: 'audit-trails-dashboard',
    templateUrl: './audit-trails-dashboard.html',
    encapsulation: ViewEncapsulation.None,
})
export class AuditTrailDashboardComponent implements OnInit {

    filterColumns = ['exchange', 'market', 'symbol', 'order_no', 'ticket_no', 'account', 'username', 'custodian', 'order_state',
        'price', 'volume', 'trigger_price', 'filled_volume', 'remaining_volume', 'type', 'qualifier', 'discQuantity',
        'state_time', 'execution_time', 'tifOption', 'gtd'];

    data: any = [];
    data_temp: any = [];
    userType: string;
    allTraders: Boolean = true;
    traders: any[] = [];
    lang: string;
    errorMsg: string = '';
    selectedOrder: Order;
    private _pageSize = 0;
    username: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedAssetClass = AppConstants.selectedAssetClass
    @ViewChild('cmbExchange', { static: false }) cmbExchange: wjcInput.ComboBox;
    @ViewChild('cmbMarket', { static: false }) cmbMarket: wjcInput.ComboBox;
    @ViewChild('cmbTraders', { static: false }) cmbTraders: wjcInput.MultiSelect;
    @ViewChild('flexGrid', { static: false }) flexGrid: wjcGrid.FlexGrid;
    @ViewChild(DialogCmpReports) dialogCmp: DialogCmpReports;
    @ViewChild('client', { static: false }) client: wjcInput.ComboBox;

    constructor(private appState: AppState, private authService: AuthService, private orderSvc: OrderService, private listingSvc: ListingService,
        private _fb: FormBuilder, private translate: TranslateService, private splash: FuseLoaderScreenService, private dashboardService: DashboardService) {
        this.userType = AppConstants.userType;

        //_______________________________for ngx_translate_________________________________________
        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
    }

    ngOnInit(): void {

        this.dashboardService.selectedAssetClass$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.selectedAssetClass = data

                if (this.userType === 'PARTICIPANT' || this.userType === 'PARTICIPANT ADMIN') {
                    this.loadTraders();
                }
                else {
                    this.username = AppConstants.loginName;
                    this.traders = [];
                    let u: any = new Object();
                    u.userName = AppConstants.loginName;
                    u.email = AppConstants.username;
                    this.traders.push(u);
                    this.getEventLog('', true);
                }
            });

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
            users => {
                this.splash.hide();
                if (AppUtility.isEmptyArray(users)) {
                    this.errorMsg = AppConstants.MSG_NO_DATA_FOUND;
                    return;
                }
                this.updateTraders(users);
            },
            error => {

                this.splash.hide();
                this.errorMsg = <any>error;
                this.dialogCmp.statusMsg = this.errorMsg;
                this.dialogCmp.showAlartDialog('Error');
            });
    }

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
        }
        this.getEventLog('', true);
    }

    getEventLog(model: any, isValid: boolean): void {

        let usersOmsReports: UsersOmsReports = null;
        if (this.userType === 'PARTICIPANT' || this.userType === 'PARTICIPANT ADMIN') {

            usersOmsReports = new UsersOmsReports();
            for (let i = 0; i < this.traders.length; i++) {
                usersOmsReports.users[i] = this.traders[i].email;
            }

            if (this.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES) {
                usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_EQUITIES;
                usersOmsReports.marketType = AppConstants.MARKET_TYPE_EQUITIES
            }
            else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS) {
                usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
                usersOmsReports.marketType = AppConstants.MARKET_TYPE_BONDS;
            }
        }
        else {
            AppConstants.claims2
            usersOmsReports = new UsersOmsReports();
            usersOmsReports.users[0] = AppConstants.username

            if (this.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES) {
                usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_EQUITIES;
                usersOmsReports.marketType = AppConstants.MARKET_TYPE_EQUITIES
            }
            else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS) {
                usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
                usersOmsReports.marketType = AppConstants.MARKET_TYPE_BONDS;
            }
        }
        this.splash.show();
        this.orderSvc.getEventLog(usersOmsReports).subscribe(data => {
            this.splash.hide();
            this.updateData(data)

        },
            error => {

                this.splash.hide();
                this.errorMsg = <any>error.statusText;
                if (this.dialogCmp.statusMsg != undefined) { this.dialogCmp.statusMsg = this.errorMsg; }
                this.dialogCmp.showAlartDialog('Error');
            });
    }

    updateData(eventLog): void {
        
        this.data = [];
        this.data_temp = [];
        let orders = eventLog.orders;
        let trades = eventLog.trades;

        if (orders == null) { return; }

        for (let i = 0; i < orders.length; i++) {
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
                orders[i].trigger_price = (Number(eventLog.orders[i].trigger_price) > 0) ? eventLog.orders[i].trigger_price : '';
                this.data_temp.push(orders[i]);
            }
        }

        for (let j = 0; j < trades.length; j++) {

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
        this.data = this.data_temp.sort((n1, n2) => new Date(n1.state_time).getTime() - new Date(n2.state_time).getTime());

    }

}