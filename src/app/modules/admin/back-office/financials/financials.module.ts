import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule} from "@angular/router";

import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import 'bootstrap-slider/dist/bootstrap-slider.js';
import {MatSliderModule} from '@angular/material/slider';
import { FinancialRoutingModule } from './financials-routing.module';
import { ComputeAgingPage } from './compute-aging-page/compute-aging-page';
import { FiscalYearCmp } from './fiscal-year/fiscal-year-cmp';
import { VoucherPage } from './voucher-page/voucher-page';
import { ChartOfAccountRpt } from './Reports/chart-of-account/chart-of-account-rpt';
import { GeneralLedgerRpt } from './Reports/general-ledger/general-ledger-rpt';
import { ProfitLossStatementRpt } from './Reports/profit-loss-statement/profit-loss-statement-rpt';
import { TrialBalanceRpt } from './Reports/trial-balance/trial-balance-rpt';
import { BalanceSheetRpt } from './Reports/balance-sheet/balance-sheet-rpt';
import { CapitalGainTaxRpt } from './Reports/capital-gain-tax/capital-gain-tax-rpt';
import { ClientListRpt } from './Reports/client-list/client-list-rpt';
import { ChequeClearancePage } from './cheque-clearance/cheque-clearance-page';
import { ChartOfAccountCmp } from './chart-of-account/chart-of-account-cmp';
import { ClientsCashBalanceRpt } from './Reports/clients-cash-balance/clients-cash-balance-rpt';
import { VoucherRpt } from './Reports/voucher/voucher-rpt';


@NgModule({
  declarations: [
    ComputeAgingPage,
    FiscalYearCmp,
    VoucherPage,
    ChartOfAccountRpt,
    GeneralLedgerRpt,
    ProfitLossStatementRpt,
    TrialBalanceRpt,
    BalanceSheetRpt,
    CapitalGainTaxRpt,
    ClientListRpt,
    ChequeClearancePage,
    ChartOfAccountCmp,
    ClientsCashBalanceRpt,
    VoucherRpt
  ],
  imports: [
    RouterModule.forChild(FinancialRoutingModule),
    CommonModule,
    WjCoreModule,
    WjInputModule,
    WjGridModule,
    WjGridFilterModule,
    WjGridDetailModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxExtendedPdfViewerModule,
    MatSliderModule
  ],
  providers : [
    DatePipe
  ]
})
export class FinancialModule { }