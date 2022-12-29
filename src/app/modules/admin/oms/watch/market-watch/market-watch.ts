
'use strict';
import { Component, EventEmitter, Inject, ViewChild, Input, AfterViewInit, NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';

// import * as IO from 'socket.io-client';

import { io } from "socket.io-client";
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { MarketWatch } from 'app/models/market-watch';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { StorageService } from 'app/services-oms/storage-oms.service';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'market-watch',
    templateUrl: './market-watch.html',

})
export class MarketWatchCmp implements AfterViewInit {
    exchanges = [];
    markets = [];
    data: any[] = [];
    marketWatch: MarketWatch;
    errorMsg: string = '';

    private _dataMaps = true;
    private _formatting = true;

    exchange: string = '';
    market: string = '';
    symbol: string = '';
    lang:any

    socket = io(environment.socketUrl) ;

    @ViewChild('flexGrid',{ static: true }) flexGrid: wjcGrid.FlexGrid;

    constructor(private appState: AppState, private listingSvc: ListingService, private dataService: DataServiceOMS,
        private orderSvc: OrderService, private authService: AuthService2,
        private storageService: StorageService,private translate: TranslateService) {
        this.marketWatch = new MarketWatch();
        this.initData(30);

        //this.authService.socket.on("connect", () => this.connect());
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

    ngAfterViewInit() {
        if (this.flexGrid) {
            this.updateDataMapSettings();
        }

        this.loadMarketWatchSymbolsFromStorage();
    }

    initData(count) {
        this.data = [];

        for (let i = 0; i < count; i++) {
            this.data[i] = new MarketWatch();
        }
    }

    loadMarketWatchSymbolsFromStorage() {
        let symbolList = this.storageService.getEquityMarketWatchSymbols();
        let strArr: any[] = [];
        let exchange, market, symbol;

        if (AppUtility.isValidVariable(symbolList)) {
            for (let i = 0; i < symbolList.length; i++) {
                let obj = this.data[i];

                strArr = symbolList[i].split(AppConstants.LABEL_SEPARATOR);

                exchange = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
                market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
                symbol = (typeof strArr[2] === 'undefined') ? '' : strArr[2];

                obj.exchangeCode = exchange;
                obj.marketCode = market;
                obj.symbol = symbol;

                //symbol subscription
                this.authService.socket.emit('symbol_sub', { 'exchange': obj.exchangeCode, 'market': obj.marketCode, 'symbol': obj.symbol });
                this.getBestMarketAndSymbolSummary(obj.exchangeCode, obj.marketCode, obj.symbol);

                if (i == 0) {
                    this.exchange = exchange;
                    this.market = market;
                    this.symbol = symbol;
                    this.dataService.setExchMktSymbol(this.exchange, this.market, this.symbol);
                }
            }
        }

    }

    getBestMarketAndSymbolSummary(exchangeCode, marketCode, securityCode) {
        this.appState.showLoader = true;
        if (AppUtility.isValidVariable(exchangeCode) && AppUtility.isValidVariable(marketCode) && AppUtility.isValidVariable(securityCode)) {
            this.orderSvc.getBestMarketAndSymbolStats(exchangeCode, marketCode, securityCode)
                .subscribe(data => {
                    this.appState.showLoader = false;
                    if (AppUtility.isValidVariable(data)) {

                        AppUtility.printConsole("Data Received: " + data);
                        this.updateBestMarketAndSymbolStats(data);

                    }
                },
                error => {
                    this.appState.showLoader = false;
                    this.errorMsg = <any>error
                });
        }
    }

    updateBestMarketAndSymbolStats(data) {
        let item: MarketWatch;
        if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
            AppUtility.printConsole("Best Market and symbol stats : " + JSON.stringify(data));
            for (var i = 0; i < this.flexGrid.collectionView.items.length; i++) {
                item = <MarketWatch>this.flexGrid.collectionView.items[i];

                if (AppUtility.isValidVariable(item.exchangeCode) && item.exchangeCode.length > 0
                    && AppUtility.isValidVariable(item.marketCode) && item.marketCode.length > 0
                    && AppUtility.isValidVariable(item.symbol) && item.symbol.length > 0) {

                    // update symbol details ( currency )
                    if (AppUtility.isValidVariable(data.symbol_summary.symbol)) {
                        item.updateSymbolDetails(data.symbol_summary.symbol);
                    }
                    // update best market
                    if (AppUtility.isValidVariable(data.best_market)) {
                        if (item.exchangeCode == data.best_market.exchange
                            && item.marketCode == data.best_market.market
                            && item.symbol.toString().toUpperCase() == data.best_market.symbol.toString().toUpperCase()) {
                            item.updateBestMarket(data.best_market);
                        }
                    }
                    // update symbol stats
                    if (AppUtility.isValidVariable(data.symbol_summary.stats)) {
                        if (item.exchangeCode == data.symbol_summary.stats.exchange
                            && item.marketCode == data.symbol_summary.stats.market
                            && item.symbol.toString().toUpperCase() == data.symbol_summary.symbol.code.toString().toUpperCase()) {
                            item.updateSymbolStats(data.symbol_summary.stats);
                        }
                    }
                }
            }
        }
    }

