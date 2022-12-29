import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OmsReportService } from 'app/services-oms/report.oms.service';

import * as wjcChart from '@grapecity/wijmo.chart';
import * as wjcChartInteraction from '@grapecity/wijmo.chart.interaction';
import * as wjcCore from '@grapecity/wijmo';
import { AuthService2 } from 'app/services/auth2.service';
import { AppUtility } from 'app/app.utility';


@Component({
    selector: 'yearly-assets-history-chart',
    templateUrl: 'yearly-assets-history-chart.html',
    providers: [OmsReportService]
  })
export class YearlyAssetsHistoryChartComponent implements OnInit {
    @Input('showRangeSelector') showRangeSelector: boolean = true;
    @Input('chartHeight') chartHeight: string = '200';
    @Input('showPeriodSelector') showPeriodSelector: boolean = false;
    @Input('showChartType') showChartType: boolean = false;

    @ViewChild('stChart',{ static: false }) stChart: wjcChart.FlexChart;
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
    numberOfDays: number = 1;
    chartType: string = 'Column';
    showCSOHLC: boolean = false;
    minDate: Date = new Date('1999-12-31');
    maxDate: Date = new Date('2018-12-31');
    // chart properties
    stacking = 'None';
    rotated = false;

    // --------------------------------------------------------------------------

    constructor(private authService: AuthService2, private reportService: OmsReportService) { }

    // --------------------------------------------------------------------------

    ngOnInit() { }

    // --------------------------------------------------------------------------

    refresh(selectedsymboldata_: any[]) {
      let tempArr_ = [] as temparray[];
      for (let index: number = 0; index < selectedsymboldata_.length; index++) {
        let myArr = new temparray();
        let oDate = new Date(selectedsymboldata_[index].yearEnd);

        myArr.ye = oDate.getFullYear() + ' - ' + selectedsymboldata_[index].period + ' (' + selectedsymboldata_[index].exchangeCode +')';
        myArr.assets = selectedsymboldata_[index].totalAssets;
        myArr.liabilities = selectedsymboldata_[index].liabilities;
        myArr.shareholderequities = selectedsymboldata_[index].totalShareholderEquity;
        myArr.period = selectedsymboldata_[index].period;
        tempArr_[index] = myArr;
      }
      this.indices = new wjcCore.ObservableArray(tempArr_);
      AppUtility.printConsole('this.indices: ' + JSON.stringify(this.indices));

      this.stChart.axisX.labelAngle = 45;

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
      if (AppUtility.isValidVariable(this.indices)) {
        item = this.indices[1];
        this.hasData = (this.indices.length > 0) ? true : false;
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
      rsChart.axisX.labelAngle = 45;
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

  export class temparray {
    ye: string;
    assets: number;
    liabilities: number;
    shareholderequities: number;
    period: string;

}
