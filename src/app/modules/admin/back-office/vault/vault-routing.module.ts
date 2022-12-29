import {Route} from '@angular/router';
import { StockActivityRpt } from './Reports/stock-activity/stock-activity-rpt';
import { StockReceiptRpt } from './Reports/stock-receipt/stock-receipt-rpt';
import { StockDepositWithdrawCmp } from './stock-deposit-withdraw/stock-deposit-withdraw';
import { StockActivityPledgeReleaseRpt } from './Reports/stock-activity-pledge-release/stock-activity-pledge-release-rpt';
import { ShareHoldingRpt } from './Reports/share-holding/share-holding-rpt';
import { ClientPreSettlementDeliveryRpt } from './Reports/client-pre-settlement-delivery/client-pre-settlement-delivery-rpt';

export const VaultRoutingModule: Route[] = [
    {
        path: 'stock-deposit-withdraw',
        component:StockDepositWithdrawCmp,
    },
    {
        path: 'stock-deposit-withdraw/:d',
        component:StockDepositWithdrawCmp,
    },
    {
        path: 'stock-receipt-rpt',
        component:StockReceiptRpt,
    },
    {
        path: 'stock-activity-rpt',
        component:StockActivityRpt,
    },
    {
        path: 'stock-activity-pledge-release-rpt',
        component:StockActivityPledgeReleaseRpt,
    },
    {
        path: 'share-holding-rpt',
        component:ShareHoldingRpt,
    },
    {
        path: 'client-pre-settlement-delivery-rpt',
        component:ClientPreSettlementDeliveryRpt,
    },
];