    updateBestMarketData(data) {
        let item: MarketWatch;
        let flag: boolean = false;
        AppUtility.printConsole("Best Market: " + JSON.stringify(data));
        if (this.flexGrid.collectionView != null && this.flexGrid.collectionView.items != null)
            for (var i = 0; i < this.flexGrid.collectionView.items.length; i++) {
                item = <MarketWatch>this.flexGrid.collectionView.items[i];

                if (item.exchangeCode == data.exchange
                    && item.marketCode == data.market
                    && item.symbol.toUpperCase() == data.symbol.toUpperCase()) {
                    item.updateBestMarket(data);
                    flag = true;
                }
            }

        if (flag == true) {
            this.flexGrid.refresh();
        }
    }

    updateSymbolStatsData(data) {

        let item: MarketWatch;
        let flag: boolean = false;
        AppUtility.printConsole("Symbol Stats::: " + JSON.stringify(data));
        if (this.flexGrid.collectionView != null && this.flexGrid.collectionView.items != null)
            for (var i = 0; i < this.flexGrid.collectionView.items.length; i++) {
                item = <MarketWatch>this.flexGrid.collectionView.items[i];

                if (item.exchangeCode == data.exchange
                    && item.marketCode == data.market
                    && item.symbol.toUpperCase() == data.symbol.toUpperCase()) {
                    item.updateSymbolStats(data);
                    flag = true;
                }
            }

        if (flag == true) {
            this.flexGrid.refresh();
        }
    }

    updateDataMapSettings() {
        this._updateDataMaps();
        this._updateFormatting();
    }

