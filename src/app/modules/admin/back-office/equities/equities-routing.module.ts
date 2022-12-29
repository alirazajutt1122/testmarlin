import {Route} from '@angular/router';
import { ManualTransactionPage } from './manual-transaction/manual-transaction-page';
import { SettlementPage } from './Settlement/settlement-page';

import { AccountHoldingSummary } from './Reports/account-holding-summary/account-holding-summary.component';
import { SecuritywiseClientActivityRpt } from './Reports/securitywise-client-activity/securitywise-client-activity-rpt';
import { ClientLastActivityRpt } from './Reports/psx-confirmation-format/client-last-activity-rpt';
import { AccountActivityRpt } from './Reports/account-activity/account-activity-rpt';
import { AccountMarginDetailRpt } from './Reports/account-margin-detail/account-margin-detail-rpt';
import { ClientGainLossRpt } from './Reports/client-gain-loss/client-gain-loss-rpt';
import { TradeConfirmation } from './Reports/trade-confirmation/trade-confirmation.component';
import { ClientLeviesRpt } from './Reports/client-levies/client-levies-rpt';
import { ParticipantLeviesRpt } from './Reports/participant-levies/participant-levies-rpt';
import { ParticipantCommissionRpt } from './Reports/participant-commission/participant-commission-rpt';
import { AgentCommissionRpt } from './Reports/agent-commission/agent-commission-rpt';
import { ClientMoneyObligationRpt } from './Reports/client-money-obligations/client-money-obligation-rpt';
import { BrokerDeliveryObligationRpt } from './Reports/participant-delivery-obligations/broker-delivery-obligation-rpt';
import { ClientDeliveryObligationRpt } from './Reports/client-delivery-obligations/client-delivery-obligation-rpt';
import { CouponPaymentDetailRpt } from './Reports/coupon-payment-detail/coupon-payment-rpt';
import { RedemptionPaymentRpt } from './Reports/redemption-payment/redemption-payment-rpt';


export const EquitiesRoutingModule: Route[] = [
    {
        path: 'manual-transaction-page',
        component:ManualTransactionPage,
    },
    {
        path: 'settlement-page',
        component:SettlementPage,
    },
    {
        path: 'Reports/trade-confirmation-report',
        component:TradeConfirmation,
    },
    {
        path: 'Reports/account-holding-summary-report',
        component:AccountHoldingSummary,
    },
    {
        path: 'Reports/client-last-activity-rpt',
        component:ClientLastActivityRpt,
    },
    {
        path: 'Reports/securitywise-client-activity-rpt',
        component:SecuritywiseClientActivityRpt,
    },
    {
        path: 'Reports/account-activity-rpt',
        component:AccountActivityRpt,
    },
    {
        path: 'Reports/account-margin-detail-rpt',
        component:AccountMarginDetailRpt,
    }
    ,
    {
        path: 'Reports/client-gain-loss-rpt',
        component:ClientGainLossRpt,
    },
    {
        path: 'Reports/client-levies-rpt',
        component:ClientLeviesRpt,
    },
    {
        path: 'Reports/participant-levies-rpt',
        component:ParticipantLeviesRpt,
    },
    {
        path: 'Reports/participant-commission-rpt',
        component:ParticipantCommissionRpt,
    },
    {
        path: 'Reports/agent-commission-rpt',
        component:AgentCommissionRpt,
    },
    // {
    //     path: 'Reports/broker-delivery-obligation-rpt',
    //     component:BrokerDeliveryObligationRpt,
    // }
    {
        path: 'Reports/client-money-obligation-rpt',
        component:ClientMoneyObligationRpt,
    },
    {
        path: 'Reports/broker-delivery-obligation-rpt',
        component:BrokerDeliveryObligationRpt,
    },
    {
        path: 'Reports/client-delivery-obligation-rpt',
        component:ClientDeliveryObligationRpt,
    },
    {
        path: 'Reports/coupon-payment-detail-rpt',
        component: CouponPaymentDetailRpt,
    },
    {
        path: 'Reports/redemption-payment-rpt',
        component: RedemptionPaymentRpt,
    },
    
    
];
