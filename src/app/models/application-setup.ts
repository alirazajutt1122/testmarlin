import { VoucherType } from './voucher-type';
import { SettlementType } from './settlement-type';
import { Exchange } from './exchange';
import { Receivables } from './receivables';
import { Payables } from './payables';
import { Commission } from './commission';
import { ChartOfAccount } from './chart-of-account';
import { Participant } from './participant';

export class ApplicationSetup {
participant: Participant;
participantId:Number = 0;
//Financials Tab
chartOfAccountLevel: Number = 0;
chartOfAccountLevelCodeLength : any[];
voucherNoResetPolicyMonthYear: Boolean;
voucherBackDateEntry: Boolean;

// Equity Tab
exchange: Exchange;
receivables: Receivables;
payables: Payables;
commission: Commission;
settlementType:SettlementType;

// Stationery Tab
reportHeaderLine1: String;
reportHeaderLine2: String;
reportHeaderLine3: String;
debitCreditDisplayMode: boolean; // A for american. B for british
companyLogoBase64_ :String=""; // logo file address.
companyLogoContentType:String="";
companyLogoName:String="";

// Email Tab
smtpServer: String;
password: String;
smtpOutgoingEmail: String;
smtpPort: String;

// miscellaneous
clientControlAccount: ChartOfAccount;       // change the type in future
unappropriatePLaccount: ChartOfAccount;
roundingDifferenceAccount: ChartOfAccount;
defaultSecutrityHairCut: Number; //1 to 99    // Suggested by Raheel Rafeeq
capitalGainAccount: ChartOfAccount;
voucherType_Misc: VoucherType;

// Contract Note
reportFooter1: String;
reportFooter2: String;

//  Password Management
passwordStrengthString: String = '';
passwordStrength: Number = 0;
passwordHistoryDays: Number = 0;
passwordExpiryDays: Number = 0;
advanceAlertPasswordExpiryDays: Number = 0;
unsuccessfulLoginAttempts: Number = 0;

cgt365DaysTaxPercentage: Number = 0;
individualCgtExpensePercentage: Number = 0;
cgtAbove365DaysTaxPercentage: Number = 0;
corporateCgtExpensePercentage: Number = 0;
}