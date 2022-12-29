'use strict';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';

import { AuthService2 } from '../services/auth2.service'
import { ReportParams } from '../models/report-params';
import { Params } from '../models/report-params';
import { AppUtility } from '../app.utility';

import { RestService } from './api/rest.service';



@Injectable({
    providedIn: 'root'
})
export class ReportService {

    errorMessage: string = '';

    constructor(private restService:RestService) {

    }

    public getChartOfAccounts(params: ReportParams,lang): any {
        let url = 'reports/chart-of-account' + '/lang/' + lang +'/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getVouchers(params: ReportParams,lang): any {
        let url = 'reports/voucher-printing'+ '/lang/' + lang +'/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getVouchersForBanks(params: ReportParams,lang): any {
        let url = 'reports/voucher-printing-client'+ '/lang/' + lang +'/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getVouchersForSMS(participantId,voucherTypeIds,vouNo,startDate,endDate): any {
        let url = 'sms/voucher-sms-client/participant/' + participantId + '/voucherTypeIds/' + voucherTypeIds + '/vouNo/' + vouNo + '/start-date/' + startDate + '/end-date/' + endDate + '/';
        return this.restService.get(true,url);
    }

    public getStockReceiptDeposit(params: ReportParams,lang): any {
        let url = 'reports/stock-deposit-receipt' + '/lang/' + lang +'/';
        AppUtility.printConsole(params);
        console.log(JSON.stringify(params))
        return this.restService.post(true,url, params);
    }
    public getStockReceiptWithdraw(params: ReportParams,lang): any {
        let url = 'reports/stock-withdraw-receipt' + '/lang/' + lang +'/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getStockActivity(participantId, securityId, security, startDate, endDate, fromAccount, toAccount, exchangeId,exchange,lang): any {
        let url = 'reports/stock-activity/participant/' + participantId + '/security-id/' + securityId + '/security/' + security + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/'+ exchange  + '/lang/' + lang +'/';
        //AppUtility.printConsole(params);
        //let url = 'reports/stock-activity/participant/1/security/2/from-account/SDCB1145/to-account/SDCB7680/start-date/2016-12-01/end-date/2017-12-01/';
        return this.restService.get(true,url);
    }

    public getStockActivityPledgeRelease(participantId, securityId, security, startDate, fromAccount, toAccount, exchangeId,exchange,reportType,lang): any {
        let url = 'reports/stock-activity-pledge-release/participant/' + participantId + '/security-id/' + securityId + '/security/' + security + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/exchange-id/' + exchangeId + '/exchange/'+ exchange + '/reportType/'+ reportType + '/lang/' + lang +'/';
        //AppUtility.printConsole(params);
        //let url = 'reports/stock-activity/participant/1/security/2/from-account/SDCB1145/to-account/SDCB7680/start-date/2016-12-01/end-date/2017-12-01/';
        return this.restService.get(true,url);
    }

    public getHistoricalPayouts(params: ReportParams): any {
        let url = 'reports/historic-payouts/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getHistoricalPayoutsGrid(participantId, secList): any {
        let url = 'reports/historical-payouts/participantId/' + participantId + '/securitiesList/' + secList;
        return this.restService.get(true,url);
    }

    public getStockComparisonFundamentals(params: ReportParams): any {
        let url = 'reports/stock-comparison-fundamentals/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getStockComparisonFundamentalsGrid(participantId, secList): any {
        let url = 'reports/stock-comparison-fundamentals/participantId/' + participantId + '/securitiesList/' + secList;
        return this.restService.get(true,url);
    }

    public getStockComparisonED(params: ReportParams): any {
        let url = 'reports/stock-comparison-ed/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getStockComparisonEDGrid(participantId, secList): any {
        let url = 'reports/stock-comparision-earning_and_dividend/participantId/' + participantId + '/securitiesList/' + secList;
        return this.restService.get(true,url);
    }

    public getStockScreenerFundamentals(params: ReportParams): any {
        let url = 'reports/stock-screener-fundamentals/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getStockScreenerFundamentalsGrid(participantId, secList): any {
        let url = 'reports/stock-screener-fundamentals/participantId/' + participantId + '/securitiesList/' + secList;
        return this.restService.get(true,url);
    }

