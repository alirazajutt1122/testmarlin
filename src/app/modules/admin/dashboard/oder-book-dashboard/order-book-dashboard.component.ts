import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';
import { Observable, Subject } from 'rxjs';
import { WebSocketService } from '../../../../services/socket/web-socket.service';
import { MBOData, MBPData } from './order-book-dashboard';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DashboardService } from '../dashboard.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { AppConstants, AppUtility } from 'app/app.utility';

import * as wjcInput from '@grapecity/wijmo.input';
import { Order } from 'app/models/order';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { fuseAnimations } from '@fuse/animations';

export interface Commodities {
    name: string;
    background: string;
}

@Component({
    selector: 'order-book-dashboard',
    templateUrl: './order-book-dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class OrderBookDashBoardComponent implements OnInit, AfterViewInit {

    myControl1 = new FormControl('');
    myControl = new FormControl('');
    options: any[] = [];
    filteredOptions!: Observable<string[]>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    mboDataSource: MatTableDataSource<any> = new MatTableDataSource();
    mbpDataSource: MatTableDataSource<any> = new MatTableDataSource();

    mboDataColumns: string[] = [
        'buy_volume',
        'buy_price',
        'sell_price',
        'sell_volume',
    ];
    mbpDataColumns: string[] = [
        'buy_volume',
        'buy_price',
        'sell_price',
        'sell_volume',
    ];

    selectedAssetClass: string = AppConstants.ASSET_CLASS_EQUITIES
    selectedEquityClass: string = 'best_order';
    searchSymbolValue: string = '';
    symbolExangeMarketWiseList: any[];
    symbolExangeMarketList: any[];
    mboDataArr: MBOData[] = new Array();
    mbpDataArr: MBPData[] = new Array();
    errorMsg: string = '';

    mbpDataFilter: any[];
    mboDataFilter: any[];
    highestChangedDataEq: any;
    highestChangedSymbol: string = '';
    order: Order;

    @ViewChild('singleSelect', { static: false }) singleSelect: wjcInput.ComboBox;

    constructor(
        private socket: WebSocketService,
        private userService: UserService,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        private dashboardService: DashboardService,
        private listingSvc: ListingService,
        public splash: FuseLoaderScreenService,
        private dataService: DataServiceOMS,
    ) { }

    ngOnInit(): void {

        this.order = new Order();
        this.onFetchMBOData();

        this.dashboardService.selectedAssetClass$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((ParentAssetClass) => {
                this.selectedAssetClass = ParentAssetClass
                this.populateSymbolExangeMarketList();
            });

        this.mboDataSource.data = this.mboDataArr;

        this.userService.highestChangeData$.subscribe((res: any) => {
            this.highestChangedDataEq = res;
            this.highestChangedSymbol =
                res?.securityStatsDTO.securityCode +
                ' ' +
                '(' +
                res?.securityStatsDTO.marketCode +
                ')' +
                '-' +
                res?.securityStatsDTO.exchangeCode;
        });

    }

    ngAfterViewInit(): void {
        this.onFetchMBOData();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSymbolSelect(event) {

        try {
            this.mboDataSource.data = []
            let strArr: any[];
            if (event.value != null && event.value.length > 0) {

                strArr = AppUtility.isSplitSymbolMarketExchange(event.value);
                this.order.symbol = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
                this.order.market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
                this.order.exchange = (typeof strArr[2] === 'undefined') ? '' : strArr[2];


                this.onFetchMBOData();
                this.socket.fetchFromChannel("best_orders", { exchange: this.order.exchange, market: this.order.market, symbol: this.order.symbol });

            }
        }
        catch (error) {
        }
    }

    onFetchMBOData(): void {

        this.socket.onFetchDataFromChannel('best_orders').subscribe((data: any) => {

            let mboArrIndex = 0;
            this.mboDataArr = new Array<MBOData>();
            //this.mboData = <MBOData> data;
            let mboData = null;


            // mbo buy_orders
            if (
                data.buy_orders != null &&
                data.buy_orders !== undefined &&
                Array.isArray(data.buy_orders)
            ) {
                data.buy_orders?.forEach((element) => {
                    mboData = new MBOData();
                    mboData.buy_volume = element.volume;
                    mboData.buy_price = element.price;
                    this.mboDataArr.push(mboData);
                });
            }
            //   mbo sell_orders
            if (
                data.sell_orders != null &&
                data.sell_orders !== undefined &&
                Array.isArray(data.sell_orders)
            ) {
                let mboArrIndex = 0;
                data.sell_orders.forEach((element) => {

                    mboData = new MBOData();
                    mboData.sell_volume = element.volume;
                    mboData.sell_price = element.price;
                    if (this.mboDataArr[mboArrIndex] == null || this.mboDataArr[mboArrIndex] == undefined) {
                        this.mboDataArr[mboArrIndex] = mboData;
                    }
                    this.mboDataArr[mboArrIndex].sell_price = mboData.sell_price;
                    this.mboDataArr[mboArrIndex].sell_volume = mboData.sell_volume;
                    ++mboArrIndex;
                    // this.mboDataArr.push(mboData);
                });
            }
            this.mboDataFilter = Array.isArray(data) ? data : [data];
            this.mboDataSource.data = this.mboDataArr;
        });
    }

    onFetchMBPData(): void {
        this.socket
            .onFetchDataFromChannel('best_prices')
            .subscribe((data: any) => {
                let mbpArrIndex = 0;
                this.mbpDataArr = new Array<MBPData>();
                //this.mbpData = <MBPData> data;
                let mbpData = null;

                //mbp buy_price
                if (
                    data.buy_price != null &&
                    data.buy_price !== undefined &&
                    Array.isArray(data.buy_price)
                ) {
                    data.buy_price.forEach((element) => {
                        mbpData = new MBPData();
                        mbpData.buy_volume = element.volume;
                        mbpData.buy_price = element.price;
                        mbpData.buy_count = element.count;
                        this.mbpDataArr.push(mbpData);
                    });
                }
                //mbp sell_price
                if (
                    data.sell_price != null &&
                    data.sell_price !== undefined &&
                    Array.isArray(data.sell_price)
                ) {
                    data.sell_price.forEach((element) => {
                        mbpData = new MBPData();
                        mbpData.sell_price = data.price;
                        mbpData.sell_volume = data.volume;
                        mbpData.sell_count = data.count;
                        this.mbpDataArr[mbpArrIndex] = mbpData;
                        this.mbpDataArr[mbpArrIndex].sell_price = mbpData.price;
                        this.mbpDataArr[mbpArrIndex].sell_volume = mbpData.volume;
                        this.mbpDataArr[mbpArrIndex].sell_count = mbpData.count;
                        ++mbpArrIndex;
                    });
                }

                this.mboDataFilter = Array.isArray(data) ? data : [data];
                // console.log('MBP Data', this.mbpDataFilter);
                this.mbpDataSource.data = this.mbpDataArr;
            });
    }

    private populateSymbolExangeMarketList() {
        this.splash.show();


        this.listingSvc.getexchangeCodeSecurityExchanges().subscribe(restData => {
            this.splash.hide();
            if (!AppUtility.isValidVariable(restData))
                return;

            let data: any = restData;
            let symbols: any[] = [];
            if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
                for (let i = 0; i < data.length; i++) {
                    symbols[i] = data[i];
                    symbols[i].id = data[i].exchangeMarketSecurityId;
                    symbols[i].value = data[i].displayName_;
                }
            }
            this.symbolExangeMarketWiseList = symbols;
            this.assetClassWiseSymbolList();
        },
            error => {
                this.splash.hide();
                this.errorMsg = <any>error;
            });
    }

    public assetClassWiseSymbolList() {
         
        this.options = [];
        if (this.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES) {
            if (AppUtility.isValidVariable(this.symbolExangeMarketWiseList) && !AppUtility.isEmptyArray(this.symbolExangeMarketWiseList)) {
                for (let i = 0; i < this.symbolExangeMarketWiseList.length; i++) {
                    if (this.symbolExangeMarketWiseList[i].securityType == AppConstants.SECURITY_TYPE_EQUITIES) {

                        this.options.push(
                            AppUtility.symbolMarketExchangeComb(this.symbolExangeMarketWiseList[i].securityCode, this.symbolExangeMarketWiseList[i].marketCode, this.symbolExangeMarketWiseList[i].exchangeCode)
                        )
                    }
                }
            }
        }
        else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS) {
            if (AppUtility.isValidVariable(this.symbolExangeMarketWiseList) && !AppUtility.isEmptyArray(this.symbolExangeMarketWiseList)) {
                for (let i = 0; i < this.symbolExangeMarketWiseList.length; i++) {
                    if (this.symbolExangeMarketWiseList[i].securityType === AppConstants.SECURITY_TYPE_BONDS) {

                        this.options.push(
                            AppUtility.symbolMarketExchangeComb(this.symbolExangeMarketWiseList[i].securityCode, this.symbolExangeMarketWiseList[i].marketCode, this.symbolExangeMarketWiseList[i].exchangeCode)
                        )
                    }
                }

            }
        }
        else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_ETF) {
            if (AppUtility.isValidVariable(this.symbolExangeMarketWiseList) && !AppUtility.isEmptyArray(this.symbolExangeMarketWiseList)) {
                for (let i = 0; i < this.symbolExangeMarketWiseList.length; i++) {
                    if (this.symbolExangeMarketWiseList[i].marketCode === AppConstants.SECURITY_TYPE_ETF) {

                        this.options.push(
                            AppUtility.symbolMarketExchangeComb(this.symbolExangeMarketWiseList[i].securityCode, this.symbolExangeMarketWiseList[i].marketCode, this.symbolExangeMarketWiseList[i].exchangeCode)
                        )
                    }
                }

            }
        }
    }

    getValueInlineSearch = () => {

        if (this.myControl1.value === '') {
            if (this.selectedEquityClass == 'best_order') {

                this.mboDataFilter?.map((element) => {
                    element.searchString = element.symbol + ' ' + '(' + element.market + ')' + '-' + element.exchange;
                });
                this.mboDataFilter?.forEach((data) => {
                    if (this.highestChangedSymbol === data.searchString) {
                        let mboArrIndex = 0;
                        this.mboDataArr = new Array<MBOData>();
                        //this.mboData = <MBOData> data;
                        let mboData = null;
                        // mbo buy_orders
                        if (
                            data.buy_orders != null &&
                            data.buy_orders !== undefined &&
                            Array.isArray(data.buy_orders)
                        ) {
                            data.buy_orders.forEach((element) => {
                                mboData = new MBOData();
                                mboData.buy_volume = element.volume;
                                mboData.buy_price = element.price;
                                this.mboDataArr.push(mboData);
                            });
                        }
                        // mbo sell_orders
                        if (
                            data.sell_orders != null &&
                            data.sell_orders !== undefined &&
                            Array.isArray(data.sell_orders)
                        ) {
                            data.sell_orders.forEach((element) => {
                                mboData = new MBOData();
                                mboData.sell_volume = element.volume;
                                mboData.sell_price = element.price;
                                this.mboDataArr[mboArrIndex].sell_volume = mboData.sell_volume;
                                this.mboDataArr[mboArrIndex].sell_price = mboData.sell_price;
                                ++mboArrIndex;
                            });
                        }
                        this.mboDataSource.data = this.mboDataArr;
                    }
                });
            }

            if (this.selectedEquityClass == 'best_price') {

                this.mbpDataFilter?.map((element) => {
                    element.searchString =
                        element.symbol +
                        ' ' +
                        '(' +
                        element.market +
                        ')' +
                        '-' +
                        element.exchange;
                });

                this.mbpDataFilter.forEach((data) => {
                    if (this.highestChangedSymbol === data.searchString) {
                        let mbpArrIndex = 0;
                        this.mbpDataArr = new Array<MBPData>();
                        //this.mbpData = <MBPData> data;
                        let mbpData = null;

                        //mbp buy_price
                        if (
                            data.buy_price != null &&
                            data.buy_price !== undefined &&
                            Array.isArray(data.buy_price)
                        ) {
                            data.buy_price.forEach((element) => {
                                mbpData = new MBPData();
                                mbpData.buy_volume = element.volume;
                                mbpData.buy_price = element.price;
                                mbpData.buy_count = element.count;
                                this.mbpDataArr.push(mbpData);
                            });
                        }
                        //mbp sell_price
                        if (
                            data.sell_price != null &&
                            data.sell_price !== undefined &&
                            Array.isArray(data.sell_price)
                        ) {
                            data.sell_price.forEach((element) => {
                                mbpData = new MBPData();
                                mbpData.sell_price = data.price;
                                mbpData.sell_volume = data.volume;
                                mbpData.sell_count = data.count;
                                this.mbpDataArr[mbpArrIndex].sell_price = mbpData.sell_price;
                                this.mbpDataArr[mbpArrIndex].sell_volume = mbpData.sell_volume;
                                this.mbpDataArr[mbpArrIndex].sell_count = mbpData.sell_count;
                                ++mbpArrIndex;
                            });
                        }

                        this.mbpDataSource.data = this.mbpDataArr;
                    }
                });
            }
        }

        //When Search Symbol From Input
        if (this.myControl1.value !== '' && this.myControl1.value !== null && this.myControl1.value !== undefined) {

            this.searchSymbolValue = this.myControl1.value;
            if (this.selectedEquityClass == 'best_order') {
                this.mboDataFilter.map((element) => {
                    element.searchString =
                        element.symbol +
                        ' ' +
                        '(' +
                        element.market +
                        ')' +
                        '-' +
                        element.exchange;
                });
                this.mboDataFilter.forEach((data) => {
                    if (this.searchSymbolValue === data.searchString) {
                        let mboArrIndex = 0;
                        this.mboDataArr = new Array<MBOData>();
                        //this.mboData = <MBOData> data;
                        let mboData = null;
                        // mbo buy_orders
                        if (
                            data.buy_orders != null &&
                            data.buy_orders !== undefined &&
                            Array.isArray(data.buy_orders)
                        ) {
                            data.buy_orders.forEach((element) => {
                                mboData = new MBOData();
                                mboData.buy_volume = element.volume;
                                mboData.buy_price = element.price;
                                this.mboDataArr.push(mboData);
                            });
                        }
                        // mbo sell_orders
                        if (
                            data.sell_orders != null &&
                            data.sell_orders !== undefined &&
                            Array.isArray(data.sell_orders)
                        ) {
                            data.sell_orders.forEach((element) => {
                                mboData = new MBOData();
                                mboData.sell_volume = element.volume;
                                mboData.sell_price = element.price;
                                this.mboDataArr[mboArrIndex].sell_volume = mboData.sell_volume;
                                this.mboDataArr[mboArrIndex].sell_price = mboData.sell_price;
                                ++mboArrIndex;
                            });
                        }

                        this.mboDataSource.data = this.mboDataArr;
                    }
                });
            }

            if (this.selectedEquityClass == 'best_price') {
                this.mbpDataFilter.map((element) => {
                    element.searchString =
                        element.symbol +
                        ' ' +
                        '(' +
                        element.market +
                        ')' +
                        '-' +
                        element.exchange;
                });
                this.mbpDataFilter.forEach((data) => {
                    if (this.searchSymbolValue === data.searchString) {
                        let mbpArrIndex = 0;
                        this.mbpDataArr = new Array<MBPData>();
                        //this.mbpData = <MBPData> data;
                        let mbpData = null;

                        //mbp buy_price
                        if (
                            data.buy_price != null &&
                            data.buy_price !== undefined &&
                            Array.isArray(data.buy_price)
                        ) {
                            data.buy_price.forEach((element) => {
                                mbpData = new MBPData();
                                mbpData.buy_volume = element.volume;
                                mbpData.buy_price = element.price;
                                mbpData.buy_count = element.count;
                                this.mbpDataArr.push(mbpData);
                            });
                        }
                        //mbp sell_price
                        if (
                            data.sell_price != null &&
                            data.sell_price !== undefined &&
                            Array.isArray(data.sell_price)
                        ) {
                            data.sell_price.forEach((element) => {
                                mbpData = new MBPData();
                                mbpData.sell_price = data.price;
                                mbpData.sell_volume = data.volume;
                                mbpData.sell_count = data.count;
                                this.mbpDataArr[mbpArrIndex].sell_price = mbpData.sell_price;
                                this.mbpDataArr[mbpArrIndex].sell_volume = mbpData.sell_volume;
                                this.mbpDataArr[mbpArrIndex].sell_count = mbpData.sell_count;
                                ++mbpArrIndex;
                            });
                        }

                        this.mbpDataSource.data = this.mbpDataArr;
                    }
                });
            }
        }
    }



















}
