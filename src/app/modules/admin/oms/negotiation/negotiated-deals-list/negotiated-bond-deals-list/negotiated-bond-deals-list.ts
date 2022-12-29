import { Component, Inject, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';

import { ListingService } from 'app/services-oms/listing-oms.service';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import { OrderTypes } from 'app/models/order-types';
import { Order } from 'app/models/order';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DialogCmpReports } from '../../../reports/dialog-cmp-reports';
import { OrderService } from 'app/services-oms/order-oms.service';
@Component({
    selector: 'negotiated-bond-deals-list',
    templateUrl: './negotiated-bond-deals-list.html',
})

export class NegotiatedBondDealsListComponent {

    filterColumns = ['assetClass', 'symbol', 'side', 'price', 'quantity','settlementAmount', 'sellerAccount', 'sellerBroker', 'sellerCustodian', 'sellerUser',
    'buyerAccount','buyerBroker', 'buyerCustodian','buyerUser', 'initiator', 'status'];

    lang: string;
    userType: string;
    private _pageSize = 0;
    private _pageSize2 = 0;
    dataInitiatedByMe: any = [];
    dataInitiatedForMe: any = [];
    traders: any[] = [];
    errorMsg: string = '';
    data: any = [];
    data_temp: any = [];

    @ViewChild('flexGrid', { static: false }) flexGrid: wjcGrid.FlexGrid;
    @ViewChild('flexGrid2', { static: false }) flexGrid2: wjcGrid.FlexGrid;
    @ViewChild(DialogCmpReports) dialogCmp: DialogCmpReports;

    constructor(private translate: TranslateService, public authService: AuthService2,private splash: FuseLoaderScreenService, private listingSvc: ListingService, private orderSvc: OrderService,) {

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
    }

    // -------------------------------------------------------------------------
    get pageSize1(): number {
        return this._pageSize;
    }
    // -------------------------------------------------------------------------
    set pageSize1(value: number) {
        if (this._pageSize !== value) {
            this._pageSize = value;
            if (this.flexGrid) {
                (<wjcCore.IPagedCollectionView>this.flexGrid.collectionView).pageSize = value;
            }
        }
    }
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    get pageSize2(): number {
        return this._pageSize2;
    }
    // -------------------------------------------------------------------------
    set pageSize2(value: number) {
        if (this._pageSize2 !== value) {
            this._pageSize2 = value;
            if (this.flexGrid2) {
                (<wjcCore.IPagedCollectionView>this.flexGrid2.collectionView).pageSize = value;
            }
        }
    }
    // -------------------------------------------------------------------------

    
    ngOnInit() {

        if (this.userType === 'PARTICIPANT' || this.userType === 'PARTICIPANT ADMIN') {
            this.loadTraders();
        }
        else
            this.getEventLog('', true);
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

                this.getEventLog('', true);
            },
            error => {
                this.splash.hide();
                this.errorMsg = <any>error;
                this.dialogCmp.statusMsg = this.errorMsg;
                this.dialogCmp.showAlartDialog('Error');
            });
    }


    // -------------------------------------------------------------------------

    getEventLog(model: any, isValid: boolean): void {

        let usersOmsReports: UsersOmsReports = null;
        if (this.userType === 'PARTICIPANT' || this.userType === 'PARTICIPANT ADMIN') {

            usersOmsReports = new UsersOmsReports();
            for (let i = 0; i < this.traders.length; i++) {
                usersOmsReports.users[i] = this.traders[i].email;
            }
            usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
            usersOmsReports.marketType = AppConstants.MARKET_TYPE_BONDS

        } else {

            usersOmsReports = new UsersOmsReports();
            console.log("event log, User name: " + AppConstants.username);
            usersOmsReports.users[0] = AppConstants.username
            usersOmsReports.symbolType = AppConstants.SYMBOL_TYPE_BONDS;
            usersOmsReports.marketType = AppConstants.MARKET_TYPE_BONDS;
        }
        AppUtility.printConsole("userOmsReports: " + usersOmsReports);
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

    // -------------------------------------------------------------------------

    updateData(eventLog): void {
        debugger
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

        this.data = this.data_temp.sort((n1, n2) => new Date(n1.state_time).getTime() - new Date(n2.state_time).getTime());
        let byMe = []
        let forMe = []
        this.data.map(a => {
            debugger
            if (a.username == AppConstants.username) {
                byMe.push(a)
            }
            else
                forMe.push(a)
        })
        debugger
        this.dataInitiatedByMe = byMe;
        this.dataInitiatedForMe = forMe;
    }
}