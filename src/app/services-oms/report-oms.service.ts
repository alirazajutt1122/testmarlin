"use strict";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as wjcCore from "@grapecity/wijmo";
import "rxjs/Rx";


import { ReportParams } from "../models/report-params";
import { Params } from "../models/report-params";

import { AppConstants } from "../app.utility";
import { AppUtility } from "app/app.utility";

@Injectable()
export class ReportService {
  errorMessage: string = "";

  constructor(private appUtility: AppUtility, private http: HttpClient) {}

  // public getClientList(participantId): any {
  //   let url = "bond-transactions/clientByParticipantId/participant-id/" + participantId;
  //   return this.appUtility.wsGetRequest(url);
  // }

  public getClientList(participantid: number): Observable<Object[]> {
    let url = 'bond-transactions/clientByParticipantId/participant-id/' + participantid;
    return this.appUtility.wsGetRequest(url);
  }
  public getChartOfAccounts(params: ReportParams): any {
    let url = "reports/chart-of-account/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getVouchers(params: ReportParams): any {
    let url = "reports/voucher-printing/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getStockReceiptDeposit(params: ReportParams): any {
    let url = "reports/stock-deposit-receipt/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }
  public getStockReceiptWithdraw(params: ReportParams): any {
    let url = "reports/stock-withdraw-receipt/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getStockActivity(
    participantId,
    securityId,
    security,
    startDate,
    endDate,
    fromAccount,
    toAccount,
    exchangeId
  ): any {
    let url =
      "reports/stock-activity/participant/" +
      participantId +
      "/security-id/" +
      securityId +
      "/security/" +
      security +
      "/from-account/" +
      fromAccount +
      "/to-account/" +
      toAccount +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/exchange-id/" +
      exchangeId +
      "/";
    //AppUtility.printConsole(params);
    //let url = 'reports/stock-activity/participant/1/security/2/from-account/SDCB1145/to-account/SDCB7680/start-date/2016-12-01/end-date/2017-12-01/';
    return this.appUtility.wsGetRequest(url);
  }

  public getHistoricalPayouts(params: ReportParams): any {
    let url = "reports/historic-payouts/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getHistoricalPayoutsGrid(participantId, secList): any {
    let url =
      "reports/historical-payouts/participantId/" +
      participantId +
      "/securitiesList/" +
      secList;
    return this.appUtility.wsGetRequest(url);
  }

  public getStockComparisonFundamentals(params: ReportParams): any {
    let url = "reports/stock-comparison-fundamentals/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getStockComparisonFundamentalsGrid(participantId, secList): any {
    let url =
      "reports/stock-comparison-fundamentals/participantId/" +
      participantId +
      "/securitiesList/" +
      secList;
    return this.appUtility.wsGetRequest(url);
  }

  public getStockComparisonED(params: ReportParams): any {
    let url = "reports/stock-comparison-ed/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getStockComparisonEDGrid(participantId, secList): any {
    let url =
      "reports/stock-comparision-earning_and_dividend/participantId/" +
      participantId +
      "/securitiesList/" +
      secList;
    return this.appUtility.wsGetRequest(url);
  }

  public getStockScreenerFundamentals(params: ReportParams): any {
    let url = "reports/stock-screener-fundamentals/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getStockScreenerFundamentalsGrid(participantId, secList): any {
    let url =
      "reports/stock-screener-fundamentals/participantId/" +
      participantId +
      "/securitiesList/" +
      secList;
    return this.appUtility.wsGetRequest(url);
  }

  public getStockScreenerED(params: ReportParams): any {
    let url = "reports/stock-screener-ed/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getStockScreenerEDGrid(participantId, secList): any {
    let url =
      "reports/stock-screener-earning-and-dividend/participantId/" +
      participantId +
      "/securitiesList/" +
      secList;
    return this.appUtility.wsGetRequest(url);
  }

  public getYearlyAssetsHistory(params: ReportParams): any {
    let url = "reports/yearly-assets-history/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getYearlyAssetsHistoryGrid(
    participantId,
    yearEnd,
    periodsList,
    secList
  ): any {
    let url =
      "reports/yearly-assets-history/participantId/" +
      participantId +
      "/yearEndList/" +
      yearEnd +
      "/periodsList/" +
      periodsList +
      "/securitiesList/" +
      secList;
    return this.appUtility.wsGetRequest(url);
  }

  public getYearlyDividendComparison(params: ReportParams): any {
    let url = "reports/yearly-dividend-comparison/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getYearlyDividendComparisonGrid(
    participantId,
    yearEnd,
    periodsList,
    secList
  ): any {
    let url =
      "reports/yearly-dividend-comparision/participantId/" +
      participantId +
      "/yearEndList/" +
      yearEnd +
      "/periodsList/" +
      periodsList +
      "/securitiesList/" +
      secList;
    return this.appUtility.wsGetRequest(url);
  }

  public getPortfolioAnalysis(params: ReportParams): any {
    let url = "reports/portfolio-analysis/";
    AppUtility.printConsole(params);
    return this.appUtility.wsPostRequest(url, params);
  }

  public getPortfolioAnalysisGrid(yearEnd, periodsList, secList): any {
    let url =
      "reports/portfolio-analysis/yearEndList/" +
      yearEnd +
      "/periodsList/" +
      periodsList +
      "/securitiesList/" +
      secList;
    return this.appUtility.wsGetRequest(url);
  }

  public getTradeConfirmation(
    participantId,
    startDate,
    endDate,
    exchangeId,
    fromAccount,
    toAccount,
    lang_
  ): any {
    let url =
      "reports/trade-confirmation/participant/" +
      participantId +
      "/from-account/" +
      fromAccount +
      "/to-account/" +
      toAccount +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/lang/"+
      lang_ +
      "/";
      
    return this.appUtility.wsGetRequest(url);
  }

  public getClientsGainLoss(
    participantId,
    exchangeId,
    exchangeName,
    fromAccount,
    toAccount,
    startDate,
    endDate
  ): any {
    let url =
      "reports/clients-gain-loss/participant/" +
      participantId +
      "/exchange-id/" +
      exchangeId +
      "/exchange-name/" +
      exchangeName +
      "/from-client/" +
      fromAccount +
      "/to-client/" +
      toAccount +
      "/from-date/" +
      startDate +
      "/to-date/" +
      endDate +
      "/";
    return this.appUtility.wsGetRequest(url);
  }

  public getAccountHolding(
    participantId,
    startDate,
    endDate,
    exchangeId,
    exchange,
    branchId,
    branch,
    fromAccount,
    toAccount,
    securityId,
    security,
    lang_
  ): any {
    let url =
      "reports/account-holding-summary/participant/" +
      participantId +
      "/from-account/" +
      fromAccount +
      "/to-account/" +
      toAccount +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/exchange-id/" +
      exchangeId +
      "/exchange/" +
      exchange +
      "/branch-id/" +
      branchId +
      "/participant-branch/" +
      branch +
      "/security-id/" +
      securityId +
      "/security/" +
      security +
      "/lang/"+
      lang_
      "/";
      
    return this.appUtility.wsGetRequest(url);
  }
  public getAccountActivitySummary(
    participantId,
    startDate,
    endDate,
    exchangeId,
    exchange,
    branchId,
    branch,
    fromAccount,
    toAccount,
    securityId,
    security,
    volume
  ): any {
    let url =
      "reports/account-activity-summary/participant/" +
      participantId +
      "/from-account/" +
      fromAccount +
      "/to-account/" +
      toAccount +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/exchange-id/" +
      exchangeId +
      "/exchange/" +
      exchange +
      "/branch-id/" +
      branchId +
      "/participant-branch/" +
      branch +
      "/security-id/" +
      securityId +
      "/security/" +
      security +
      "/";
    return this.appUtility.wsGetRequest(url);
  }
  public getAccountActivityDetail(
    participantId,
    startDate,
    endDate,
    exchangeId,
    exchange,
    branchId,
    branch,
    fromAccount,
    toAccount,
    securityId,
    security,
    volume
  ): any {
    let url =
      "reports/account-activity-detail/participant/" +
      participantId +
      "/from-account/" +
      fromAccount +
      "/to-account/" +
      toAccount +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/exchange-id/" +
      exchangeId +
      "/exchange/" +
      exchange +
      "/branch-id/" +
      branchId +
      "/participant-branch/" +
      branch +
      "/security-id/" +
      securityId +
      "/security/" +
      security +
      "/quantity/" +
      volume +
      "/";
    return this.appUtility.wsGetRequest(url);
  }

  /* Participant, client and exchange levies  reports */
  public getClientLevies(
    participantId,
    startDate,
    endDate,
    exchangeId,
    branchId,
    fromAccount,
    toAccount,
    leviesMasterId,
    exchange,
    participantBranch,
    participantLevy
  ): any {
    let url =
      "reports/client-levies-detail/participant/" +
      participantId +
      "/from-account/" +
      fromAccount +
      "/to-account/" +
      toAccount +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/exchange-id/" +
      exchangeId +
      "/exchange/" +
      exchange +
      "/branch-id/" +
      branchId +
      "/participant-branch/" +
      participantBranch +
      "/participant-levy/" +
      participantLevy +
      "/levies-master-id/" +
      leviesMasterId +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  public getParticipantLevies(participantId, exchangeId, exchange): any {
    let url =
      "reports/participant-levies/participant/" +
      participantId +
      "/exchange-id/" +
      exchangeId +
      "/exchange/" +
      exchange +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  public getExchangeLevies(participantId, exchangeId, exchange): any {
    let url =
      "reports/exchange-levies/participant/" +
      participantId +
      "/exchange-id/" +
      exchangeId +
      "/exchange/" +
      exchange +
      "/";

    return this.appUtility.wsGetRequest(url);
  }

  /* Participant commission reports */
  public getParticipantCommisssionSummary(
    participantId,
    startDate,
    endDate
  ): any {
    let url =
      "reports/participant-commission-summary/participant/" +
      participantId +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  /* Participant commission reports */
  public gettrascationDetailSummary(
    participantId,
    securityId,
    clientType,
    startDate,
    endDate
  ): any {
    let url =
      "/reports/transaction-detail/participant/" +
      participantId +
      "/from-date/" +
      startDate +
      "/to-date/" +
      endDate +
      "/security-id/" +
      securityId +
      "/client-type/" +
      clientType +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  public getBondNote(
    participantId,
    securityId,
    startDate,
    endDate,
    csdCharges,
    tradeCharges,
    noteType,
    tradeNumber
  ): any {
      
    let url =
      "/reports/bond-note/participant/" +
      participantId +
      "/from-date/" +
      startDate +
      "/to-date/" +
      endDate +
      "/security-id/" +
      securityId +
     // "/" +
      "/csd-charges/" +
      csdCharges +
      //"/" +
      "/trade-charges/" +
      tradeCharges +
     // "/" +
      "/note-type/" +
      noteType +
    //  "/" +
      "/trade-number/" +
      tradeNumber +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  public getMaturityReport(participantId, securityId, startDate): any {
    let url =
      "/reports/bond-maturity/participant/" +
      participantId +
      "/from-date/" +
      startDate +
      "/security-id/" +
      securityId +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  public getMaturityReportBySecurity(participantId, securityId, startDate,endDate): any {
    
    let url =
      "/reports/bond-maturity_per_security/participant/" +
      participantId +
      "/from-date/" +
      startDate +
   "/to-date/" +
       endDate +
      "/security-id/" +
      securityId +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  public getMaturityReportByClient(participantId, clientId, startDate,endDate): any {
    let url =
      "/reports/bond-maturity_per_client/participant/" +
      participantId +
      "/from-date/" +
      startDate +
   "/to-date/" +
       endDate +
      "/client-id/" +
      clientId +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  public getParticipantCommisssionDetail(
    participantId,
    startDate,
    endDate
  ): any {
    let url =
      "reports/participant-commission-details/participant/" +
      participantId +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/";

    return this.appUtility.wsGetRequest(url);
  }
  public getAgentCommissionSummary(
    participantId,
    startDate,
    endDate,
    agentId,
    agent
  ): any {
    let url =
      "reports/agent-commission/participant/" +
      participantId +
      "/start-date/" +
      startDate +
      "/end-date/" +
      endDate +
      "/agent-id/" +
      agentId +
      "/agent-name/" +
      agent +
      "/";

    return this.appUtility.wsGetRequest(url);
  }

  public getStrongestPerformingInvestments(
    exchangeId,
    securityTypeId,
    reportType
  ): any {
    let url =
      "reports/strongest-per-inv/exchange/" +
      exchangeId +
      "/security-type-id/" +
      securityTypeId +
      "/report-type/" +
      reportType +
      "/";

    return this.appUtility.wsGetRequest(url);
  }

  public getSectorPerformance(exchangeId): any {
    let url = "reports/get-sector-performance/exchange/" + exchangeId + "/";
    return this.appUtility.wsGetRequest(url);
  }
}
