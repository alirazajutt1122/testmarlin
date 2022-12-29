import { AnnouncementTypeModel } from './announcement-type-model';
import { Security } from './security';
import { Exchange } from './exchange';
import { Participant } from './participant';

export class AnnouncementModel {
  announcementId: number = 0;
  accountReceivable: number = 0;
  bonusPercentage: number = 0;
  bookClosureFromDate: Date = new Date();
  bookClosureToDate: Date = new Date();
  bulletin: string = '';
  capitalAdequacyRatio: number = 0;
  cash: number = 0;
  commissionFees: number = 0;
  costToIncomeRatio: number = 0;
  description: string = '';
  dividendPerShare: number = 0;
  eps: number = 0;
  exDate: Date = new Date();
  impairmentOnAssets: number = 0;
  incomeTaxExpenses: number = 0;
  interestExpense: number = 0;
  interestIncome: number = 0;
  liabilities: number = 0;
  loansAndAdvances: number = 0;
  marketableSecurities: number = 0;
  meetingDate: Date = new Date();
  meetingTime: Date = new Date();
  meetingType: string = '';
  meetingVenue: string = '';
  nationalFiscalStabilization: number = 0;
  operatingCashFlows: number = 0;
  operatingExpenses: number = 0;
  otherIncomeExpense: number = 0;
  otherOperatingIncome: number = 0;
  paymentDate: Date = new Date();
  period: string = '';
  periodDisplay_: string = '';
  profitLoss: string = '';
  qualifyingDate: Date = new Date();
  returnOnAssets: number = 0;
  returnOnEquity: number = 0;
  revenue: number = 0;
  rightPercentage: number = 0;
  totalAssets: number = 0;
  totalDeposits: number = 0;
  totalShareholderEquity: number = 0;
  yearEnd: Date = new Date();
  yearEndDisplay_: Date = new Date();
  fromDate: Date = new Date();
  fromDateDisplay_: string = '';
  toDate: Date = new Date();
  toDateDisplay_: string = '';
  entryDateTime: Date = new Date();
  monthDisplay_: string = '';
  yearDisplay_: string = '';
  documentContent: string;
  documentName: string;
  documentContentType: string;
  announcementType: AnnouncementTypeModel;
  security: Security;
  exchanges: Exchange[];
  participant: Participant;

  netInterestIncome: number = 0;
  operatingIncome: number = 0;
  operatingProfit: number = 0;
  profitBeforeIncomeTax: number = 0;
  profitAfterTax: number = 0;

  constructor() {
    this.announcementType = new AnnouncementTypeModel();
    this.security = new Security();
    this.participant = new Participant();
    this.exchanges = [];
    // this.revenue = 0;
  }
}
