import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OmsReportService } from 'app/services-oms/report.oms.service';
import * as wjcChart from '@grapecity/wijmo.chart';
import * as wjcChartInteraction from '@grapecity/wijmo.chart.interaction';
import * as wjcCore from '@grapecity/wijmo';
import { AuthService2 } from 'app/services/auth2.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { AppUtility } from 'app/app.utility';
import { SymbolStats } from 'app/models/symbol-stats';


@Component({
    selector: 'security-trade-chart',
    templateUrl: 'security-trade-chart.html',
    providers: [OmsReportService]
})
export class SecurityTradeChartComponent implements OnInit {

    @Input('showRangeSelector') showRangeSelector: boolean = true;
    @Input('priceChartHeight') priceChartHeight: string = '300';
    @Input('volumeChartHeight') volumeChartHeight: string = '150';
    @Input('showPeriodSelector') showPeriodSelector: boolean = false;
    @Input('showChartType') showChartType: boolean = false;
    @Input('showQuantityChartButton') showQuantityChartButton: boolean = false;
    @Input('showVolumeChart') showVolumeChart: boolean = true;

    @ViewChild('stChart',{ static: false }) stChart: wjcChart.FlexChart;
    @ViewChild('volChart',{ static: false }) volChart: wjcChart.FlexChart;
    @ViewChild('rsChart',{ static: false }) rsChart: wjcChart.FlexChart;
    @ViewChild('rangeSelector',{ static: false }) rangeSelector: wjcChartInteraction.RangeSelector;

    hasData: boolean;
    pOffset: wjcCore.Rect;
    _chartRendered = false;
    header: string = '';

    trades: wjcCore.ObservableArray;
    errorMsg: string = '';

    exchange: string = '';
    market: string = '';
    security: string = '';
    exchangeMarketSecurityId: number = 0;
    numberOfDays: number = 0;
    chartType: string = 'Area';
    showCSOHLC: boolean = false;

    minDate: Date = new Date('2017-03-03T09:00:00+05:00');
    maxDate: Date = new Date('2017-03-03T17:00:00+05:00');

    // --------------------------------------------------------------------------

