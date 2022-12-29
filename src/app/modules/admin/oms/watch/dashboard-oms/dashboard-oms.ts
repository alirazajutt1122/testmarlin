import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import * as wijmo from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import {DomSanitizer} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import { MarketWatch } from 'app/models/market-watch';
import { UsersOmsReports } from 'app/models/users-oms-reports';
import { Trade } from 'app/models/trade';

import { AppConstants, AppUtility } from 'app/app.utility';
// import * as jQuery from 'jquery';
declare var jQuery: any;
import * as io from 'socket.io-client';

import { ListingService } from 'app/services-oms/listing-oms.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';

import { StorageService } from 'app/services-oms/storage-oms.service';

import { AuthService2 } from 'app/services/auth2.service';
import { ComboItem } from 'app/models/combo-item';
import { BestOrderPriceCombine } from 'app/models/best-order-price-combine';
import { OrderTypes } from 'app/models/order-types';
import { SecurityTradeChartComponent } from '../../charts/security-trade-chart/security-trade-chart';
import { OrderChange } from '../../order/order-change/order-change';
import { OrderCancel } from '../../order/order-cancel/order-cancel';
import { BondOrderChange } from '../../order/bond-order-change/bond-order-change';
import { BondOrderCancel } from '../../order/bond-order-cancel/bond-order-cancel';
import { TranslateService } from '@ngx-translate/core';
import { OrderNew } from '../order-new/order-new';
import { BondOrderNewWatch } from '../bond-order-new/bond-order-new';



