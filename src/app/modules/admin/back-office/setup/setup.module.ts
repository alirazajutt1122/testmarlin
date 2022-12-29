import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";

import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SetupRoutingModule } from './setup-routing.module';
import { ApplicationSetupPage } from './application-setup/application-setup-page';
import 'bootstrap-slider/dist/bootstrap-slider.js';
import {MatSliderModule} from '@angular/material/slider';
import { VoucherTypePage } from './voucher-type-page/voucher-type-page';
import { BankBranchPage } from './bank-branches/bank-branches-page';
import { BrokerBranchPage } from './participant-branches/broker-branches-page';
import { ClientPage } from './client-page/client-page';
import { CommissionSlabPage } from './commission-slab-page/commission-slab-page';
import { ClientLeviePage } from './client-levies-page/client-levies-page';
import { TaxRangesPage } from './tax-ranges-page/tax-ranges-page';
import { TerminalBindingPage } from './terminal-binding-page/terminal-binding-page';
import { AccountOpeningBalancePage } from './account-opening-balance-page/account-opening-balance-page';
import { SecurityHaircutPage } from './security-haircut/security-haircut-page';
import { SecurityDailyIndicatorPage } from './security-daily-indicator/security-daily-indicator-page';
import { AgentPage } from './agent-page/agent-page';
import { BankPage } from './bank-page/bank-page';
import { BondPaymentSchedulePage } from './bond-payment-schedule/bond-payment-schedule-page';
import { AuditLogCmp } from '../../reports/auditlog-page';
import { BroadcastSMSPage } from './broadcast-sms/broadcast-sms-page';
import { ClientRegistration } from './client-page/client-registration';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyRates } from './currency-rates/currency-rates';


@NgModule({
  declarations: [
    ApplicationSetupPage,
    VoucherTypePage,
    BankBranchPage,
    BrokerBranchPage,
    ClientPage,
    CommissionSlabPage,
    ClientLeviePage,
    TaxRangesPage,
    TerminalBindingPage,
    AccountOpeningBalancePage,
    SecurityHaircutPage,
    SecurityDailyIndicatorPage,
    AgentPage,
    BankPage,
    BondPaymentSchedulePage, 
    AuditLogCmp,
    BroadcastSMSPage,
    ClientRegistration,
    CurrencyRates
  ],
  imports: [
    RouterModule.forChild(SetupRoutingModule),
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
    MatSliderModule,
    TranslateModule

  ],
})
export class SetupModule { }