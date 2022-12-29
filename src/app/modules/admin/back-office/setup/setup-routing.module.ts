import {Route} from '@angular/router';
import { AuthGuard } from 'app/auth.guard';
import { AccountOpeningBalancePage } from './account-opening-balance-page/account-opening-balance-page';
import { ApplicationSetupPage } from './application-setup/application-setup-page';
import { BankBranchPage } from './bank-branches/bank-branches-page';
import { ClientLeviePage } from './client-levies-page/client-levies-page';
import { ClientPage } from './client-page/client-page';
import { CommissionSlabPage } from './commission-slab-page/commission-slab-page';
import { BrokerBranchPage } from './participant-branches/broker-branches-page';
import { SecurityDailyIndicatorPage } from './security-daily-indicator/security-daily-indicator-page';
import { SecurityHaircutPage } from './security-haircut/security-haircut-page';
import { TaxRangesPage } from './tax-ranges-page/tax-ranges-page';
import { TerminalBindingPage } from './terminal-binding-page/terminal-binding-page';
import { VoucherTypePage } from './voucher-type-page/voucher-type-page';
import { AgentPage } from './agent-page/agent-page';
import { BankPage } from './bank-page/bank-page';
import { BondPaymentSchedulePage } from './bond-payment-schedule/bond-payment-schedule-page';
import { BroadcastSMSPage } from './broadcast-sms/broadcast-sms-page';
import { CurrencyRates } from './currency-rates/currency-rates';

export const SetupRoutingModule: Route[] = [
    {
        path: 'application-setup',
        component:ApplicationSetupPage,
    },
    {
        path: 'voucher-type-page',
        component:VoucherTypePage,
    },
    {
        path: 'broker-branches-page',
        component:BrokerBranchPage,
    },
    {
        path: 'bank-branch-page',
        component:BankBranchPage,
    },
    {
        path: 'client-page',
        component:ClientPage,
    },
    {
        path: 'commission-slab-page',
        component:CommissionSlabPage,
    },
    {
        path: 'client-levies-page',
        component:ClientLeviePage,
    },
    {
        path: 'tax-ranges-page',
        component:TaxRangesPage,
    },
    {
        path: 'terminal-binding-page',
        component:TerminalBindingPage,
    },
    {
        path: 'account-opening-balance-page',
        component:AccountOpeningBalancePage,
    },
    {
        path: 'security-haircut-page',
        component:SecurityHaircutPage,
    },
    {
        path: 'security-daily-indicator-page',
        component:SecurityDailyIndicatorPage,
    },
    {
        path: 'agent-page',
        component:AgentPage,
    },
    {
        path: 'bank-page',
        component:BankPage,
    },
    {
        path: 'bond-payment-schedule-page',
        component:BondPaymentSchedulePage,
    },
    {
        path: 'broadcast-sms-page',
        component:BroadcastSMSPage,
    },
    {
        path: 'currency-rates',
        component: CurrencyRates,

    },

    // { path: 'client-page', component: ClientPage, canActivate: [AuthGuard] },
  
   
];