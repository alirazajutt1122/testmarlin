import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OmsReportService } from 'app/services-oms/report.oms.service';

import * as wjcChart from '@grapecity/wijmo.chart';
import * as wjcChartInteraction from '@grapecity/wijmo.chart.interaction';
import * as wjcCore from '@grapecity/wijmo';
import { AuthService2 } from 'app/services/auth2.service';
import { AppUtility } from 'app/app.utility';



@Component({
    selector: 'index-chart',
    templateUrl: 'index-chart.html',
    providers: [OmsReportService]
})
export class IndexChartComponent implements OnInit {

    @Input('showRangeSelector') showRangeSelector: boolean = true;
    @Input('priceChartHeight') priceChartHeight: string = '400';
    @Input('showPeriodSelector') showPeriodSelector: boolean = false;
    @Input('showChartType') showChartType: boolean = false;

    @ViewChild('stChart',{ static: true }) stChart: wjcChart.FlexChart;
    @ViewChild('rsChart',{ static: false }) rsChart: wjcChart.FlexChart;
    @ViewChild('rangeSelector',{ static: false }) rangeSelector: wjcChartInteraction.RangeSelector;

    hasData: boolean;
    pOffset: wjcCore.Rect;
    _chartRendered = false;
    header: string = '';

    indices: wjcCore.ObservableArray;
    errorMsg: string = '';

    exchangeId: number = 0;
    indexCode: string = '';
    numberOfDays: number = 0;
    chartType: string = 'Area';
    showCSOHLC: boolean = false;

    minDate: Date = new Date('2017-03-03T09:00:00+05:00');
    maxDate: Date = new Date('2017-03-03T17:00:00+05:00');

    // --------------------------------------------------------------------------

    constructor(private authService: AuthService2, private reportService: OmsReportService) {
      let d = new Date();
      this.minDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 9, 0, 0, 0);
      this.maxDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 22, 0, 0, 0);
    }

    // --------------------------------------------------------------------------

    ngOnInit() {
      // // add listener for symbol stat push notification in case of trade.
      // this.authService.socket.on('symbol_stat', (dataSS) => { this.onSymbolStats(dataSS); });
    }

    // --------------------------------------------------------------------------

     refresh(_numberOfDays: number ) {

      let d = new Date();
      this.numberOfDays = _numberOfDays;
      if (this.numberOfDays === 1)  //  it means fetch only today data & live data as well
      {
        if (this.chartType === 'HighLowOpenClose' || this.chartType === 'Candlestick') {
          this.chartType = 'Area';
          this.itemClicked();
        }
        this.showCSOHLC = false;
        // get all trades happened so far
        this.reportService.getIndicesHistoryByDays(this.exchangeId, this.indexCode, this.numberOfDays).subscribe(data => {
            this.indices = new wjcCore.ObservableArray(data);

          },
          error => this.errorMsg = error);

        this.stChart.axisX.format = 'HH:mm';
        this.minDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 9, 0, 0, 0);
        this.maxDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 22, 0, 0, 0);
      }
      else  //  it means fetch historical data excluding today
      {
        /*
        this.showCSOHLC = true;
        this.reportService.getSymbolTradesHistoryByDays(this.exchangeMarketSecurityId, this.numberOfDays)
          .subscribe(
          data => {
            this.indices = new wjcCore.ObservableArray(data);
            AppUtility.printConsole('this.indices: ' + this.numberOfDays + ' = ' + JSON.stringify(this.indices));
          },
          error => this.errorMsg = error);

        if (this.numberOfDays === 5 || this.numberOfDays === 30 || this.numberOfDays === 90) {
          this.stChart.axisX.format = 'MMM d';
        }
        else {
          this.stChart.axisX.format = 'MMM yyyy';
        }
        this.minDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - this.numberOfDays, 0, 0, 0, 0);
        this.maxDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 1, 23, 59, 59, 999);
        */
      }

      /*
      let d = new Date();
      this.numberOfDays = _numberOfDays;

      this.reportService.getIndicesHistoryByDays(this.exchangeId, this.indexCode, this.numberOfDays)
        .subscribe(
        data => {
          AppUtility.printConsole('length of data: ' + data.length);
          AppUtility.printConsole('this.data: ' + this.numberOfDays + ' = ' + JSON.stringify(data));
          this.indices = new wjcCore.ObservableArray(data);
        },
        error => this.errorMsg = error);

      if (this.numberOfDays === 5 || this.numberOfDays === 30 || this.numberOfDays === 90) {
        this.stChart.axisX.format = 'MMM d';
      }
      else {
        this.stChart.axisX.format = 'MMM yyyy';
      }
      this.minDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - this.numberOfDays, 0, 0, 0, 0);
      this.maxDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 1, 23, 59, 59, 999);

      this.showCSOHLC = true;
      */
    }

    // --------------------------------------------------------------------------

    stChartRendered() {
      // customize tooltip
      if (!this.stChart) {
        return;
      }

      let chart = this.stChart,
      ele = this.stChart.hostElement,  item;
       this.hasData = false;
      if (AppUtility.isValidVariable(this.indices)) {
        item = this.indices[1];
        this.hasData = (this.indices.length > 0) ? true : false;
      }

      this.pOffset = wjcCore.getElementRect(ele.querySelector('.wj-plot-area'));

      if (!this._chartRendered) {
        this._chartRendered = true;
         chart.tooltip.content = '';
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
        if (this.rsChart) {
          this.rsChart.invalidate();
        }
      }
    }

    // --------------------------------------------------------------------------

    invalidate() {
      this.stChart.invalidate();
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

}
