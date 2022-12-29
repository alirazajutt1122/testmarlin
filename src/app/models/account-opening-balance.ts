import { ChartOfAccount } from './chart-of-account';
import { FiscalYear } from './fiscal-year';

export class AccountOpeningBalance
{
    accountOpeningBalanceId: number;
    closingBalance: number;
    openingBalance: number;
    debitCredit: string;
    chartOfAccount: ChartOfAccount;
    fiscalYear: FiscalYear;   
}