@Component({
    selector: 'dashboard-oms',
    templateUrl: './dashboard-oms.html',
    styleUrls: ['./dashboard-oms.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class DashboardOmsComponent implements OnInit, OnDestroy, AfterViewInit {
    exchanges = [];
    markets = [];
    selectedMarket: any[];
    dataMWEquity: any[] = []; // market watch
    dataMWBond: any[] = []; // market watch
    dataWO: any[] = []; // working orders
    dataEL: any[] = [];
    dataEL_temp: any[] = [];
    dataTR: any[] = []; // trades
    dataMBO: any[] = [];
    dataMBP: any[] = [];
    dataIndices: any[] = [];

    marketWatch: MarketWatch;
    errorMsg: string = '';

    marketWatchMax: number = 30;
    marketWatchCurrentRowIndex: number = -1;

    exchange: string = '';
    market: string = '';
    symbol: string = '';

    chartSymbol: string = '';
    indicesExchange: string = '';
    mboMbpSymbol: string = '';

    symbolSubscribeArr: any[] = [];
    selectedOrder: any = null;

    usersOmsReports: UsersOmsReports;
    _dataMaps = true;
    _formatting = true;

    trade: Trade = new Trade();
    symbolMarketExchange: string = '';
    symbolExangeMarketList: any[];
    symbolExangeMarketWiseList: any[];
    errorMessage: string = '';

    isBond: Boolean = false;
    lang:any

    eoFilterColumns = ['exchange', 'market',  'symbol', 'ticket_no', 'order_no', 'custodian', 'account', 'volume', 'type', 'price', 'trigger_price'];
    woFilterColumns = ['exchange', 'market', 'symbol', 'order_no', 'account', 'custodian', 'price', 'volume', 'type', 'state_time', 'trigger_price'];
    elFilterColumns = ['exchange', 'market', 'symbol', 'ticket_no', 'order_no', 'broker', 'price', 'account',
      'volume', 'type', 'custodian', 'order_state', 'filled_volume', 'remaining_volume' , 'state_time' , 'execution_time'];

    @ViewChild('orderNew',{ static: false }) orderNew: OrderNew;
    @ViewChild('orderChange',{ static: false }) orderChange: OrderChange;
    @ViewChild('orderCancel',{ static: false }) orderCancel: OrderCancel;
    @ViewChild('bondOrderChange',{ static: false }) bondOrderChange: BondOrderChange;
    @ViewChild('bondOrderCancel',{ static: false }) bondOrderCancel: BondOrderCancel;
    @ViewChild('bondOrderNewWatch',{ static: false }) bondOrderNewWatch: BondOrderNewWatch;
    @ViewChild('flexGridMWEquity',{ static: true }) flexGridMWEquity: wjcGrid.FlexGrid;
    @ViewChild('flexGridMWBond',{ static: true }) flexGridMWBond: wjcGrid.FlexGrid;
    @ViewChild('flexGridMBO',{ static: false }) flexGridMBO: wjcGrid.FlexGrid;
    @ViewChild('flexGridMBP',{ static: false }) flexGridMBP: wjcGrid.FlexGrid;

    @ViewChild('flexGridT',{ static: false }) flexGridT: wjcGrid.FlexGrid;
    @ViewChild('flexGridWO',{ static: false }) flexGridWO: wjcGrid.FlexGrid;
    @ViewChild('flexGridEL',{ static: false }) flexGridEL: wjcGrid.FlexGrid;

    @ViewChild('flexGridIndices',{ static: false }) flexGridIndices: wjcGrid.FlexGrid;
    @ViewChild('symbolCombo',{ static: false }) symbolCombo: wjcInput.ComboBox;
    @ViewChild('chart',{ static: false }) chart: SecurityTradeChartComponent;

    itemFormatter = (panel: wjcGrid.GridPanel, r: number, c: number, cell: HTMLElement) => {
      let value;

      if (panel.cellType === wjcGrid.CellType.Cell) {
        // AppUtility.printConsole("Value at row " + r + " , col "+ c +" value "+ JSON.stringify(panel.rows[r].dataItem["sell_volume"]));
        // buy volume
        // if ( c ==3 && Number(JSON.stringify(panel.rows[r].dataItem["sell_volume"]))>=0) {
        if (c === 3 && this.dataMWEquity[r].buy_volume !== this.dataMWEquity[r].buy_volume_old) {
          this.blinkCell(cell, this.dataMWEquity[r].buy_volume, this.dataMWEquity[r].buy_volume_old);
          this.dataMWEquity[r].buy_volume_old = this.dataMWEquity[r].buy_volume;
        }

        // buy price
        if (c === 4 && Number(this.dataMWEquity[r].buy_price) !== Number(this.dataMWEquity[r].buy_price_old)) {
          this.blinkCell(cell, this.dataMWEquity[r].buy_price, this.dataMWEquity[r].buy_price_old);
          this.dataMWEquity[r].buy_price_old = this.dataMWEquity[r].buy_price;
        }

        // sell price
        if (c === 5 && Number(this.dataMWEquity[r].sell_price) !== Number(this.dataMWEquity[r].sell_price_old)) {
          this.blinkCell(cell, this.dataMWEquity[r].sell_price, this.dataMWEquity[r].sell_price_old);
          this.dataMWEquity[r].sell_price_old = this.dataMWEquity[r].sell_price;
        }

        // sell volume
        if (c === 6 && this.dataMWEquity[r].sell_volume !== this.dataMWEquity[r].sell_volume_old) {
          this.blinkCell(cell, this.dataMWEquity[r].sell_volume, this.dataMWEquity[r].sell_volume_old);
          this.dataMWEquity[r].sell_volume_old = this.dataMWEquity[r].sell_volume;
        }
      }
    }

    itemFormatterBond = (panel: wjcGrid.GridPanel, r: number, c: number, cell: HTMLElement) => {
      let value;

      if (panel.cellType === wjcGrid.CellType.Cell) {
        // AppUtility.printConsole("Value at row " + r + " , col "+ c +" value "+ JSON.stringify(panel.rows[r].dataItem["sell_volume"]));
        // buy volume
        // if ( c ==3 && Number(JSON.stringify(panel.rows[r].dataItem["sell_volume"]))>=0) {
        if (c === 3 && this.dataMWBond[r].buy_volume !== this.dataMWBond[r].buy_volume_old) {
          this.blinkCell(cell, this.dataMWBond[r].buy_volume, this.dataMWBond[r].buy_volume_old);
          this.dataMWBond[r].buy_volume_old = this.dataMWBond[r].buy_volume;
        }

        // buy price
        if (c === 4 && Number(this.dataMWBond[r].buy_price) !== Number(this.dataMWBond[r].buy_price_old)) {
          this.blinkCell(cell, this.dataMWBond[r].buy_price, this.dataMWBond[r].buy_price_old);
          this.dataMWBond[r].buy_price_old = this.dataMWBond[r].buy_price;
        }

        // sell price
        if (c === 6 && Number(this.dataMWBond[r].sell_price) !== Number(this.dataMWBond[r].sell_price_old)) {
          this.blinkCell(cell, this.dataMWBond[r].sell_price, this.dataMWBond[r].sell_price_old);
          this.dataMWBond[r].sell_price_old = this.dataMWBond[r].sell_price;
        }

        // sell volume
        if (c === 8 && this.dataMWBond[r].sell_volume !== this.dataMWBond[r].sell_volume_old) {
          this.blinkCell(cell, this.dataMWBond[r].sell_volume, this.dataMWBond[r].sell_volume_old);
          this.dataMWBond[r].sell_volume_old = this.dataMWBond[r].sell_volume;
        }
      }
    }

    // --------------------------------------------------------------------

    constructor(private listingSvc: ListingService, private dataService: DataServiceOMS,
      private orderSvc: OrderService, public authService: AuthService2,
      private storageService: StorageService,private translate: TranslateService, private cdRef: ChangeDetectorRef) {


      this.marketWatch = new MarketWatch();
      this.usersOmsReports = new UsersOmsReports();

      this.dataService.getExchangeMarketSecurities();
      this.initMarketWatch(this.marketWatchMax);
      this.symbolMarketExchange = '';
      this.isBond = false;


      // for reports refresh
      this.authService.socket.on('order_confirmation', (orderConfirmation) => { this.onOrderConfirmation(orderConfirmation); });
      this.authService.socket.on('best_market', (bestMarket) => { this.onBestMarket(bestMarket); });
      this.authService.socket.on('symbol_stat', (symbolStat) => { this.onSymbolStats(symbolStat); });
      this.authService.socket.on('best_orders', (bestOrders) => { this.onBestOrders(bestOrders); });
      this.authService.socket.on('best_prices', (bestPrices) => { this.onBestPrices(bestPrices); });
          //_______________________________for ngx_translate_________________________________________

          this.lang=localStorage.getItem("lang");
          if(this.lang==null){ this.lang='en'}
          this.translate.use(this.lang)
          //______________________________for ngx_translate__________________________________________
    }

    // slim scroll code starts here
    // --------------------------------------------------------------------

    ngOnInit(): void {
      this.populateSymbolExangeMarketList(AppConstants.participantId);

      // animated order
    }

    // --------------------------------------------------------------------

    ngOnDestroy(): void {
      // alert('OnDestroy');
    }

    // --------------------------------------------------------------------

    ngAfterViewInit() {
      var self = this;
      jQuery('#chart-widget').widgster()
        .on('fullscreened.widgster', () => {
          this.chart.invalidate();

          // this.chart.showPeriodSelector = true;
          // this.chart.showChartType = true;
          this.chart.priceChartHeight = '240';
          this.chart.volumeChartHeight = '160';
          this.chart.showRangeSelector = true;
        }).on('restored.widgster', () => {
          this.chart.invalidate();

          // this.chart.showPeriodSelector = false;
          // this.chart.showChartType = false;
          this.chart.priceChartHeight = '120';
          this.chart.volumeChartHeight = '80';
          this.chart.showRangeSelector = false;
        });

      jQuery('.order_box').click(function () {
        if (!self.isBond)
          jQuery('.order_body').toggleClass('nav-view');
        else
          jQuery('.order_body_bond').toggleClass('nav-view');
      });

      jQuery('.parsleyjs').parsley();
    //   jQuery('.select2').select2();


      // jQuery('.grid div div:nth-child(2)').addClass("slim_scroll");

      // jQuery('.slim_scroll').slimScroll({
      //     height: '100%',
      //     width: '100%',
      //     wheelStep: 20,
      //     touchScrollStep: 50,
      //     alwaysVisible: true,
      //     allowPageScroll: false,
      //     railVisible: false,
      //     size: '7px',
      //     opacity: 1,
      //     axis: 'both'
      // });

      jQuery('#add_new').on('shown.bs.modal', function () { jQuery('.btn-success').focus(); });
      jQuery('.nav-tabs').on('shown.bs.tab', 'a', (e) => {
        if (e.relatedTarget) {
          jQuery(e.relatedTarget).removeClass('active');
        }
      });

      // change order jquery
      jQuery('.editOrder_btn').click(function () {
        let marketTypeCode = self.dataService.getMarketType(self.selectedOrder.exchange,
          self.selectedOrder.market,
          self.selectedOrder.symbol);
        if (marketTypeCode !== AppConstants.MARKET_TYPE_BOND) {
          jQuery('#editEquity_dialogBox').removeClass('modal fade').addClass('edit_dialog');
          jQuery('#editEquity_dialogBox').show();
          jQuery('#editEquity_dialogBox').addClass('nav-view');
          jQuery('.modal-header button').addClass('edit_dialog_close');
        }
        else {
          jQuery('#editBond_dialogBox').removeClass('modal fade').addClass('editBond_dialog');
          jQuery('#editBond_dialogBox').show();
          jQuery('#editBond_dialogBox').addClass('nav-view');
          jQuery('.modal-header button').addClass('edit_dialog_close');
        }

      });

      jQuery('.edit_dialog_close').click(function () {
        let marketTypeCode = self.dataService.getMarketType(self.selectedOrder.exchange,
          self.selectedOrder.market,
          self.selectedOrder.symbol);
        if (marketTypeCode !== AppConstants.MARKET_TYPE_BOND) {
          jQuery('#editEquity_dialogBox').removeClass('nav-view');

          jQuery('#editEquity_dialogBox').delay(500).queue(function () {
            jQuery('#editEquity_dialogBox').removeClass('edit_dialog');
            jQuery('#editEquity_dialogBox').addClass('modal fade');
            jQuery(this).dequeue();
          });
        }
        else {
          jQuery('#editBond_dialogBox').removeClass('nav-view');

          jQuery('#editBond_dialogBox').delay(500).queue(function () {
            jQuery('#editBond_dialogBox').removeClass('editBond_dialog');
            jQuery('#editBond_dialogBox').addClass('modal fade');
            jQuery(this).dequeue();
          });
        }
      });

      // cancel order jquery
      jQuery('.cancelOrder_btn').click(function () {
        let marketTypeCode = self.dataService.getMarketType(self.selectedOrder.exchange,
          self.selectedOrder.market,
          self.selectedOrder.symbol);
        if (marketTypeCode !== AppConstants.MARKET_TYPE_BOND) {
          jQuery('#cancelEquity_dialogBox').removeClass('modal fade').addClass('edit_dialog');
          jQuery('#cancelEquity_dialogBox').show();
          jQuery('#cancelEquity_dialogBox').addClass('nav-view');
          jQuery('.modal-header button').addClass('cancel_dialogBox');
        }
        else {
          jQuery('#cancelBond_dialogBox').removeClass('modal fade').addClass('edit_dialog');
          jQuery('#cancelBond_dialogBox').show();
          jQuery('#cancelBond_dialogBox').addClass('nav-view');
          jQuery('.modal-header button').addClass('cancel_dialogBox');
        }
      });

      jQuery('.cancel_dialog_close').click(function () {
        let marketTypeCode = self.dataService.getMarketType(self.selectedOrder.exchange,
          self.selectedOrder.market,
          self.selectedOrder.symbol);
        if (marketTypeCode !== AppConstants.MARKET_TYPE_BOND) {
          jQuery('#cancelEquity_dialogBox').removeClass('nav-view');

          jQuery('#cancelEquity_dialogBox').delay(500).queue(function () {
            jQuery('#cancelEquity_dialogBox').removeClass('edit_dialog');
            jQuery('#cancelEquity_dialogBox').addClass('modal fade');
            jQuery(this).dequeue();
          });
        }
        else {
          jQuery('#cancelBond_dialogBox').removeClass('nav-view');

          jQuery('#cancelBond_dialogBox').delay(500).queue(function () {
            jQuery('#cancelBond_dialogBox').removeClass('edit_dialog');
            jQuery('#cancelBond_dialogBox').addClass('modal fade');
            jQuery(this).dequeue();
          });
        }
      });


      if (this.flexGridMWEquity) {
        this.updateDataMapSettings('Equity');
      }

      if (this.flexGridMWBond) {
        this.updateDataMapSettings('Bond');
      }

      this.loadMarketWatchEquitySymbolsFromStorage();
      this.loadMarketWatchBondSymbolsFromStorage();

      this.flexGridMBO.refresh();
      this.mboClicked();
      this.refreshPublicDataWidgets();

      // load working orders and trades for current logged in user
      this.updateReportsData();
    }

    // --------------------------------------------------------------------

    loadMarketWatchEquitySymbolsFromStorage() {
      let symbolList = this.storageService.getDasbhoardMarketWatchSymbols();
      let strArr: any[] = [];
      let exchange, market, symbol;

      if (AppUtility.isValidVariable(symbolList)) {
        for (let i = 0; i < symbolList.length; i++) {
          let obj = this.dataMWEquity[i];

          strArr = symbolList[i].split(AppConstants.LABEL_SEPARATOR);

          exchange = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
          market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
          symbol = (typeof strArr[2] === 'undefined') ? '' : strArr[2];

          let marketTypeCode = this.dataService.getMarketType(exchange, market, symbol);
          if (marketTypeCode != AppConstants.MARKET_TYPE_BOND) {
            obj.exchangeCode = exchange;
            obj.marketCode = market;
            obj.symbol = symbol;

            // symbol subscription
            this.authService.socket.emit('symbol_sub', { 'exchange': obj.exchangeCode, 'market': obj.marketCode, 'symbol': obj.symbol });
            this.getBestMarketAndSymbolSummary(obj.exchangeCode, obj.marketCode, obj.symbol);

            if (i === 0) {
              this.exchange = exchange;
              this.market = market;
              this.symbol = symbol;
              this.dataService.setExchMktSymbol(this.exchange, this.market, this.symbol);
            }
          }
        }
      }
    }

    loadMarketWatchBondSymbolsFromStorage() {
      let symbolList = this.storageService.getDasbhoardMarketWatchSymbols();
      let strArr: any[] = [];
      let exchange, market, symbol;

      if (AppUtility.isValidVariable(symbolList)) {
        for (let i = 0; i < symbolList.length; i++) {
          let obj = this.dataMWBond[i];

          strArr = symbolList[i].split(AppConstants.LABEL_SEPARATOR);

          exchange = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
          market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
          symbol = (typeof strArr[2] === 'undefined') ? '' : strArr[2];

          let marketTypeCode = this.dataService.getMarketType(exchange, market, symbol);
          if (marketTypeCode === AppConstants.MARKET_TYPE_BOND) {
            obj.exchangeCode = exchange;
            obj.marketCode = market;
            obj.symbol = symbol;

            // symbol subscription
            this.authService.socket.emit('symbol_sub', { 'exchange': obj.exchangeCode, 'market': obj.marketCode, 'symbol': obj.symbol });
            this.getBestMarketAndSymbolSummary(obj.exchangeCode, obj.marketCode, obj.symbol);

            if (i === 0) {
              this.exchange = exchange;
              this.market = market;
              this.symbol = symbol;
              this.dataService.setExchMktSymbol(this.exchange, this.market, this.symbol);
            }
          }
        }
      }
    }

    // --------------------------------------------------------------------

    updateDataMapSettings(marketType) {
      this._updateDataMaps(marketType);
      this._updateFormatting();
    }

    ////////////////////////////////////////////////////////////////////
    /////////////  Market Watch ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // --------------------------------------------------------------------

    initMarketWatch(count) {
      this.dataMWEquity = [];
      this.dataMWBond = [];
      for (let i = 0; i < count; i++) {
        this.dataMWEquity[i] = new MarketWatch();
        this.dataMWBond[i] = new MarketWatch();
      }
    }

    // --------------------------------------------------------------------

    equityClicked() {
      this.isBond = false;
      this.flexGridMWEquity.invalidate();
    }
    // ------------------------------bond market watch--------------------------------------------------
    bondClicked() {
      this.isBond = true;
      this.flexGridMWBond.invalidate();
    }
    // -------------------------------------------------------------------------------------------------

    getBestMarketAndSymbolSummary(exchangeCode, marketCode, securityCode) {
      if (AppUtility.isValidVariable(exchangeCode) &&
        AppUtility.isValidVariable(marketCode) &&
        AppUtility.isValidVariable(securityCode)) {
        this.orderSvc.getBestMarketAndSymbolStats(exchangeCode, marketCode, securityCode)
          .subscribe(data => {
            if (AppUtility.isValidVariable(data)) {
              let marketTypeCode = this.dataService.getMarketType(exchangeCode, marketCode, securityCode);
              if (marketTypeCode === AppConstants.MARKET_TYPE_BOND) {
                this.updateBestMarketAndSymbolStatsBond(data);
              }
              else {
                this.updateBestMarketAndSymbolStatsEquity(data);
              }
            }
          },
            error => this.errorMsg = <any>error);
      }
    }

    // --------------------------------------------------------------------

    updateBestMarketAndSymbolStatsEquity(data) {
      let item: MarketWatch;
      if (AppUtility.isValidVariable(data) &&
        !AppUtility.isEmpty(data) &&
        AppUtility.isValidVariable(this.flexGridMWEquity.collectionView)) {
        for (let i = 0; i < this.flexGridMWEquity.collectionView.items.length; i++) {
          item = <MarketWatch>this.flexGridMWEquity.collectionView.items[i];

          if (AppUtility.isValidVariable(item.exchangeCode) && item.exchangeCode.length > 0
            && AppUtility.isValidVariable(item.marketCode) && item.marketCode.length > 0
            && AppUtility.isValidVariable(item.symbol) && item.symbol.length > 0) {
            // update symbol details ( currency )
            if (AppUtility.isValidVariable(data.symbol_summary.symbol)) {
              item.updateSymbolDetails(data.symbol_summary.symbol);
            }

            // update best market
            if (AppUtility.isValidVariable(data.best_market)) {
              if (item.exchangeCode === data.best_market.exchange
                && item.marketCode === data.best_market.market
                && item.symbol.toString().toUpperCase() === data.best_market.symbol.toString().toUpperCase()) {
                item.updateBestMarket(data.best_market);
              }
            }

            // update symbol stats
            if (AppUtility.isValidVariable(data.symbol_summary.stats)) {
              if (item.exchangeCode === data.symbol_summary.stats.exchange
                && item.marketCode === data.symbol_summary.stats.market
                && item.symbol.toString().toUpperCase() === data.symbol_summary.symbol.code.toString().toUpperCase()) {
                item.updateSymbolStats(data.symbol_summary.stats);
              }
            }
          }
        }
      }
    }

    updateBestMarketAndSymbolStatsBond(data) {
      let item: MarketWatch;
      if (AppUtility.isValidVariable(data) &&
        !AppUtility.isEmpty(data) &&
        AppUtility.isValidVariable(this.flexGridMWBond.collectionView)) {
        for (let i = 0; i < this.flexGridMWBond.collectionView.items.length; i++) {
          item = <MarketWatch>this.flexGridMWBond.collectionView.items[i];

          if (AppUtility.isValidVariable(item.exchangeCode) && item.exchangeCode.length > 0
            && AppUtility.isValidVariable(item.marketCode) && item.marketCode.length > 0
            && AppUtility.isValidVariable(item.symbol) && item.symbol.length > 0) {
            // update symbol details ( currency )
            if (AppUtility.isValidVariable(data.symbol_summary.symbol)) {
              item.updateSymbolDetails(data.symbol_summary.symbol);
            }

            // update best market
            if (AppUtility.isValidVariable(data.best_market)) {
              if (item.exchangeCode === data.best_market.exchange
                && item.marketCode === data.best_market.market
                && item.symbol.toString().toUpperCase() === data.best_market.symbol.toString().toUpperCase()) {
                item.updateBestMarket(data.best_market);
              }
            }

            // update symbol stats
            if (AppUtility.isValidVariable(data.symbol_summary.stats)) {
              if (item.exchangeCode === data.symbol_summary.stats.exchange
                && item.marketCode === data.symbol_summary.stats.market
                && item.symbol.toString().toUpperCase() === data.symbol_summary.symbol.code.toString().toUpperCase()) {
                item.updateSymbolStats(data.symbol_summary.stats);
              }
            }
          }
        }
      }
    }

    // --------------------------------------------------------------------

    onBestOrders(resData) {
      if (resData.symbol.toLowerCase() === this.symbol.toLowerCase()) {
        let combineData: any[] = [];

        let loopcounter = 0;
        if (resData.buy_orders.length > resData.sell_orders.length)
          loopcounter = resData.buy_orders.length;
        else
          loopcounter = resData.sell_orders.length;

        for (let k = 0; k < loopcounter; k++) {
          let oBOPCombine = new BestOrderPriceCombine();

          if (k < resData.buy_orders.length) {
            oBOPCombine.order_no_buy = resData.buy_orders[k].order_no;
            oBOPCombine.volume_buy = resData.buy_orders[k].volume;
            oBOPCombine.price_buy = resData.buy_orders[k].price;
            oBOPCombine.yield_buy = resData.buy_orders[k].yield;
            oBOPCombine.mine_buy = this.isMyOrder(oBOPCombine.order_no_buy);
          }

          if (k < resData.sell_orders.length) {
            oBOPCombine.order_no_sell = resData.sell_orders[k].order_no;
            oBOPCombine.volume_sell = resData.sell_orders[k].volume;
            oBOPCombine.price_sell = resData.sell_orders[k].price;
            oBOPCombine.yield_sell = resData.sell_orders[k].yield;
            oBOPCombine.mine_sell = this.isMyOrder(oBOPCombine.order_no_sell);
          }

          combineData[k] = oBOPCombine;
        }

        this.dataMBO = combineData;
      }
    }

    // --------------------------------------------------------------------

    onBestPrices(resData) {
      if (resData.symbol.toLowerCase() === this.symbol.toLowerCase()) {
        let combineData: any[] = [];

        let loopcounter = 0;
        if (resData.buy_prices.length > resData.sell_prices.length)
          loopcounter = resData.buy_prices.length;
        else
          loopcounter = resData.sell_prices.length;

        for (let k = 0; k < loopcounter; k++) {
          let oBOPCombine = new BestOrderPriceCombine();

          if (k < resData.buy_prices.length) {
            oBOPCombine.count_buy = resData.buy_prices[k].count;
            oBOPCombine.volume_buy = resData.buy_prices[k].volume;
            oBOPCombine.price_buy = resData.buy_prices[k].price;
            oBOPCombine.yield_buy = resData.buy_prices[k].yield;
          }

          if (k < resData.sell_prices.length) {
            oBOPCombine.count_sell = resData.sell_prices[k].count;
            oBOPCombine.volume_sell = resData.sell_prices[k].volume;
            oBOPCombine.price_sell = resData.sell_prices[k].price;
            oBOPCombine.yield_sell = resData.sell_prices[k].yield;
          }

          combineData[k] = oBOPCombine;
        }

        this.dataMBP = combineData;
      }
    }

    // --------------------------------------------------------------------

    mboClicked() {
      this.flexGridMBO.invalidate();
    }

    // --------------------------------------------------------------------

    mbpClicked() {
      this.flexGridMBP.invalidate();
    }

    // --------------------------------------------------------------------

    indicesClicked() {
      this.flexGridIndices.invalidate();
    }

    // --------------------------------------------------------------------

    onOrderConfirmation(data) {
      if (!AppUtility.isValidVariable(data))
        return;

      // 02-Nov-2022, Muhammad Hassan
      // Commented to avoid extra calls to backend 

      // if (data.state === 'trade' || data.state === 'submitted' || data.state === 'changed' ||
      //   data.state === 'cancelled') {
      //   this.getWorkingOrders();
      //   this.getEventLog();
      // }

      // if (data.state === 'trade') {
      //   this.getExecutedOrders();
      // }
    }

    // --------------------------------------------------------------------

    updateReportsData() {
      this.getWorkingOrders();
      this.getExecutedOrders();
      this.getEventLog();
    }

    // --------------------------------------------------------------------

    onBestMarket(data) {
      let equityFlag: boolean = false;
      let bondFlag: boolean = false;

      if (this.flexGridMWEquity.collectionView != null && this.flexGridMWEquity.collectionView.items != null)
        for (let i = 0; i < this.flexGridMWEquity.collectionView.items.length; i++) {
          let item = <MarketWatch>this.flexGridMWEquity.collectionView.items[i];

          if (item.exchangeCode === data.exchange
            && item.marketCode === data.market
            && item.symbol.toUpperCase() === data.symbol.toUpperCase()) {
            item.updateBestMarket(data);
            equityFlag = true;
          }
        }

      if (equityFlag === true) {
        this.flexGridMWEquity.invalidate();
      }

      if (this.flexGridMWBond.collectionView != null && this.flexGridMWBond.collectionView.items != null)
        for (let i = 0; i < this.flexGridMWBond.collectionView.items.length; i++) {
          let item = <MarketWatch>this.flexGridMWBond.collectionView.items[i];

          if (item.exchangeCode === data.exchange
            && item.marketCode === data.market
            && item.symbol.toUpperCase() === data.symbol.toUpperCase()) {
            item.updateBestMarket(data);
            bondFlag = true;
          }
        }

      if (bondFlag === true) {
        this.flexGridMWBond.invalidate();
      }
    }

    // --------------------------------------------------------------------

    onSymbolStats(data) {
      let equityFlag: boolean = false;
      let bondFlag: boolean = false;

      if (this.flexGridMWEquity.collectionView != null && this.flexGridMWEquity.collectionView.items != null)
        for (let i = 0; i < this.flexGridMWEquity.collectionView.items.length; i++) {
          let item = <MarketWatch>this.flexGridMWEquity.collectionView.items[i];

          if (item.exchangeCode === data.exchange
            && item.marketCode === data.market
            && item.symbol.toUpperCase() === data.symbol.toUpperCase()) {
            item.updateSymbolStats(data);
            equityFlag = true;
          }
        }

      if (equityFlag === true) {
        this.flexGridMWEquity.invalidate();
      }

      if (this.flexGridMWBond.collectionView != null && this.flexGridMWBond.collectionView.items != null)
        for (let i = 0; i < this.flexGridMWBond.collectionView.items.length; i++) {
          let item = <MarketWatch>this.flexGridMWBond.collectionView.items[i];

          if (item.exchangeCode === data.exchange
            && item.marketCode === data.market
            && item.symbol.toUpperCase() === data.symbol.toUpperCase()) {
            item.updateSymbolStats(data);
            bondFlag = true;
          }
        }

      if (bondFlag === true) {
        this.flexGridMWBond.invalidate();
      }
    }

    // --------------------------------------------------------------------

    itemsSourceChangedHandler(marketType) {
      let flex;
      if (marketType == 'Equity')
        flex = this.flexGridMWEquity;
      else
        flex = this.flexGridMWBond;

      if (!flex) {
        return;
      }

      // make columns 25% wider (for readability and to show how)
      for (let i = 0; i < flex.columns.length; i++) {
        flex.columns[i].width = flex.columns[i].renderSize * 1.25;
      }

      // update data maps and formatting
      this.updateDataMapSettings(marketType);

      // No need to set page size for market watch at the moment
      // set page size on the grid's internal collectionView
      // if (flex.collectionView && this.pageSize) {
      //     (<wjcCore.IPagedCollectionView>flex.collectionView).pageSize = this.pageSize;
      // }
    }

    // --------------------------------------------------------------------

    selectionChangedMWEquity(e) {
      if (AppUtility.isValidVariable(this.flexGridMWEquity.collectionView.currentItem) &&
        AppUtility.isValidVariable(this.flexGridMWEquity.collectionView.currentItem.exchangeCode) &&
        AppUtility.isValidVariable(this.flexGridMWEquity.collectionView.currentItem.marketCode) &&
        AppUtility.isValidVariable(this.flexGridMWEquity.collectionView.currentItem.symbol)) {
        this.exchange = this.flexGridMWEquity.collectionView.currentItem.exchangeCode;
        this.market = this.flexGridMWEquity.collectionView.currentItem.marketCode;
        this.symbol = this.flexGridMWEquity.collectionView.currentItem.symbol.toUpperCase();

        if (this.dataService.isValidSymbol(this.exchange, this.market, this.symbol)) {
          this.dataService.setExchMktSymbol(this.exchange, this.market, this.symbol);
          this.refreshPublicDataWidgets();
        }
      }

      let flex = this.flexGridMWEquity;

      // keep the control in edit mode
      if (flex.containsFocus()) {
        setTimeout(function () {
          flex.startEditing(false);
        }, 50);
      }
    }

    selectionChangedMWBond(e) {
      if (AppUtility.isValidVariable(this.flexGridMWBond.collectionView.currentItem) &&
        AppUtility.isValidVariable(this.flexGridMWBond.collectionView.currentItem.exchangeCode) &&
        AppUtility.isValidVariable(this.flexGridMWBond.collectionView.currentItem.marketCode) &&
        AppUtility.isValidVariable(this.flexGridMWBond.collectionView.currentItem.symbol)) {
        this.exchange = this.flexGridMWBond.collectionView.currentItem.exchangeCode;
        this.market = this.flexGridMWBond.collectionView.currentItem.marketCode;
        this.symbol = this.flexGridMWBond.collectionView.currentItem.symbol.toUpperCase();

        if (this.dataService.isValidSymbol(this.exchange, this.market, this.symbol)) {
          this.dataService.setExchMktSymbol(this.exchange, this.market, this.symbol);
          this.refreshPublicDataWidgets();
        }
      }

      let flex = this.flexGridMWBond;

      // keep the control in edit mode
      if (flex.containsFocus()) {
        setTimeout(function () {
          flex.startEditing(false);
        }, 50);
      }
    }

    // --------------------------------------------------------------------

    refreshPublicDataWidgets() {
      if (this.symbol !== this.chartSymbol) {
        this.chartSymbol = this.symbol;
        this.cdRef.detectChanges();

        this.refreshChart();
      }

      if (this.symbol !== this.mboMbpSymbol) {
        this.mboMbpSymbol = this.symbol;
        this.refreshMBOMBP();
      }

      if (this.exchange !== this.indicesExchange) {
        this.refreshIndices();
      }
    }

    // --------------------------------------------------------------------

    cellEditEndedHandlerEquity(e) {
      // first column is exchange
      let validSymbol: boolean = false;

      if (e.col === 2) {
        this.flexGridMWEquity.collectionView.currentItem.symbol = this.flexGridMWEquity.collectionView.currentItem.symbol.toUpperCase();
        this.exchange = this.flexGridMWEquity.collectionView.currentItem.exchangeCode;
        this.market = this.flexGridMWEquity.collectionView.currentItem.marketCode;
        this.symbol = this.flexGridMWEquity.collectionView.currentItem.symbol.toUpperCase();

        let item = <MarketWatch>this.flexGridMWEquity.collectionView.currentItem;

        let currency = item.currency;

        if (this.dataService.isValidSymbol(item.exchangeCode, item.marketCode, item.symbol)) {
          validSymbol = true;
          item.symbol = item.symbol.toUpperCase();
          this.getBestMarketAndSymbolSummary(item.exchangeCode, item.marketCode, item.symbol);
          this.refreshPublicDataWidgets();

          if (this.flexGridMWEquity.selection.row > this.marketWatchCurrentRowIndex) {
            this.marketWatchCurrentRowIndex = this.flexGridMWEquity.selection.row;
          }
        }
        else {
          item.symbol = '';
          item.clearData();
        }

        if (validSymbol) {
          this.flexGridMWEquity.collectionView.currentItem = item;
          this.dataService.setExchMktSymbol(this.exchange, this.market, this.symbol);

          if (!this.dataService.isSymbolSubscribed(this.exchange, this.market, this.symbol)) {
            this.authService.socket.emit('symbol_sub', { 'exchange': this.exchange, 'market': this.market, 'symbol': this.symbol });
            this.symbolSubscribeArr.push(item);
          }
        }

        // refresh symbol to profile storage
        this.saveSymbolsToStorage('Equity');
      }
    }

    cellEditEndedHandlerBond(e) {
      // first column is exchange
      let validSymbol: boolean = false;

      if (e.col == 0) {
        this.getExchangeData(this.flexGridMWBond.collectionView.currentItem.exchangeCode);
      }

      if (e.col === 2) {
        this.flexGridMWBond.collectionView.currentItem.symbol = this.flexGridMWBond.collectionView.currentItem.symbol.toUpperCase();
        this.exchange = this.flexGridMWBond.collectionView.currentItem.exchangeCode;
        this.market = this.flexGridMWBond.collectionView.currentItem.marketCode;
        this.symbol = this.flexGridMWBond.collectionView.currentItem.symbol.toUpperCase();

        let item = <MarketWatch>this.flexGridMWBond.collectionView.currentItem;

        let currency = item.currency;

        if (this.dataService.isValidSymbol(item.exchangeCode, item.marketCode, item.symbol)) {
          validSymbol = true;
          item.symbol = item.symbol.toUpperCase();
          this.getBestMarketAndSymbolSummary(item.exchangeCode, item.marketCode, item.symbol);
          this.refreshPublicDataWidgets();

          if (this.flexGridMWBond.selection.row > this.marketWatchCurrentRowIndex) {
            this.marketWatchCurrentRowIndex = this.flexGridMWBond.selection.row;
          }
        }
        else {
          item.symbol = '';
          item.clearData();
        }

        if (validSymbol) {
          this.flexGridMWBond.collectionView.currentItem = item;
          this.dataService.setExchMktSymbol(this.exchange, this.market, this.symbol);

          if (!this.dataService.isSymbolSubscribed(this.exchange, this.market, this.symbol)) {
            this.authService.socket.emit('symbol_sub', { 'exchange': this.exchange, 'market': this.market, 'symbol': this.symbol });
            this.symbolSubscribeArr.push(item);
          }
        }

        // refresh symbol to profile storage
        this.saveSymbolsToStorage('Bond');
      }
    }

    // --------------------------------------------------------------------

    onRemoveSymbolToWatch() {
      if (AppUtility.isValidVariable(this.flexGridMWEquity.selection.row)) {
        let rowIndex = this.flexGridMWEquity.selection.row;
        let j: number;

        let item = <MarketWatch>this.flexGridMWEquity.collectionView.currentItem;
        let lastItem: MarketWatch;

        // working code
        for (let i = rowIndex; i < this.dataMWEquity.length - 1; i++) {
          j = i;
          if (i >= rowIndex) {
            j = i + 1;
            this.flexGridMWEquity.rows[i].dataItem = this.flexGridMWEquity.rows[j].dataItem;
          }

        }

        this.flexGridMWEquity.invalidate();

        // refresh symbol to profile storage
        this.saveSymbolsToStorage('Equity');
      }
      if (AppUtility.isValidVariable(this.flexGridMWBond.selection.row)) {
        let rowIndex = this.flexGridMWBond.selection.row;
        let j: number;

        let item = <MarketWatch>this.flexGridMWBond.collectionView.currentItem;
        let lastItem: MarketWatch;

        // working code
        for (let i = rowIndex; i < this.dataMWBond.length - 1; i++) {
          j = i;
          if (i >= rowIndex) {
            j = i + 1;
            this.flexGridMWBond.rows[i].dataItem = this.flexGridMWBond.rows[j].dataItem;
          }

        }

        this.flexGridMWBond.invalidate();

        // refresh symbol to profile storage
        this.saveSymbolsToStorage('Bond');
      }
    }

    // --------------------------------------------------------------------

    public getMarketWatchEmptyRowIndex(marketType): number {
      let emptyIndex: number = 0;
      let item: MarketWatch;
      if (marketType == 'Bond') {
        for (let i = 0; i < this.flexGridMWBond.rows.length; i++) {
          item = <MarketWatch>this.flexGridMWBond.rows[i].dataItem;
          if (!AppUtility.isValidVariable(item.symbol) || item.symbol.length === 0) {
            emptyIndex = i;
            return emptyIndex;
          }
        }
      }
      else {
        for (let i = 0; i < this.flexGridMWEquity.rows.length; i++) {
          item = <MarketWatch>this.flexGridMWEquity.rows[i].dataItem;
          if (!AppUtility.isValidVariable(item.symbol) || item.symbol.length === 0) {
            emptyIndex = i;
            return emptyIndex;
          }
        }
      }
      return emptyIndex;
    }

    // --------------------------------------------------------------------

    _updateDataMaps(marketType) {
      let flex;

      if (marketType == 'Equity'){
        flex = this.flexGridMWEquity;
      }
      else{
        flex = this.flexGridMWBond;
      }



      if (flex) {

        let colExchange = flex.columns.getColumn('exchangeCode');
        let colMarket = flex.columns.getColumn('marketCode');

        if (colExchange && colMarket) {

          if (this.dataMaps === true) {
            colExchange.dataMapEditor = true; // show drop-down for countries
            colMarket.dataMapEditor = true; // don't show it for products

            // populate exchanges
            this.listingSvc.getExchangeList().subscribe(
              data => {

                if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
                  this.exchanges = data;
                  colExchange.dataMap = this._buildExchangeDataMap(data);
                }
              },
              error => this.errorMsg = <any>error);

            this.updateDataMapMarkets(marketType);
          }
          else {
            colExchange.dataMap = null;
            colMarket.dataMap = null;
          }
        }
      }
    }

    // --------------------------------------------------------------------

    updateDataMapMarkets(marketType) {
      let flex;
      if (marketType == 'Equity')

        flex = this.flexGridMWEquity;
      else
        flex = this.flexGridMWBond;
      if (flex) {
        let colMarket = flex.columns.getColumn('marketCode');
        if (colMarket) {
          if (this.dataMaps === true) {
            colMarket.dataMapEditor = true; // don't show it for products

            // populate exchange markets
            this.listingSvc.getActiveMarketList().subscribe(
              data => {
                if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
                  this.markets = data;
                  colMarket.dataMap = this._buildMarketDataMap(data, marketType);
                }
              },
              error => this.errorMsg = <any>error);
          }
          else {
            colMarket.dataMap = null;
          }
        }
      }
    }

    // --------------------------------------------------------------------

    private _buildExchangeDataMap(items): wjcGrid.DataMap {
      let map = [];
      for (let i = 0; i < items.length; i++) {
        map.push({ key: items[i].exchangeCode, value: items[i].exchangeCode });
      }
      return new wjcGrid.DataMap(map, 'key', 'value');
    }

    // --------------------------------------------------------------------

    private _buildMarketDataMap(items, marketType): wjcGrid.DataMap {
      let mapEquity = [];
      let mapBond = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].marketType.description === AppConstants.MARKET_TYPE_BOND)
          mapBond.push({ key: items[i].marketCode, value: items[i].marketCode });
        else
          mapEquity.push({ key: items[i].marketCode, value: items[i].marketCode });

      }
      if (marketType == 'Bond')
        return new wjcGrid.DataMap(mapBond, 'key', 'value');
      else
        return new wjcGrid.DataMap(mapEquity, 'key', 'value');
    }

    // --------------------------------------------------------------------

    // apply/remove column formatting
    _updateFormatting() {
      let flex = this.flexGridMWBond;
      if (flex) {
        let fmt = this.formatting;
        // this._setColumnFormat('amount', fmt ? 'c' : null);
        // this._setColumnFormat('amount2', fmt ? 'c' : null);
        // this._setColumnFormat('discount', fmt ? 'p0' : null);
        // this._setColumnFormat('start', fmt ? 'MMM d yy' : null);
        // this._setColumnFormat('end', fmt ? 'HH:mm' : null);
      }
    }

    // --------------------------------------------------------------------

    private _setColumnFormat(name, format) {
      let col = this.flexGridMWBond.columns.getColumn(name);
      if (col) {
        col.format = format;
      }
    }

    // --------------------------------------------------------------------

    get dataMaps(): boolean {
      return this._dataMaps;
    }

    // --------------------------------------------------------------------

    set dataMaps(value: boolean) {
      if (this._dataMaps !== value) {
        this._dataMaps = value;
        this._updateDataMaps('');
      }
    }

    // --------------------------------------------------------------------

    get formatting(): boolean {
      return this._formatting;
    }

    // --------------------------------------------------------------------

    set formatting(value: boolean) {
      if (this._formatting !== value) {
        this._formatting = value;
        this._updateFormatting();
      }
    }

    // --------------------------------------------------------------------

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


    ////////////////////////////////////////////////////////////////////
    /////////////  Working Orders ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // --------------------------------------------------------------------

    selectionChangedWO(s, e) {

      if (AppUtility.isValidVariable(this.dataWO) && this.dataWO.length > 0) {
        let rowIndex = e.row;
        this.selectedOrder = this.flexGridWO.rows[this.flexGridWO.selection.row].dataItem;
        // this.selectedOrder = this.dataWO[rowIndex];
      } else {
        this.selectedOrder = null;
      }

    }

    // --------------------------------------------------------------------

    dblclick(s: wjcGrid.FlexGrid, e: any) {
      AppUtility.printConsole('dblclick');
      if (AppUtility.isValidVariable(this.dataWO) && this.dataWO.length > 0) {
        if (AppUtility.isValidVariable(s.selectedRows[0])) {
          AppUtility.printConsole('dblclick: s.selectedRows[0].dataItem - ' + JSON.stringify(s.selectedRows[0].dataItem));
          jQuery('.editOrder_btn').click();
          this.loadChangeOrder();
        }
      } else { this.selectedOrder = null; }
    }

    // -------------------------------------------------------------------------

    click(s: wjcGrid.FlexGrid, e: MouseEvent) {
      AppUtility.printConsole('click');
      if (AppUtility.isValidVariable(this.dataWO) && this.dataWO.length > 0) {
        if (e.ctrlKey) {
          AppUtility.printConsole('ctrl + click: s.selectedRows[0].dataItem - ' + JSON.stringify(s.selectedRows[0].dataItem));
          jQuery('.cancelOrder_btn').click();
          this.loadCancelOrder();
        }
      } else { this.selectedOrder = null; }
    }

    // --------------------------------------------------------------------

    workingOrdersClicked() {
      this.getWorkingOrders();
      this.flexGridWO.invalidate();
    }

    // --------------------------------------------------------------------

    getWorkingOrders(): void {
      this.usersOmsReports.users[0] = AppConstants.username;
      this.orderSvc.getOrders(this.usersOmsReports).subscribe(
        data => {
          this.updateWorkingOrders(data);
        },
        error => {
          this.errorMsg = <any>error;
        });
    }

    // --------------------------------------------------------------------

    updateWorkingOrders(workingOrders): void {
      this.dataWO = [];
      let orders = workingOrders.orders;

      if (!AppUtility.isEmpty(orders)) {
        for (let i = 0; i < orders.length; i++) {
          //this.getMarketByMarketCode(orders[i].market);
          // setTimeout(() => {
          // if (AppUtility.isValidVariable(this.selectedMarket)) {
          // if (!this.isBond) {
          //   if (orders[i].market !== AppConstants.MARKET_TYPE_BOND) {
          //  alert(orders[i].market +', ' + this.selectedMarket[0].marketType.description + ',' +AppConstants.MARKET_TYPE_BOND);
          workingOrders.orders[i].type = OrderTypes.getOrderTypeViewStr(workingOrders.orders[i].type);
          workingOrders.orders[i].state_time = new Date(workingOrders.orders[i].state_time);

          workingOrders.orders[i].state_time = wijmo.Globalize.formatDate(new Date(workingOrders.orders[i].state_time), AppConstants.DATE_TIME_FORMATT);
          workingOrders.orders[i].order_state = AppUtility.ucFirstLetter(workingOrders.orders[i].order_state);
          workingOrders.orders[i].side = AppUtility.ucFirstLetter(workingOrders.orders[i].side);

          workingOrders.orders[i].order_no = workingOrders.orders[i].order_no.toString();

          workingOrders.orders[i].price = (Number(workingOrders.orders[i].price) > 0) ? workingOrders.orders[i].price : '';
          workingOrders.orders[i].yield = (Number(workingOrders.orders[i].price) > 0) ? workingOrders.orders[i].yield : '';
          workingOrders.orders[i].trigger_price = (Number(workingOrders.orders[i].trigger_price) > 0) ? workingOrders.orders[i].trigger_price : '';
          workingOrders.orders[i].volume = (Number(workingOrders.orders[i].volume) > 0) ? wijmo.Globalize.format(workingOrders.orders[i].volume, 'n0') : '';

          this.dataWO.push(workingOrders.orders[i]);

          if (i === 0) {
            this.selectedOrder = workingOrders.orders[0];
          }
        }
      }
      // else {
      //   if (orders[i].market === AppConstants.MARKET_TYPE_BOND) {
      //    // alert(orders[i].market +', ' + this.selectedMarket[0].marketType.description + ',' +AppConstants.MARKET_TYPE_BOND);
      //     workingOrders.orders[i].type = OrderTypes.getOrderTypeViewStr(workingOrders.orders[i].type);
      //     workingOrders.orders[i].state_time = new Date(workingOrders.orders[i].state_time);

      //     workingOrders.orders[i].state_time = wijmo.Globalize.formatDate(new Date(workingOrders.orders[i].state_time), AppConstants.DATE_TIME_FORMATT);
      //     workingOrders.orders[i].order_state = AppUtility.ucFirstLetter(workingOrders.orders[i].order_state);
      //     workingOrders.orders[i].side = AppUtility.ucFirstLetter(workingOrders.orders[i].side);

      //     workingOrders.orders[i].order_no = workingOrders.orders[i].order_no.toString();

      //     workingOrders.orders[i].price = (Number(workingOrders.orders[i].price) > 0) ? workingOrders.orders[i].price : '';
      //     workingOrders.orders[i].yield = (Number(workingOrders.orders[i].price) > 0) ? workingOrders.orders[i].yield : '';
      //     workingOrders.orders[i].trigger_price = (Number(workingOrders.orders[i].trigger_price) > 0) ? workingOrders.orders[i].trigger_price : '';
      //     workingOrders.orders[i].volume = (Number(workingOrders.orders[i].volume) > 0) ? wijmo.Globalize.format(workingOrders.orders[i].volume, 'n0') : '';

      //     this.dataWO.push(workingOrders.orders[i]);

      //     if (i === 0) {
      //       this.selectedOrder = workingOrders.orders[0];
      //     }
      //   }
      // }
      // }
      // }, 500);
      //}
      //}
    }

    ////////////////////////////////////////////////////////////////////
    /////////////  Trades ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // --------------------------------------------------------------------

    getExecutedOrders(): void {
      this.usersOmsReports.users[0] = AppConstants.username;
      this.orderSvc.getExecutedOrders(this.usersOmsReports).subscribe(
        data => {
          this.updateExecutedOrders(data);
        },
        error => {
          this.errorMsg = <any>error;
        });
    }

    // --------------------------------------------------------------------

    updateExecutedOrders(executedOrders): void {
      this.dataTR = [];
      let trades = executedOrders.trades;

      if (!AppUtility.isEmpty(trades)) {
        for (let i = 0; i < trades.length; i++) {
          // this.getMarketByMarketCode(trades[i].market);
          // //setTimeout(() => {
          //   if (AppUtility.isValidVariable(this.selectedMarket)) {
          //     if (!this.isBond) {
          //       if (this.selectedMarket[0].marketType.description !== AppConstants.MARKET_TYPE_BOND) {
          if (trades[i].short) {
            trades[i].short = 'Yes';
          }
          else {
            trades[i].short = 'No';
          }

          trades[i].execution_time = wijmo.Globalize.formatDate(new Date(trades[i].execution_time), AppConstants.DATE_TIME_FORMATT);
          trades[i].side = AppUtility.ucFirstLetter(trades[i].side);

          trades[i].order_no = trades[i].order_no.toString();
          trades[i].ticket_no = trades[i].ticket_no.toString();
          trades[i].volume = (trades[i].volume > 0) ? wijmo.Globalize.format(trades[i].volume, 'n0') : '';
          trades[i].price = (Number(trades[i].price) > 0) ? trades[i].price : '';
          trades[i].yield = (Number(trades[i].price) > 0) ? trades[i].yield : '';
          trades[i].trigger_price = (Number(trades[i].trigger_price) > 0) ? trades[i].trigger_price : '';

          this.dataTR.push(trades[i]);
        }
      }
      //   else {
      //     if (this.selectedMarket[0].marketType.description === AppConstants.MARKET_TYPE_BOND) {
      //       if (trades[i].short) {
      //         trades[i].short = 'Yes';
      //       }
      //       else {
      //         trades[i].short = 'No';
      //       }

      //       trades[i].execution_time = wijmo.Globalize.formatDate(new Date(trades[i].execution_time), AppConstants.DATE_TIME_FORMATT);
      //       trades[i].side = AppUtility.ucFirstLetter(trades[i].side);

      //       trades[i].order_no = trades[i].order_no.toString();
      //       trades[i].ticket_no = trades[i].ticket_no.toString();
      //       trades[i].volume = (trades[i].volume > 0) ? wijmo.Globalize.format(trades[i].volume, 'n0') : '';
      //       trades[i].price = (Number(trades[i].price) > 0) ? trades[i].price : '';
      //       trades[i].yield = (Number(trades[i].price) > 0) ? trades[i].yield : '';
      //       trades[i].trigger_price = (Number(trades[i].trigger_price) > 0) ? trades[i].trigger_price : '';

      //       this.dataTR.push(trades[i]);
      //     }
      //   }
      // }
      //}, 500);
      // }
      // }
      // AppUtility.printConsole('getTrades: ' + JSON.stringify(this.dataTR[0]));
    }

    /////////////////////////////////////////////////////////////
    //////////////////////MBO & MBP /////////////////////////////
    ////////////////////////////////////////////////////////////

    // --------------------------------------------------------------------

    refreshMBOMBP() {
      this.dataMBO = [];
      this.dataMBP = [];

      if (AppUtility.isValidVariable(this.exchange) &&
        AppUtility.isValidVariable(this.market) &&
        AppUtility.isValidVariable(this.symbol)) {
        this.orderSvc.getBestOrders(this.exchange, this.market, this.symbol)
          .subscribe(data => {
            if (AppUtility.isValidVariable(data)) {
              let json = data;
              if (!AppUtility.isEmpty(json))
                this.onBestOrders(json);
            }
          },
            error => this.errorMsg = <any>error);

        this.orderSvc.getBestPrices(this.exchange, this.market, this.symbol)
          .subscribe(data => {
            if (AppUtility.isValidVariable(data)) {
              let json = data;
              if (!AppUtility.isEmpty(json))
                this.onBestPrices(json);
            }
          },
            error => this.errorMsg = <any>error);
      }
    }

    // --------------------------------------------------------------------

    refreshChart() {
      if (AppUtility.isValidVariable(this.exchange) &&
        AppUtility.isValidVariable(this.market) &&
        AppUtility.isValidVariable(this.symbol)) {
        this.chart.exchange = this.exchange;
        this.chart.market = this.market;
        this.chart.security = this.symbol;

        this.chart.exchangeMarketSecurityId = this.dataService.getEmsId(this.exchange, this.market, this.symbol);
        this.chart.refresh(1);
      }
    }

    //////////////////////////////
    ////////// Event Log /////////
    ////////////////////////////////

    // --------------------------------------------------------------------

    eventLogClicked() {
      this.getEventLog();
      this.flexGridEL.invalidate();
    }

    // --------------------------------------------------------------------

    getEventLog(): void {
      this.usersOmsReports.users[0] = AppConstants.username;
      this.orderSvc.getEventLog(this.usersOmsReports).subscribe(
        data => {
          // AppUtility.printConsole('getEventLog: ' + JSON.stringify(data.json()));
          this.updateEventLogData(data);
        },
        error => {
          this.errorMsg = <any>error;
        });
    }

    // --------------------------------------------------------------------

    updateEventLogData(eventLog): void {
      this.dataEL = [];
      this.dataEL_temp = [];
      let orders = eventLog.orders;
      let trades = eventLog.trades;
      let order_temp;

      if (!AppUtility.isEmpty(orders)) {
        order_temp = orders[0];
        for (let i = 0; i < orders.length; i++) {
          //   this.getMarketByMarketCode(orders[i].market);
          //  // setTimeout(() => {
          //     if (AppUtility.isValidVariable(this.selectedMarket)) {
          //       if (!this.isBond) {
          //         if (this.selectedMarket[0].marketType.description !== AppConstants.MARKET_TYPE_BOND) {
          if (orders[i].order_state !== 'partial_filled' && orders[i].order_state !== 'filled') {
            if (orders[i].order_state === 'submitted') {
              orders[i].filled_volume = '0';
              orders[i].remaining_volume = orders[i].volume;
            }
            orders[i].state_time = wijmo.Globalize.formatDate(new Date(orders[i].state_time), AppConstants.DATE_TIME_FORMATT);
            //  orders[i].type = OrderTypes.getOrderTypeViewStr(orders[i].type);  //  we don't display order type on dashboard, that's why commenting the following block @ 25/May/2017 - AiK
            orders[i].order_state = AppUtility.ucFirstLetter(orders[i].order_state);
            orders[i].side = AppUtility.ucFirstLetter(orders[i].side);
            orders[i].order_no = orders[i].order_no.toString();
            if (AppUtility.isValidVariable(orders[i].ticket_no)) {
              orders[i].ticket_no = orders[i].ticket_no.toString();
            }
            orders[i].volume = (eventLog.orders[i].volume > 0) ? wijmo.Globalize.format(eventLog.orders[i].volume, 'n0') : '';
            orders[i].price = (Number(eventLog.orders[i].price) > 0) ? eventLog.orders[i].price : '';
            orders[i].yield = (Number(eventLog.orders[i].price) > 0) ? eventLog.orders[i].yield : '';
            orders[i].trigger_price = (Number(eventLog.orders[i].trigger_price) > 0) ? eventLog.orders[i].trigger_price : '';
            this.dataEL_temp.push(orders[i]);
          }
        }
      }
      //           else {
      //             if (this.selectedMarket[0].marketType.description === AppConstants.MARKET_TYPE_BOND) {
      //               if (orders[i].order_state !== 'partial_filled' && orders[i].order_state !== 'filled') {
      //                 if (orders[i].order_state === 'submitted') {
      //                   orders[i].filled_volume = '0';
      //                   orders[i].remaining_volume = orders[i].volume;
      //                 }
      //                 orders[i].state_time = wijmo.Globalize.formatDate(new Date(orders[i].state_time), AppConstants.DATE_TIME_FORMATT);
      //                 //  orders[i].type = OrderTypes.getOrderTypeViewStr(orders[i].type);  //  we don't display order type on dashboard, that's why commenting the following block @ 25/May/2017 - AiK
      //                 orders[i].order_state = AppUtility.ucFirstLetter(orders[i].order_state);
      //                 orders[i].side = AppUtility.ucFirstLetter(orders[i].side);
      //                 orders[i].order_no = orders[i].order_no.toString();
      //                 if (AppUtility.isValidVariable(orders[i].ticket_no)) {
      //                   orders[i].ticket_no = orders[i].ticket_no.toString();
      //                 }
      //                 orders[i].volume = (eventLog.orders[i].volume > 0) ? wijmo.Globalize.format(eventLog.orders[i].volume, 'n0') : '';
      //                 orders[i].price = (Number(eventLog.orders[i].price) > 0) ? eventLog.orders[i].price : '';
      //                 orders[i].yield = (Number(eventLog.orders[i].price) > 0) ? eventLog.orders[i].yield : '';
      //                 orders[i].trigger_price = (Number(eventLog.orders[i].trigger_price) > 0) ? eventLog.orders[i].trigger_price : '';
      //                 this.dataEL_temp.push(orders[i]);
      //               }
      //             }
      //           }
      //       }
      //   //  }, 500);
      //   }
      // }

      if (!AppUtility.isEmpty(trades)) {
        for (let j = 0; j < trades.length; j++) {
          //   this.getMarketByMarketCode(trades[j].market);
          // //  setTimeout(() => {
          //     if (AppUtility.isValidVariable(this.selectedMarket)) {
          //       if (!this.isBond) {
          //         if (this.selectedMarket[0].marketType.description !== AppConstants.MARKET_TYPE_BOND) {
          if (trades[j].remaining_volume > 0) {
            trades[j].order_state = 'partial_filled';
          }
          else {
            trades[j].order_state = 'filled';
          }
          trades[j].filled_volume = (trades[j].volume > 0) ? wijmo.Globalize.format(trades[j].volume, 'n0') : '0';
          trades[j].state_time = wijmo.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMATT);
          trades[j].execution_time = wijmo.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMATT);
          //  we don't display order type on dashboard, that's why commenting the following block @ 25/May/2017 - AiK
          // let selectedOrder: any[];
          // selectedOrder = orders.filter(item => item.order_no === trades[j].order_no);
          // AppUtility.printConsole('selectedOrder: ' + JSON.stringify(selectedOrder));
          // trades[j].type = OrderTypes.getOrderTypeViewStr(selectedOrder[0].type);
          trades[j].side = AppUtility.ucFirstLetter(trades[j].side);
          trades[j].order_no = trades[j].order_no.toString();
          trades[j].ticket_no = trades[j].ticket_no.toString();
          trades[j].volume = '';
          trades[j].price = (Number(trades[j].price) > 0) ? trades[j].price : '';
          trades[j].yield = (Number(trades[j].price) > 0) ? trades[j].yield : '';
          trades[j].trigger_price = (Number(trades[j].trigger_price) > 0) ? trades[j].trigger_price : '';
          this.dataEL_temp.push(trades[j]);
        }
      }
      //         else {
      //           if (this.selectedMarket[0].marketType.description === AppConstants.MARKET_TYPE_BOND) {
      //             if (trades[j].remaining_volume > 0) {
      //               trades[j].order_state = 'partial_filled';
      //             }
      //             else {
      //               trades[j].order_state = 'filled';
      //             }
      //             trades[j].filled_volume = (trades[j].volume > 0) ? wijmo.Globalize.format(trades[j].volume, 'n0') : '0';
      //             trades[j].state_time = wijmo.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMATT);
      //             trades[j].execution_time = wijmo.Globalize.formatDate(new Date(trades[j].execution_time), AppConstants.DATE_TIME_FORMATT);
      //             //  we don't display order type on dashboard, that's why commenting the following block @ 25/May/2017 - AiK
      //             // let selectedOrder: any[];
      //             // selectedOrder = orders.filter(item => item.order_no === trades[j].order_no);
      //             // AppUtility.printConsole('selectedOrder: ' + JSON.stringify(selectedOrder));
      //             // trades[j].type = OrderTypes.getOrderTypeViewStr(selectedOrder[0].type);
      //             trades[j].side = AppUtility.ucFirstLetter(trades[j].side);
      //             trades[j].order_no = trades[j].order_no.toString();
      //             trades[j].ticket_no = trades[j].ticket_no.toString();
      //             trades[j].volume = '';
      //             trades[j].price = (Number(trades[j].price) > 0) ? trades[j].price : '';
      //             trades[j].yield = (Number(trades[j].price) > 0) ? trades[j].yield : '';
      //             trades[j].trigger_price = (Number(trades[j].trigger_price) > 0) ? trades[j].trigger_price : '';
      //             this.dataEL_temp.push(trades[j]);
      //           }
      //         }
      //       }
      //   //  }, 500);
      //   }
      // }
      this.dataEL = this.dataEL_temp.sort((n1, n2) => new Date(n1.state_time).getTime() - new Date(n2.state_time).getTime());
    }
    // --------------------------------------------------------------------

    fillTradeInfo_Original(orderData, trades) {
      if (!AppUtility.isEmpty(trades)) {
        for (let i = 0; i < trades.length; i++) {
          if (orderData.order_no === trades[i].order_no &&
            (orderData.order_state === 'filled' || orderData.order_state === 'partial_filled')) {
            if (trades[i].short) {
              orderData.short = 'Yes';
            }
            else {
              orderData.short = 'No';
            }

            orderData.ticket_no = trades[i].ticket_no;
            orderData.execution_time = wijmo.Globalize.formatDate(new Date(trades[i].execution_time), AppConstants.DATE_TIME_FORMATT);
            orderData.volume = '';
            orderData.price = trades[i].price;
            orderData.remaining_volume = trades[i].remaining_volume;
            orderData.filled_volume = trades[i].volume;
          }
        }
      }
    }

    // Event log code ends here /////


    ////////////////////////////
    ///////// Indices data code /////
    // --------------------------------------------------------------------

    refreshIndices(): void {
      this.indicesExchange = this.exchange;
      if (AppUtility.isValidVariable(this.exchange) && this.exchange.length > 0) {
        this.orderSvc.getExchangeStats(this.exchange).subscribe(
          resData => {
            let json = resData;
            if (AppUtility.isEmptyArray(json)) {
              this.dataIndices = null;
              return;
            }

            this.dataIndices = [];

            for (let i = 0; i < json.indices.length; i++) {
              // indicesData[i].high = (indicesData[i].high);
              // indicesData[i].low = (indicesData[i].low);
              json.indices[i].volume = Number(json.indices[i].volume);
              // indicesData[i].value = (indicesData[i].value);
              // indicesData[i].current = (indicesData[i].current);
              // indicesData[i].change = (indicesData[i].change);
              // indicesData[i].last = (indicesData[i].last);
            }

            this.dataIndices = json.indices;
          },
          error => {
            this.errorMsg = <any>error;
          });
      }
    }

    // --------------------------------------------------------------------

    loadNewOrder() {
      if (this.dataService.symbolMktExch.length > 0) {
        let strArr: any[] = this.dataService.symbolMktExch.split(AppConstants.LABEL_SEPARATOR);

        this.symbol = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
        this.market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
        this.exchange = (typeof strArr[2] === 'undefined') ? '' : strArr[2];

        if (!this.dataService.isValidSymbol(this.exchange, this.market, this.symbol))
          return;

        if (this.isBond) {
          this.bondOrderNewWatch.loadSelectedSymbolFromMarketWatch();
        }
        else {
          this.orderNew.loadSelectedSymbolFromMarketWatch();
        }

      }
    }

    // --------------------------------------------------------------------

    loadChangeOrder() {
      if (AppUtility.isValidVariable(this.dataWO) && this.dataWO.length > 0) {
        if (AppUtility.isValidVariable(this.selectedOrder)) {
          let marketTypeCode = this.dataService.getMarketType(this.selectedOrder.exchange,
            this.selectedOrder.market,
            this.selectedOrder.symbol);

          if (marketTypeCode !== AppConstants.MARKET_TYPE_BOND) {
            let orderNo = this.selectedOrder.order_no;
            this.orderChange.order.order_no = orderNo;
            this.orderChange.loadOrderNo(orderNo);
          }
          else {
            let orderNo = this.selectedOrder.order_no;
            this.bondOrderChange.order.order_no = orderNo;
            this.bondOrderChange.loadOrderNo(orderNo);
          }
          // }
          // }, 500);
        }
      } else { this.selectedOrder = null; }
    }

    // --------------------------------------------------------------------

    loadCancelOrder() {
      if (AppUtility.isValidVariable(this.dataWO) && this.dataWO.length > 0) {
        if (AppUtility.isValidVariable(this.selectedOrder)) {
          let marketTypeCode = this.dataService.getMarketType(this.selectedOrder.exchange, this.selectedOrder.market, this.selectedOrder.symbol);
          if (marketTypeCode !== AppConstants.MARKET_TYPE_BOND) {
            let orderNo = this.selectedOrder.order_no;
            this.orderCancel.order.order_no = orderNo;
            this.orderCancel.loadOrderNo(orderNo);
          } else {
            let orderNo = this.selectedOrder.order_no;
            this.bondOrderCancel.order.order_no = orderNo;
            this.bondOrderCancel.loadOrderNo(orderNo);
          }
        }
      } else { this.selectedOrder = null; }
    }

    // --------------------------------------------------------------------

    saveSymbolsToStorage(marketType) {
      let symbols: any[] = [];

      // Save dashboard market watch symbols
      if (marketType == 'Bond') {
        for (let i = 0; i < this.flexGridMWBond.rows.length; i++) {
          let item = <MarketWatch>this.flexGridMWBond.rows[i].dataItem;

          if (this.dataService.isValidSymbol(item.exchangeCode, item.marketCode, item.symbol)) {
            symbols.push(item.exchangeCode + AppConstants.LABEL_SEPARATOR + item.marketCode + AppConstants.LABEL_SEPARATOR + item.symbol);
          }
        }
      }
      else {
        for (let i = 0; i < this.flexGridMWEquity.rows.length; i++) {
          let item = <MarketWatch>this.flexGridMWEquity.rows[i].dataItem;

          if (this.dataService.isValidSymbol(item.exchangeCode, item.marketCode, item.symbol)) {
            symbols.push(item.exchangeCode + AppConstants.LABEL_SEPARATOR + item.marketCode + AppConstants.LABEL_SEPARATOR + item.symbol);
          }
        }
      }
      this.storageService.saveDashboardMarketWatchSymbols(symbols);
    }

    // --------------------------------------------------------------------

    private populateSymbolExangeMarketList(_participantId: number) {
      this.listingSvc.getParticipantSecurityExchanges(_participantId)
        .subscribe(restData => {
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
        },
          error => {
            this.errorMsg = <any>error;
          });
    }

    // --------------------------------------------------------------------

    private addSymbolToWatch() {
      this.symbolMarketExchange = this.symbolCombo.text;
      if (this.symbolMarketExchange.length > 0) {
        let strArr: any[] = this.symbolCombo.selectedValue.split(AppConstants.LABEL_SEPARATOR);

        this.symbol = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
        this.market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
        this.exchange = (typeof strArr[2] === 'undefined') ? '' : strArr[2];

        if (!this.dataService.isValidSymbol(this.exchange, this.market, this.symbol))
          return;

        let marketTypeCode = this.dataService.getMarketType(this.exchange, this.market, this.symbol);
        if (marketTypeCode === AppConstants.MARKET_TYPE_BOND) {
          let rowIndex = this.getMarketWatchEmptyRowIndex('Bond');
          let item = new MarketWatch();
          this.marketWatchCurrentRowIndex = rowIndex;

          item.exchangeCode = this.exchange;
          item.marketCode = this.market;
          item.symbol = this.symbol;
          this.dataMWEquity[rowIndex] = item;
          this.flexGridMWBond.rows[rowIndex].dataItem = item;
          this.flexGridMWBond.invalidate();

          if (!this.dataService.isSymbolSubscribed(this.exchange, this.market, this.symbol)) {
            this.authService.socket.emit('symbol_sub', { 'exchange': this.exchange, 'market': this.market, 'symbol': this.symbol });
          }

          this.getBestMarketAndSymbolSummary(item.exchangeCode, item.marketCode, item.symbol);
          this.refreshPublicDataWidgets();
          this.saveSymbolsToStorage('Bond');
        }
        else {
          let rowIndex = this.getMarketWatchEmptyRowIndex('Equity');
          let item = new MarketWatch();
          this.marketWatchCurrentRowIndex = rowIndex;

          item.exchangeCode = this.exchange;
          item.marketCode = this.market;
          item.symbol = this.symbol;
          this.dataMWEquity[rowIndex] = item;
          this.flexGridMWEquity.rows[rowIndex].dataItem = item;
          this.flexGridMWEquity.invalidate();

          if (!this.dataService.isSymbolSubscribed(this.exchange, this.market, this.symbol)) {
            this.authService.socket.emit('symbol_sub', { 'exchange': this.exchange, 'market': this.market, 'symbol': this.symbol });
          }

          this.getBestMarketAndSymbolSummary(item.exchangeCode, item.marketCode, item.symbol);
          this.refreshPublicDataWidgets();
          this.saveSymbolsToStorage('Equity');
        }
      }
    }

    // --------------------------------------------------------------------

    public onAddSymbolAction() {
      this.addSymbolToWatch();
      jQuery('#add_new_symbol').modal('hide');
    }

    // --------------------------------------------------------------------

    public onCancelSymbolAction() {
      jQuery('#add_new_symbol').modal('hide');
    }

    // --------------------------------------------------------------------

    public onAddSymbolToWatch() {
      this.symbolMarketExchange = '';
      this.symbolExangeMarketList = [];
      let symbols: any[] = [];
      let j:number=0;
      if (this.isBond) {
        if (AppUtility.isValidVariable(this.symbolExangeMarketWiseList) && !AppUtility.isEmptyArray(this.symbolExangeMarketWiseList)) {
          for (let i = 0; i < this.symbolExangeMarketWiseList.length; i++) {
            if (this.symbolExangeMarketWiseList[i].marketCode == 'BOND') {
              symbols[j] = this.symbolExangeMarketWiseList[i];
              symbols[j].id = this.symbolExangeMarketWiseList[i].exchangeMarketSecurityId;
              symbols[j].value = this.symbolExangeMarketWiseList[i].displayName_;
              j++;
            }
          }
        }
      }
      else {
        if (AppUtility.isValidVariable(this.symbolExangeMarketWiseList) && !AppUtility.isEmptyArray(this.symbolExangeMarketWiseList)) {
          for (let i = 0; i < this.symbolExangeMarketWiseList.length; i++) {
            if (this.symbolExangeMarketWiseList[i].marketCode != 'BOND') {
              symbols[j] = this.symbolExangeMarketWiseList[i];
              symbols[j].id = this.symbolExangeMarketWiseList[i].exchangeMarketSecurityId;
              symbols[j].value = this.symbolExangeMarketWiseList[i].displayName_;
              j++;
            }
          }

        }
      }
      let cmbItem: ComboItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
      symbols.unshift(cmbItem);

      this.symbolExangeMarketList = symbols;

      jQuery('#add_new_symbol').modal('show');
    }

    // --------------------------------------------------------------------

    isMyOrder(order_no: number): Boolean {
      let order_no_string = order_no.toString();
      return this.dataWO.find(order => order.order_no === order_no_string) !== undefined;
    }

    public getMarketByMarketCode(marketCode: string) {
      this.selectedMarket = [];
      this.listingSvc.getMarketByMarketCode(marketCode)
        .subscribe(restData => {
          if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
            this.selectedMarket = restData;
          } else {
            this.selectedMarket = [];
          }
        },
          error => { this.errorMessage = <any>error });
    }

    public getExchangeData(exchangeCode: string) {
      var colBid = this.flexGridMWBond.columns.getColumn('buy_price');
      var colAsk = this.flexGridMWBond.columns.getColumn('sell_price');
      var colByield = this.flexGridMWBond.columns.getColumn('buy_yield');
      var colAyield = this.flexGridMWBond.columns.getColumn('sell_yield');
      var colLDCP = this.flexGridMWBond.columns.getColumn('last_day_close_price');
      var colLast = this.flexGridMWBond.columns.getColumn('last_trade_price');
      var colOpen = this.flexGridMWBond.columns.getColumn('open');
      var colAveragePrice = this.flexGridMWBond.columns.getColumn('average_price');
      var colHigh = this.flexGridMWBond.columns.getColumn('high');
      var colLow = this.flexGridMWBond.columns.getColumn('low');
      //for working order
      //var colWyield = this.flexGridWO.columns.getColumn('yield');

      this.listingSvc.getExchangeByExchangeCode(exchangeCode)
        .subscribe(restData => {
          if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
            if (restData["bondPricingMechanism"] == 2) {
              colBid.header = 'Bid %';
              colByield.header = 'Bid Yield %';
              colAsk.header = 'Ask %';
              colAyield.header = 'Ask Yield %';
              colLDCP.header = 'LDCP %';
              colLast.header = 'Last %';
              colOpen.header = 'Open %';
              colAveragePrice.header = 'Average %';
              colHigh.header = 'High %';
              colLow.header = 'Low %';

              // colWyield.header='Yield %';
            }
            else {
              colBid.header = 'Bid';
              colByield.header = 'Bid Yield';
              colAsk.header = 'Ask';
              colAyield.header = 'Ask Yield';
              colLDCP.header = 'LDCP';
              colLast.header = 'Last';
              colOpen.header = 'Open';
              colAveragePrice.header = 'Average';
              colHigh.header = 'High';
              colLow.header = 'Low';

              // colWyield.header='Yield';
            }
          } else {
            colBid.header = 'Bid';
            colByield.header = 'Bid Yield'
            colAsk.header = 'Ask';
            colAyield.header = 'Ask Yield'
            colLDCP.header = 'LDCP';
            colLast.header = 'Last';
            colOpen.header = 'Open';
            colAveragePrice.header = 'Average';
            colHigh.header = 'High';
            colLow.header = 'Low';
          }
        },
          error => { this.errorMessage = <any>error });
    }
  }