    public getStockScreenerED(params: ReportParams): any {
        let url = 'reports/stock-screener-ed/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getStockScreenerEDGrid(participantId, secList): any {
        let url = 'reports/stock-screener-earning-and-dividend/participantId/' + participantId + '/securitiesList/' + secList;
        return this.restService.get(true,url);
    }

    public getYearlyAssetsHistory(params: ReportParams): any {
        let url = 'reports/yearly-assets-history/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getYearlyAssetsHistoryGrid(participantId, yearEnd, periodsList, secList): any {
        let url = 'reports/yearly-assets-history/participantId/' + participantId + '/yearEndList/' + yearEnd + '/periodsList/' + periodsList + '/securitiesList/' + secList;
        return this.restService.get(true,url);
    }

    public getYearlyDividendComparison(params: ReportParams): any {
        let url = 'reports/yearly-dividend-comparison/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getYearlyDividendComparisonGrid(participantId, yearEnd, periodsList, secList): any {
        let url = 'reports/yearly-dividend-comparision/participantId/' + participantId + '/yearEndList/' + yearEnd + '/periodsList/' + periodsList + '/securitiesList/' + secList;
        return this.restService.get(true,url);
    }

    public getPortfolioAnalysis(params: ReportParams): any {
        let url = 'reports/portfolio-analysis/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }

    public getPortfolioAnalysisGrid(yearEnd, periodsList, secList): any {
        let url = 'reports/portfolio-analysis/yearEndList/' + yearEnd + '/periodsList/' + periodsList + '/securitiesList/' + secList;
        return this.restService.get(true,url);
    }

    public getTradeConfirmation(participantId, startDate, endDate, exchangeId, fromAccount, toAccount,lang): any {
        let url = 'reports/trade-confirmation/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/lang/' + lang +'/';
            
        return this.restService.get(true,url);
    }

    public getCGT(participantId, startDate, endDate, exchangeId, exchangeName, fromAccount, toAccount,reportType,marketType,lang): any {
        let url = 'reports/capital-gain-tax/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
        + '/exchange-id/' + exchangeId + '/exchange-name/' + exchangeName + '/start-date/' + startDate + '/end-date/' + endDate + '/report-type/' + reportType + '/market-type/' + marketType  + '/lang/' + lang +'/'
        return this.restService.get(true,url);
    }

    public getClientsGainLoss(participantId, exchangeId, exchangeName, fromAccount, toAccount, startDate, endDate,lang): any {
        let url = 'reports/clients-gain-loss/participant/' + participantId + '/exchange-id/' + exchangeId + '/exchange-name/' +
            exchangeName + '/from-client/' + fromAccount + '/to-client/' + toAccount + '/from-date/' + startDate + '/to-date/' +
            endDate  + '/lang/' + lang +'/';
        return this.restService.get(true,url);
    }

    //  for financial => Reports => Clients Cash Balance
    public getClientsCashBalanceReport(PID_: number, client_: number, balance_: string, exchangeId, exchangeName, fromAccount, toAccount, startDate, branchId, branch, agentId, agent,reportType,lang): Observable<Object[]> {
        let url = 'reports/clients-cash-balance/participant/' + PID_ + '/balance/' +
            balance_ + '/clients/' + client_ + '/exchange-id/' + exchangeId + '/exchange-name/' +
            exchangeName + '/from-client/' + fromAccount + '/to-client/' + toAccount + '/from-date/' + startDate + '/branch-id/' + branchId + '/participant-branch/' + branch + '/agent-id/' + agentId + '/agent/' + agent + '/report-type/' + reportType + '/lang/' + lang +'/';
        return this.restService.get(true,url);
    }

    public getClientStatusRpt(participantId: Number, clientCode: string, exchangeId, exchangeName): Observable<Object[]> {
        let urlString = 'reports/clients/participant/' + participantId + '/clientCode/' + clientCode + '/exchange-id/' + exchangeId + '/exchange-name/' + exchangeName + '/';
        return this.restService.get(true,urlString);
    }

    public getAccountHolding(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent,lang): any {
        let url = 'reports/account-holding-summary/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent  + '/lang/' + lang +'/'
        return this.restService.get(true,url);
    }

    public getAccountHoldingFormat1(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent,mail,lang): any {
        let url = 'reports/account-holding-summary-format1/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/mail/' + mail  + '/lang/' + lang +'/'
        return this.restService.get(true,url);
    }


    public getAccountHoldingFormat2(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent,mail,lang): any {
        let url = 'reports/account-holding-summary-format2/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/mail/' + mail + '/lang/' + lang +'/'
        return this.restService.get(true,url);
    }

    public getClientAgingCredit(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount): any {
        let url = 'reports/client-aging-credit/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/';
        return this.restService.get(true,url);
    }

    public getClientAgingDebit(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount): any {
        let url = 'reports/client-aging-debit/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/';
        return this.restService.get(true,url);
    }

    public getAccountMarginDetail(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, closePriceDate, agentId, agent,active,reportType,lang): any {
        let url = 'reports/account-margin-detail/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/closing-price-date/' + closePriceDate + '/agent-id/' + agentId + '/agent/' + agent + '/active/' + active + '/reportType/' + reportType  + '/lang/' + lang +'/';
        return this.restService.get(true,url);
    }  

    public getShareHoldingClientWise(participantId, startDate, endDate,tradeDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, closePriceDate, netHolding,reportFormat,lang): any {
        let url = 'reports/share-holding-client-wise/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/trade-date/' + tradeDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/closing-price-date/' + closePriceDate + '/net-holding-type/' + netHolding + '/report-format/' + reportFormat  + '/lang/' + lang +'/';
        return this.restService.get(true,url);
    }

    public getShareHoldingSecurityWise(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, closePriceDate, netHolding,reportFormat,lang): any {
        let url = 'reports/share-holding-security-wise/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/closing-price-date/' + closePriceDate + '/net-holding-type/' + netHolding + '/report-format/' + reportFormat  + '/lang/' + lang +'/';
            return this.restService.get(true,url);
    }

    public getShareHoldingSecurityWiseSummary(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, closePriceDate, netHolding,reportFormat,lang): any {
        let url = 'reports/share-holding-security-wise-summary/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/closing-price-date/' + closePriceDate + '/net-holding-type/' + netHolding + '/report-format/' + reportFormat  + '/lang/' + lang +'/';
        return this.restService.get(true,url);
    }

    public getClientLastActivity(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent,mail,lang): any {
        let url = 'reports/client-last-activity/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/mail/' + mail + '/lang/' + lang +'/';
        return this.restService.get(true,url);
    }
    public getClientLastActivityWithEmail(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent): any {
        let url = 'email/client-last-activity/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/';
        return this.restService.get(true,url);
    }
    public getAccountHoldingFormat1withEmail(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent,lang): any {
        let url = 'email/account-holding-summary-format1/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/lang/' + lang +'/'
        return this.restService.get(true,url);
    }
    public getAccountHoldingFormat2WithEmail(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent,lang): any {
        let url = 'email/account-holding-summary-format2/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/lang/' + lang +'/'
        return this.restService.get(true,url);
    }
    public getSecurityWiseClientActivityDetailWithEmail(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, volume, agentId, agent, transTypeId, transType, lang): any {
        let url = 'email/securitywise-client-activity-detail/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/transType-id/' + transTypeId + '/transType/' + transType + '/lang/' + lang + '/';
        return this.restService.get(true,url);
    }
    public getAccountActivitySummary(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, volume,lang): any {
        let url = 'reports/account-activity-summary/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security  + '/lang/' + lang +'/'
        return this.restService.get(true,url);
    }

    public getAccountActivityDetail(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, volume,lang): any {
        let url = 'reports/account-activity-detail/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/quantity/' + volume  + '/lang/' + lang +'/';
        return this.restService.get(true,url);
    }

    public getAccountActivityDetailwithSMS(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, volume): any {
        let url = 'sms/account-activity-detail/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/quantity/' + volume ;
        return this.restService.get(true,url);
    }
    public getAccountHoldingwithSMS(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent,lang): any {
        let url = 'sms/account-holding-summary/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/lang/' + lang +'/'
            return this.restService.get(true,url);
    }
    public getAccountHoldingwithActiveSMS(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, agentId, agent,lang): any {
        let url = 'sms/active/account-holding-summary/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/lang/' + lang +'/'
            return this.restService.get(true,url);
    }
    public getSecurityWiseClientActivitySummary(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, volume, agentId, agent, transTypeId, transType,lang): any {
        let url = 'reports/securitywise-client-activity-summary/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/transType-id/' + transTypeId + '/transType/' + transType + '/lang/' + lang +'/';
        return this.restService.get(true,url);
    }

    public getSecurityWiseClientActivityDetail(participantId, startDate, endDate, exchangeId, exchange, branchId, branch, fromAccount, toAccount, securityId, security, volume, agentId, agent, transTypeId, transType, lang): any {
        let url = 'reports/securitywise-client-activity-detail/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate + '/exchange-id/' + exchangeId + '/exchange/' + exchange
            + '/branch-id/' + branchId + '/participant-branch/' + branch + '/security-id/' + securityId + '/security/' + security + '/agent-id/' + agentId + '/agent/' + agent + '/transType-id/' + transTypeId + '/transType/' + transType + '/lang/' + lang + '/';
        return this.restService.get(true,url);
    }

    /* Participant, client and exchange levies  reports */
    public getClientLevies(participantId, startDate, endDate, exchangeId, branchId, fromAccount, toAccount, leviesMasterId, exchange, participantBranch, participantLevy,lang): any {
        let url = 'reports/client-levies-detail/participant/' + participantId + '/from-account/' + fromAccount + '/to-account/' + toAccount
            + '/start-date/' + startDate + '/end-date/' + endDate
            + '/exchange-id/' + exchangeId + '/exchange/' + exchange + '/branch-id/' + branchId + '/participant-branch/' + participantBranch + '/participant-levy/' + participantLevy + '/levies-master-id/' + leviesMasterId  + '/lang/' + lang +'/';

        return this.restService.get(true,url);
    }
    public getParticipantLevies(participantId, exchangeId, exchange,lang): any {
        let url = 'reports/participant-levies/participant/' + participantId
            + '/exchange-id/' + exchangeId + '/exchange/' + exchange  + '/lang/' + lang +'/';

        return this.restService.get(true,url);
    }
    public getExchangeLevies(participantId, exchangeId, exchange,lang): any {
        let url = 'reports/exchange-levies/participant/' + participantId
            + '/exchange-id/' + exchangeId + '/exchange/' + exchange + '/lang/' + lang +'/';

        return this.restService.get(true,url);
    }

    /* Participant commission reports */
    public getParticipantCommisssionSummary(participantId, startDate, endDate,lang): any {
        let url = 'reports/participant-commission-summary/participant/' + participantId
            + '/start-date/' + startDate + '/end-date/' + endDate  + '/lang/' + lang +'/';

        return this.restService.get(true,url);
    }
    public getParticipantCommisssionDetail(participantId, startDate, endDate,lang): any {
        let url = 'reports/participant-commission-details/participant/' + participantId
            + '/start-date/' + startDate + '/end-date/' + endDate + '/lang/' + lang +'/';

        return this.restService.get(true,url);
    }
    public getAgentCommissionSummary(participantId, startDate, endDate, agentId, agent,reportType,lang): any {
        let url = 'reports/agent-commission/participant/' + participantId
            + '/start-date/' + startDate + '/end-date/' + endDate + '/agent-id/' + agentId
            + '/agent-name/' + agent + '/report-type/' + reportType + '/lang/' + lang +'/';

        return this.restService.get(true,url);
    }

    public getStrongestPerformingInvestments(exchangeId, securityTypeId, reportType): any {
        let url = 'reports/strongest-per-inv/exchange/' + exchangeId
            + '/security-type-id/' + securityTypeId + '/report-type/' + reportType + '/';

        return this.restService.get(true,url);
    }

    public getSectorPerformance(exchangeId): any {
        let url = 'reports/get-sector-performance/exchange/' + exchangeId + '/';
        return this.restService.get(true,url);
    }

    public getSRO(params: ReportParams): any {
        let url = 'reports/sro/';
        AppUtility.printConsole(params);
        return this.restService.post(true,url, params);
    }
}