    constructor(private authService: AuthService2, private reportService: OmsReportService,
      private dataService: DataServiceOMS) {
      let d = new Date();
      this.minDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 9, 0, 0, 0);
      this.maxDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 22, 0, 0, 0);
    }

    // --------------------------------------------------------------------------

    ngOnInit() {
      // add listener for symbol stat push notification in case of trade.
      this.authService.socket.on('symbol_stat', (dataSS) => { this.onSymbolStats(dataSS); });
    }

    // --------------------------------------------------------------------------

    onSymbolStats(data) {
      if (!AppUtility.isValidVariable(data))
        return;

      if (data.exchange !== this.exchange ||
        data.market !== this.market ||
        this.security !== data.symbol)
        return;

      let trade = new SymbolStats();
      trade.open = Number(data.open);
      trade.high = Number(data.high);
      trade.low = Number(data.low);
      trade.close = Number(data.close);
      trade.last_trade_size = data.last_trade_size;
      trade.last_trade_time = new Date(data.last_trade_time);
      trade.last_trade_price = Number(data.last_trade_price);

      this.trades.push(trade);
    }

    // --------------------------------------------------------------------------

    refresh(_numberOfDays: number) {
      let d = new Date();
      this.header = this.security;
      this.numberOfDays = _numberOfDays;

      if (this.numberOfDays === 1)  //  it means fetch only today data & live data as well
      {
        if (this.chartType === 'HighLowOpenClose' || this.chartType === 'Candlestick') {
          this.chartType = 'Area';
          this.itemClicked();
        }
        this.showCSOHLC = false;

        // subscribe for trade push notification
        if (!this.dataService.isSymbolSubscribed(this.exchange, this.market, this.security)) {
          this.authService.socket.emit('symbol_sub', { 'exchange': this.exchange, 'market': this.market, 'symbol': this.security });
        }

        // get all trades happened so far
        this.reportService.getSymbolTradesHistory(this.exchange, this.market, this.security)
          .subscribe(
          data => {
            this.trades = new wjcCore.ObservableArray(data);
            AppUtility.printConsole('this.trades: ' + this.numberOfDays + ' = ' + JSON.stringify(this.trades));
          },
          error => this.errorMsg = error);

        this.stChart.axisX.format = 'HH:mm';
        this.volChart.axisX.format = 'HH:mm';
        this.minDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 9, 0, 0, 0);
        this.maxDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 22, 0, 0, 0);
      }
      else  //  it means fetch historical data excluding today
      {
        this.showCSOHLC = true;
        // this.itemClicked();

        this.reportService.getSymbolTradesHistoryByDays(this.exchangeMarketSecurityId, this.numberOfDays)
          .subscribe(
          data => {
            this.trades = new wjcCore.ObservableArray(data);
            AppUtility.printConsole('this.trades: ' + this.numberOfDays + ' = ' + JSON.stringify(this.trades));
          },
          error => this.errorMsg = error);

        if (this.numberOfDays === 5 || this.numberOfDays === 30 || this.numberOfDays === 90) {
          this.stChart.axisX.format = 'MMM d';
          this.volChart.axisX.format = 'MMM d';
        }
        else {
          this.stChart.axisX.format = 'MMM yyyy';
          this.volChart.axisX.format = 'MMM yyyy';
        }
        this.minDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - this.numberOfDays, 0, 0, 0, 0);
        this.maxDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 1, 23, 59, 59, 999);
      }
    }

    // --------------------------------------------------------------------------

    stChartRendered() {
      // customize tooltip
      if (!this.stChart) {
        return;
      }

      let chart = this.stChart,
        ele = this.stChart.hostElement,
        item;

      this.hasData = false;
      if (AppUtility.isValidVariable(this.trades)) {
        item = this.trades[1];
        this.hasData = (this.trades.length > 0) ? true : false;
      }

      this.pOffset = wjcCore.getElementRect(ele.querySelector('.wj-plot-area'));

      if (!this._chartRendered) {
        this._chartRendered = true;
        // chart.tooltip.content = '';
      }
    }

    // --------------------------------------------------------------------------

    rsChartRendered() {
      let rsChart = this.rsChart;
      if (!rsChart) {
        return;
      }

      rsChart.axisY.labels = false;
      rsChart.axisY.majorGrid = false;
      rsChart.tooltip.content = '';
    }

    // --------------------------------------------------------------------------

    rangeChanged() {
      if (this.rangeSelector) {
        if (this.stChart) {
          this.stChart.axisX.min = this.rangeSelector.min;
          this.stChart.axisX.max = this.rangeSelector.max;
          this.stChart.invalidate();
        }

        if (this.volChart) {
          this.volChart.axisX.min = this.rangeSelector.min;
          this.volChart.axisX.max = this.rangeSelector.max;
          this.volChart.invalidate();
        }

        if (this.rsChart) {
          this.rsChart.invalidate();
        }
      }
    }

    // --------------------------------------------------------------------------

    invalidate() {
      this.stChart.invalidate();
      this.volChart.invalidate();
      if (this.rsChart)
        this.rsChart.invalidate();
    }

    // --------------------------------------------------------------------------

    itemClicked() {
      if (this.chartType === 'Area')
        this.stChart.chartType = wjcChart.ChartType.Area;
      else if (this.chartType === 'Line')
        this.stChart.chartType = wjcChart.ChartType.Line;
      else if (this.chartType === 'LineSymbols')
        this.stChart.chartType = wjcChart.ChartType.LineSymbols;
      else if (this.chartType === 'Spline')
        this.stChart.chartType = wjcChart.ChartType.Spline;
      else if (this.chartType === 'SplineArea')
        this.stChart.chartType = wjcChart.ChartType.SplineArea;
      else if (this.chartType === 'SplineSymbols')
        this.stChart.chartType = wjcChart.ChartType.SplineSymbols;
      else if (this.chartType === 'Scatter')
        this.stChart.chartType = wjcChart.ChartType.Scatter;
      else if (this.chartType === 'HighLowOpenClose')
        this.stChart.chartType = wjcChart.ChartType.HighLowOpenClose;
      else if (this.chartType === 'Candlestick')
        this.stChart.chartType = wjcChart.ChartType.Candlestick;
      this.stChart.invalidate();
    }

    // --------------------------------------------------------------------------

    onshowQuantityChartClick() {
      this.showVolumeChart = !this.showVolumeChart;
      if (this.showVolumeChart)
        this.volChart.invalidate();
    }

    // --------------------------------------------------------------------------

}
