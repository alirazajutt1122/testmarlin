import {Route} from '@angular/router';
import { AuthGuard } from 'app/auth.guard';
import { ChartOfAccountCmp } from './chart-of-account/chart-of-account-cmp';
import { ChequeClearancePage } from './cheque-clearance/cheque-clearance-page';
import { ComputeAgingPage } from './compute-aging-page/compute-aging-page';
import { FiscalYearCmp } from './fiscal-year/fiscal-year-cmp';
import { BalanceSheetRpt } from './Reports/balance-sheet/balance-sheet-rpt';
import { CapitalGainTaxRpt } from './Reports/capital-gain-tax/capital-gain-tax-rpt';
import { ChartOfAccountRpt } from './Reports/chart-of-account/chart-of-account-rpt';
import { ClientListRpt } from './Reports/client-list/client-list-rpt';
import { ClientsCashBalanceRpt } from './Reports/clients-cash-balance/clients-cash-balance-rpt';
import { GeneralLedgerRpt } from './Reports/general-ledger/general-ledger-rpt';
import { ProfitLossStatementRpt } from './Reports/profit-loss-statement/profit-loss-statement-rpt';
import { TrialBalanceRpt } from './Reports/trial-balance/trial-balance-rpt';
import { VoucherRpt } from './Reports/voucher/voucher-rpt';
import { VoucherPage } from './voucher-page/voucher-page';


export const FinancialRoutingModule: Route[] = [
    {
        path: 'compute-aging-page',
        component:ComputeAgingPage,
    },
    {
        path: 'fiscal-year',
        component:FiscalYearCmp,
    },
    {
        path: 'voucher-page',
        component:VoucherPage,
    },
    {
        path: 'chart-of-account-rpt',
        component:ChartOfAccountRpt,
    },
    {
        path: 'general-ledger-rpt',
        component:GeneralLedgerRpt,
    },
    {
        path: 'profit-loss-statement-rpt',
        component:ProfitLossStatementRpt,
    },
    {
        path: 'trial-balance-rpt',
        component:TrialBalanceRpt,
    },
    {
        path: 'balance-sheet-rpt',
        component:BalanceSheetRpt,
    },
    {
        path: 'capital-gain-tax-rpt',
        component:CapitalGainTaxRpt,
    },
    {
        path: 'client-list-rpt',
        component:ClientListRpt,
    },
    {
        path: 'cheque-clearance-page',
        component:ChequeClearancePage,
    },
    {
        path: 'chart-of-account',
        component:ChartOfAccountCmp,
    },
    {
        path: 'clients-cash-balance-rpt',
        component:ClientsCashBalanceRpt,
    },
    {
        path: 'voucher-rpt',
        component:VoucherRpt,
    },

   
];