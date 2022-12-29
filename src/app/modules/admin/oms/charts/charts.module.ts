

import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { WjChartModule } from '@grapecity/wijmo.angular2.chart';
import { WjChartInteractionModule } from '@grapecity/wijmo.angular2.chart.interaction';
import { WjChartFinanceModule } from '@grapecity/wijmo.angular2.chart.finance';
import { WjChartAnimationModule } from '@grapecity/wijmo.angular2.chart.animation';
import { WjChartAnnotationModule } from '@grapecity/wijmo.angular2.chart.annotation';
import { WjChartAnalyticsModule } from '@grapecity/wijmo.angular2.chart.analytics';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';

import { SecurityTradeChartComponent } from './security-trade-chart/security-trade-chart';
import { IndexChartComponent } from './index-chart/index-chart';
import { HistoricalPayoutsChartComponent } from './historical-payouts-chart/historical-payouts-chart';
import { YearlyAssetsHistoryChartComponent } from './yearly-assets-history-chart/yearly-assets-history-chart';
import {  SymbolChartCmp } from './symbol-chart/symbol-chart-cmp'
import { TranslateModule } from '@ngx-translate/core';



export const routes = [

];

@NgModule({
  imports: [
    CommonModule,
    WjChartModule,
    WjChartFinanceModule,
    WjChartAnimationModule,
    WjChartInteractionModule,
    WjChartAnnotationModule,
    WjChartAnalyticsModule,
    // WidgetModule,
    WjCoreModule,
    WjInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    // TooltipModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    SecurityTradeChartComponent,
    IndexChartComponent,
    HistoricalPayoutsChartComponent,
    YearlyAssetsHistoryChartComponent
  ],
  declarations: [
    SymbolChartCmp,
    SecurityTradeChartComponent,
    IndexChartComponent,
    HistoricalPayoutsChartComponent,
    YearlyAssetsHistoryChartComponent
  ],

})
export default class ChartsModule {
  static routes = routes;
}