    // update data maps, formatting, paging now and when the itemsSource changes
    itemsSourceChangedHandler() {
        var flex = this.flexGrid;
        if (!flex) {
            return;
        }

        // make columns 25% wider (for readability and to show how)
        for (var i = 0; i < flex.columns.length; i++) {
            flex.columns[i].width = flex.columns[i].renderSize * 1.25;
        }

        // update data maps and formatting
        this.updateDataMapSettings();

        // No need to set page size for market watch at the moment
        // set page size on the grid's internal collectionView
        // if (flex.collectionView && this.pageSize) {
        //     (<wjcCore.IPagedCollectionView>flex.collectionView).pageSize = this.pageSize;
        // }
    };
    selectionChanged = (e) => {
        var flex = this.flexGrid;
        if (AppUtility.isValidVariable(flex.collectionView.currentItem) &&
            AppUtility.isValidVariable(flex.collectionView.currentItem.exchangeCode) &&
            AppUtility.isValidVariable(flex.collectionView.currentItem.marketCode) &&
            AppUtility.isValidVariable(flex.collectionView.currentItem.symbol)) {

            let exchange = flex.collectionView.currentItem.exchangeCode;
            let market = flex.collectionView.currentItem.marketCode;
            let symbol = flex.collectionView.currentItem.symbol.toUpperCase();

            if (this.dataService.isValidSymbol(exchange, market, symbol)) {
                this.dataService.setExchMktSymbol(exchange, market, symbol);

            }
        }
        // keep the control in edit mode
        if (flex.containsFocus()) {
            setTimeout(function () {
                flex.startEditing(false);
            }, 50);
        }
    }
    cellEditEndedHandler(e) {
        // AppUtility.printConsole("selected col: "+ e.col+", row: "+ e.row);
        // AppUtility.printConsole("Selected Exchange: " +this.flexGrid.collectionView.currentItem.exchangeId);
        // first column is exchange
        let symbol: string = '';

        if (e.col == 2) {
            this.flexGrid.collectionView.currentItem.symbol = this.flexGrid.collectionView.currentItem.symbol.toUpperCase();
            symbol = this.flexGrid.collectionView.currentItem.symbol;
            let item = <MarketWatch>this.flexGrid.collectionView.currentItem;
            item.symbol = item.symbol.toUpperCase();
            AppUtility.printConsole("Current item: " + item);
            item.clearData();
            if (this.dataService.isValidEquitySymbol(item.exchangeCode, item.marketCode, item.symbol)) {
                // call on request data
                this.getBestMarketAndSymbolSummary(item.exchangeCode, item.marketCode, item.symbol);

            } else {
                item.symbol = '';
                item.clearData();
            }
            this.flexGrid.collectionView.currentItem = item;

            this.authService.socket.emit('symbol_sub', { 'exchange': item.exchangeCode, 'market': item.marketCode, 'symbol': item.symbol });

            // refresh symbol to profile storage
            this.saveSymbolsToStorage();
        }
    }
    saveSymbolsToStorage() {

        let item: MarketWatch;
        let symbolList: any[] = [];
        let symbolStr: string = '';

        // Save dashboard market watch symbols
        for (let i = 0; i < this.flexGrid.rows.length; i++) {
            item = <MarketWatch>this.flexGrid.rows[i].dataItem;

            if (this.dataService.isValidSymbol(item.exchangeCode, item.marketCode, item.symbol)) {
                symbolStr = item.exchangeCode + AppConstants.LABEL_SEPARATOR + item.marketCode + AppConstants.LABEL_SEPARATOR + item.symbol;
                symbolList.push(symbolStr);
            }

        }
        this.storageService.saveEquityMarketWatchSymbols(symbolList);

    }
    // apply/remove data maps
    private _updateDataMaps() {
        var flex = this.flexGrid;
        if (flex) {
            var colExchange = flex.columns.getColumn('exchangeCode');
            var colMarket = flex.columns.getColumn('marketCode');

            if (colExchange && colMarket) {
                if (this.dataMaps == true) {
                    colExchange.dataMapEditor = 1; // show drop-down for countries
                    colMarket.dataMapEditor = 1; // don't show it for products

                    this.appState.showLoader = true;
                    // populate exchanges
                    this.listingSvc.getExchangeList().subscribe(
                        data => {
                            this.appState.showLoader = false;
                            if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
                                this.exchanges = data;
                                colExchange.dataMap = this._buildExchangeDataMap(data);
                            }
                        },
                        error => {this.appState.showLoader = false; this.errorMsg = <any>error});

                    this.updateDataMapMarkets();
                } else {
                    colExchange.dataMap = null;
                    colMarket.dataMap = null;

                }
            }
        }
    }

    private updateDataMapMarkets() {
        var flex = this.flexGrid;
        if (flex) {

            var colMarket = flex.columns.getColumn('marketCode');

            if (colMarket) {
                if (this.dataMaps == true) {
                    colMarket.dataMapEditor = 1; // don't show it for products
                    // populate exchange markets
                    this.appState.showLoader = true;

                    this.listingSvc.getActiveMarketList().subscribe(
                        data => {
                            this.appState.showLoader = false;
                            if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
                                this.markets = data;
                                colMarket.dataMap = this._buildMarketDataMap(data);
                            }
                        },
                        error => {this.appState.showLoader = false; this.errorMsg = <any>error});
                } else {

                    colMarket.dataMap = null;

                }
            }
        }
    }

    private _buildExchangeDataMap(items): wjcGrid.DataMap {
        var map = [];
        for (var i = 0; i < items.length; i++) {
            map.push({ key: items[i].exchangeCode, value: items[i].exchangeCode });
        }
        return new wjcGrid.DataMap(map, 'key', 'value');
    }

    private _buildMarketDataMap(items): wjcGrid.DataMap {
        var map = [];
        for (var i = 0; i < items.length; i++) {
            // show all symbols in main market watch
            if (items[i].marketType.description != AppConstants.MARKET_TYPE_BOND) {
                map.push({ key: items[i].marketCode, value: items[i].marketCode });
            }

        }
        return new wjcGrid.DataMap(map, 'key', 'value');
    }
    // apply/remove column formatting
    private _updateFormatting() {
        var flex = this.flexGrid;
        if (flex) {
            var fmt = this.formatting;
            // this._setColumnFormat('amount', fmt ? 'c' : null);
            // this._setColumnFormat('amount2', fmt ? 'c' : null);
            // this._setColumnFormat('discount', fmt ? 'p0' : null);
            // this._setColumnFormat('start', fmt ? 'MMM d yy' : null);
            // this._setColumnFormat('end', fmt ? 'HH:mm' : null);
        }
    }
    private _setColumnFormat(name, format) {
        var col = this.flexGrid.columns.getColumn(name);
        if (col) {
            col.format = format;
        }
    }

    get dataMaps(): boolean {
        return this._dataMaps;
    }
    set dataMaps(value: boolean) {
        if (this._dataMaps != value) {
            this._dataMaps = value;
            this._updateDataMaps();
        }
    }

    get formatting(): boolean {
        return this._formatting;
    }
    set formatting(value: boolean) {
        if (this._formatting != value) {
            this._formatting = value;
            this._updateFormatting();
        }
    }

    itemFormatter = (panel: wjcGrid.GridPanel, r: number, c: number, cell: HTMLElement) => {

        let value;

        if (panel.cellType == wjcGrid.CellType.Cell) {

            //AppUtility.printConsole("Value at row " + r + " , col "+ c +" value "+ JSON.stringify(panel.rows[r].dataItem["sell_volume"]));
            // buy volume
            //if ( c ==3 && Number(JSON.stringify(panel.rows[r].dataItem["sell_volume"]))>=0) {
            if (c == 3 && this.data[r].buy_volume != this.data[r].buy_volume_old) {
                this.blinkCell(cell, this.data[r].buy_volume, this.data[r].buy_volume_old);
                this.data[r].buy_volume_old = this.data[r].buy_volume;
            }
            // buy price
            if (c == 4 && Number(this.data[r].buy_price) != Number(this.data[r].buy_price_old)) {
                this.blinkCell(cell, this.data[r].buy_price, this.data[r].buy_price_old);
                this.data[r].buy_price_old = this.data[r].buy_price;
            }
            // sell price
            if (c == 5 && Number(this.data[r].sell_price) != Number(this.data[r].sell_price_old)) {
                this.blinkCell(cell, this.data[r].sell_price, this.data[r].sell_price_old);
                this.data[r].sell_price_old = this.data[r].sell_price;
            }
            // sell volume
            if (c == 6 && this.data[r].sell_volume != this.data[r].sell_volume_old) {
                this.blinkCell(cell, this.data[r].sell_volume, this.data[r].sell_volume_old);
                this.data[r].sell_volume_old = this.data[r].sell_volume;
            }
        }
    }

    blinkCell(cell: HTMLElement, newVal, oldVal) {
        let timer;
        let backgroundColor = cell.style.background;
        if (newVal > oldVal) {
            //cell.style.background='#0x94DE96';
            cell.style.background = 'yellow';
        } else if (newVal < oldVal) {
            cell.style.background = 'red';
        }
        timer = setTimeout(function () { cell.style.background = backgroundColor; }, 500);
    }


}
