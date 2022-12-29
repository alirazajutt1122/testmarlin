import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import { EquitiesRoutingModule } from './equities-routing.module';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogCmp } from '../user-site/dialog/dialog.component';
import { ManualTransactionPage } from './manual-transaction/manual-transaction-page';
import { SharedModule } from 'app/shared.module';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SettlementPage } from './Settlement/settlement-page';
import { TradeConfirmation } from './Reports/trade-confirmation/trade-confirmation.component';
import { AccountHoldingSummary } from './Reports/account-holding-summary/account-holding-summary.component';
import { ClientLastActivityRpt } from './Reports/psx-confirmation-format/client-last-activity-rpt';
import { SecuritywiseClientActivityRpt } from './Reports/securitywise-client-activity/securitywise-client-activity-rpt';
import { AccountActivityRpt } from './Reports/account-activity/account-activity-rpt';
import { AccountMarginDetailRpt } from './Reports/account-margin-detail/account-margin-detail-rpt';
import { ClientGainLossRpt } from './Reports/client-gain-loss/client-gain-loss-rpt';
import { ClientLeviesRpt } from './Reports/client-levies/client-levies-rpt';
import { ParticipantLeviesRpt } from './Reports/participant-levies/participant-levies-rpt';
import { ParticipantCommissionRpt } from './Reports/participant-commission/participant-commission-rpt';
import { AgentCommissionRpt } from './Reports/agent-commission/agent-commission-rpt';
import { ClientMoneyObligationRpt } from './Reports/client-money-obligations/client-money-obligation-rpt';
import { BrokerDeliveryObligationRpt } from './Reports/participant-delivery-obligations/broker-delivery-obligation-rpt';
import { ClientDeliveryObligationRpt } from './Reports/client-delivery-obligations/client-delivery-obligation-rpt';
import { RedemptionPaymentRpt } from './Reports/redemption-payment/redemption-payment-rpt';
import { CouponPaymentDetailRpt } from './Reports/coupon-payment-detail/coupon-payment-rpt';





@NgModule({
  declarations: [
    ManualTransactionPage,
    SettlementPage,
    TradeConfirmation,
    AccountHoldingSummary,
    ClientLastActivityRpt,
    SecuritywiseClientActivityRpt,
    AccountActivityRpt,
    AccountMarginDetailRpt,
    ClientGainLossRpt,
    ClientLeviesRpt,
    ParticipantLeviesRpt,
    ParticipantCommissionRpt,
    AgentCommissionRpt,
    ClientMoneyObligationRpt,
    BrokerDeliveryObligationRpt,
    ClientDeliveryObligationRpt,
    CouponPaymentDetailRpt,
    RedemptionPaymentRpt
  ],
  imports: [
    RouterModule.forChild(EquitiesRoutingModule),
    CommonModule,
    WjCoreModule,
    WjInputModule,
    WjGridModule,
    WjGridFilterModule,
    WjGridDetailModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxExtendedPdfViewerModule
  ],
})
export class EquitiesModule { }
