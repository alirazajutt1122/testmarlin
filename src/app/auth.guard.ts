import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService2 } from './services/auth2.service';


/////////////////////////////////////////////////////////////////////////

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // ----------------------------------------------------------------

  constructor(private authService: AuthService2, private router: Router) { }

  // ----------------------------------------------------------------

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    let isAuhtorized: boolean = false;
    if (!this.authService.isLoggedIn()) {
      return this.kickOut();
    }
    switch (state.url) { 
      case '/admin/dashboard-admin':
        return true;

      case '/app/watch/dashboard-oms':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_HOME);
        break;
      case '/app/watch/market-watch':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_EQUITY_MARKET_WATCH_VIEW);
        break;
      case '/app/watch/bond-market-watch':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_BOND_MARKET_WATCH_VIEW);
        break;
      // case '/app/watch/best-price':
      //     return this.isAuhtorized(this.authService.OM_EQUITY_BEST_PRICE_VIEW);

      // case '/app/watch/best-orders':
      //     return this.isAuhtorized(this.authService.OM_EQUITY_BEST_OFFER_VIEW);
      case '/app/reports/working-orders':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_WORKING_ORDERS_VIEW);
        break;
      case '/app/reports/executed-orders':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_EXECUTED_ORDERS_VIEW);
        break;
      case '/app/reports/event-log':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_EVENT_LOG_VIEW);
        break;
      case '/app/reports/exchange-stats':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_EXCHANGE_STATS_VIEW);
        break;
      case '/app/reports/symbol-details':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_SECURITY_DETAILS_VIEW);
        break;
      case '/app/reports/client-margin-details':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_CLIENT_MARGIN_REPORT_VIEW);
        break;
      case '/app/reports/market-summary':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_MARKET_SUMMARY_VIEW);
        break;
      case '/app/reports/bond-payment-schedule':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_BOND_PAYMENT_SCHEDULE_VIEW);
        break;
      case '/app/reports/price-yield-converter':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_BOND_PRICE_YIELD_CONVERTER_VIEW);
        break;
      case '/app/reports/sector-stats':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_SECTOR_STATS_VIEW) || this.authService.isAuhtorized(this.authService.RA_SECOTR_PERFORMANCE_VIEW);
        break;
      case '/app/reports/alerts':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_ALERT_MANAGEMENT_ALERT_VIEW);
        break;
      case '/app/charts/symbol-chart':
        isAuhtorized = this.authService.isAuhtorized(this.authService.OM_REPORTS_SECURITY_CHART_VIEW);
        break;

      // Research & Analysis module
      case '/app/backoffice/dashboard-bbo':
        return true; // this.isAuhtorized(this.authService.EB_HOME);
      // break;
      case '/app/analysis/financial_result_announcement':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_FINANCIAL_RESULTS_VIEW);
        break;
      case '/app/analysis/meeting_announcement':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_MEETING_VIEW);
        break;
      case '/app/analysis/other_announcement':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_OTHERS_VIEW);
        break;
      case '/app/analysis/portfolio-return':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_PORTFOLIO_RETURN_VIEW);
        break;
      case '/app/analysis/historical-payouts-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_HISTORICAL_PAYOUTS_VIEW);
        break;
      case '/app/analysis/yearly-assets-history-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_YEARLY_ASSETS_HISTORY_VIEW);
        break;
      case '/app/analysis/yearly-dividend-comparison-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_YEARLY_DIVIDEND_COMPARISION_VIEW);
        break;
      case '/app/analysis/security-lookup-quote-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_SEC_LOOKUP_QUOTE_VIEW);
        break;
      case '/app/analysis/dividend-details-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_DIVIDEND_DETAILS_VIEW);
        break;
      case '/app/analysis/stock-comparison-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_STOCK_COMPARISON_VIEW);
        break;
      case '/app/analysis/stock-screener-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_STOCK_SCREENER_VIEW);
        break;
      case '/app/analysis/portfolio-analysis-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_PORTFOLIO_ANALYSIS_VIEW);
        break;
      case '/app/analysis/strongest-performing-investments-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_STRONGEST_INVESTMENTS_VIEW);
        break;
      case '/app/analysis/financial-uploader':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_MIGRATORS_FINANCIAL_ANNOUNCEMENT_NEW);
        break;
      case '/app/analysis/meeting-uploader':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_MIGRATORS_MEETING_ANNOUNCEMENT_NEW);
        break;
      case '/app/analysis/other-uploader':
        isAuhtorized = this.authService.isAuhtorized(this.authService.RA_MIGRATORS_OTHER_ANNOUNCEMENT_NEW);
        break;
      // case '/app/reports/sector-stats':
      //   isAuhtorized = this.authService.isAuhtorized(this.authService.RA_SECOTR_PERFORMANCE_VIEW);
      //   break;

      //  Access Control
      case '/app/access-control/user-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_ACCESS_CONTROL_USER_VIEW);
        break;
      case '/app/access-control/role-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_ACCESS_CONTROL_ROLE_VIEW);
        break;
      case '/app/access-control/role-privs-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_ACCESS_CONTROL_PRIVILEGE_VIEW);
        break;

      //  Back-Office module
      case '/app/backoffice/dashboard-bbo':
        return true; // this.isAuhtorized(this.authService.EB_HOME);
      // break;
      case '/app/equities/transaction-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_EQUITY_TRANSACTION_VIEW);
        break;
      case '/app/equities/settlement-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_EQUITY_SETTLEMENT_VIEW);
        break;
      case '/app/setup/agent-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_AGENT_VIEW);
        break;
      case '/app/setup/bank-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_BANKS_VIEW);
        break;
      case '/app/setup/bank-branches-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_BANK_BRANCHES_VIEW);
        break;
      case '/app/setup/broker-branches-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_PARTICIPANT_BRANCH_VIEW);
        break;
      case '/app/setup/account-opening-balance-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_ACC_OPENING_BALANCE_VIEW);
        break;
      case '/app/setup/commission-slab-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_COMMISSION_SLAB_VIEW);
        break;
      case '/back-office/setup/client-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_CLIENTS_VIEW);
        break;
      case '/app/setup/client-request-approval':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_CLIENTS_VIEW);
        break;
      case '/app/setup/client-detailed-request-approval':
          isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_CLIENTS_VIEW);
          break;
        // case '/app/setup/client-request-approval':
        // isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_AR_NEW);
        // break;
      case '/app/setup/client-levy-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_LEVIES_VIEW);
        break;
      case '/app/financials/cheque-clearance-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_VOUCHER_CHEQUE_CLEARANCE);
        break;
      case '/app/setup/voucher-type-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_VOUCHER_TYPE_VIEW);
        break;
      case '/app/setup/rda-clients':
          isAuhtorized = this.authService.isAuhtorized(this.authService.EB_RDA_CLIENTS_VIEW);
          break;
      case '/app/financials/fiscal-year':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_FISCAL_YEAR_VIEW);
        break;
      case '/app/financials/voucher-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_VOUCHER_VIEW);
        break;
      case '/app/financials/chart-of-account':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_CHART_OF_ACCOUNT_VIEW);
        break;
      case '/app/financials/compute-aging-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_COMPUTE_AGING_VIEW);
        break;
      case '/app/setup/application-setup-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_APPLICATION_SETUP_VIEW);
        break;
      case '/app/setup/terminal-binding-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_TERMINAL_BIND_VIEW);
        break;
      case '/app/vault/stock-deposit-withdraw':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_VAULT_DEPOSIT_WITHDRAW_VIEW);
        break;
      case '/app/vault/stock-pledge-release':
        // isAuhtorized = this.authService.isAuhtorized(this.authService.EB_VAULT_DEPOSIT_WITHDRAW_VIEW);
        isAuhtorized = true;
        break;
      case '/app/vault/physical-stock':
        // isAuhtorized = this.authService.isAuhtorized(this.authService.EB_VAULT_DEPOSIT_WITHDRAW_VIEW);
        isAuhtorized = true;
        break;
      case '/app/vault/portfolio-movement':
        // isAuhtorized = this.authService.isAuhtorized(this.authService.EB_VAULT_DEPOSIT_WITHDRAW_VIEW);
        isAuhtorized = true;
        break;

      case '/app/vault/share-holding-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SHARE_HOLDING_REPORT_VIEW);
        break;

      case '/app/vault/client-pre-settlement-delivery-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_VAULT_CLIENT_PRE_SETTLEMENT_DELIVERY_REPORT_VIEW);
        break;

      case '/app/setup/participant-security-params-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SECURITY_HAIRCUT_VIEW);
        break;
      case '/app/setup/security-daily-indicator-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SYMBOL_DAILY_INDICATOR_VIEW);
        break;
      case '/app/setup/broadcast-sms-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONF_BROADCAST_SMS_VIEW);
        break;
      case '/app/setup/sro-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SRO_VIEW);
        case '/app/setup/sro-data-file':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SRO_FILE_VIEW);
        break;
        case '/app/setup/sro-data-entry':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SRO_ENTRY_VIEW);
        break;
        case '/app/setup/demo-sro-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SRO_ENTRY_VIEW);
        break;
      case '/app/migrator/client-holding-uploader-page':
        // isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_CL_HOLDING_NEW);
        isAuhtorized = false;
        break;
      case '/app/migrator/agent-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_AGENT_NEW);
        break;
      case '/app/migrator/commission-slab-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_COMMISSION_SALB_NEW);
        break;
      case '/app/migrator/clients-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_CLIENTS_LOADER_NEW);
        break;
      case '/app/migrator/coa-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_COA_NEW);;
        break;
      case '/app/migrator/chart-of-accounts-uploader-page':
        isAuhtorized = false;
        break;
      case '/app/migrator/transactions-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_TRANSACTIONS_NEW);
        break;
      case '/app/migrator/closing-rates-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_CLOSING_RATES_NEW);
        break;
      case '/app/migrator/var-and-security-haircut':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_VAR_AND_SECURITY_HAIRCUT_NEW);
        break;
      case '/app/migrator/voucher':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_VOUCHER_NEW);
        break;
      case '/app/migrator/vault':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_VAULT_STOCK_DEPOSIT_WITHDRAWL_NEW);
        break;
      case '/app/migrator/clients-setup-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_CLIENTS_SETUP_NEW);
        break;
      case '/app/migrator/future-open-trade-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_FUTURE_OPEN_TRADE_VIEW);
        break;
      case '/app/migrator/capital-gain-tax-uploader-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_CAP_GAIN_TAX_NEW);
        break;
      case '/app/migrator/export-file':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MIGRATORS_EXPORT_FILE_REPORT_VIEW);
        break;
      case '/app/reconcilation/bank-reconcilation':
         isAuhtorized = this.authService.isAuhtorized(this.authService.EB_VAULT_DEPOSIT_WITHDRAW_VIEW);
       // isAuhtorized = true;
        break;
      case '/app/reconcilation/cdc-reconcilation':
        //isAuhtorized = true
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_RECONCILIATION_CDC_REPORT_VIEW);
        break;
      case '/app/reconcilation/clients-cash':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_RECONCILIATION_CLIENTS_CASH_REPORT_VIEW);
        break;
      case '/app/reconcilation/cdc-client-assets-segregation':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CLIENT_ASSETS_SEGREGATION_REPORT_VIEW);
        break;

      case '/app/financials/client-status-rpt':
        // isAuhtorized = true;
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CLIENT_STATUS_REPORT_VIEW);
        break;
      // BBO reports
      case '/app/financials/chart-of-account-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CHART_OF_ACCOUNT_REPORT_VIEW);
        break;
      case '/app/financials/client-aging-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CLIENT_AGING_REPORT_VIEW);
        break;
        
      case '/app/financials/net-capital-balance-rpt':
        // isAuhtorized = true;
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_NET_CAPITAL_BALANCE_VIEW);
        break;
      case '/app/financials/net-capital-detail-rpt':
        // isAuhtorized = true;
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_NET_CAPITAL_DETAIL_VIEW);
        break;
      case '/app/financials/liquid-capital-balance-rpt':
        // isAuhtorized = true;
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_LIQUID_CAPITAL_BALANCE_VIEW);
        break;
      case '/app/financials/voucher-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_VOUCHER_LIST_REPORT_VIEW);
        break;
      case '/app/financials/client-list-rpt':
        // isAuhtorized = true;
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CLIENT_LIST_REPORT_VIEW);
        break;
      case '/app/financials/export-file':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_IBTS_REPORT_VIEW);
        break;
      case '/app/vault/stock-receipt-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_STOCK_RECEIPT_REPORT_VIEW);
        break;
      case '/app/vault/stock-activity-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_STOCK_ACTIVITY_REPORT_VIEW);
        break;
      case '/app/vault/stock-activity-pledge-release-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_PLEDGE_RELEASE_REPORT_VIEW);
        break;
      case '/app/financials/general-ledger-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_GENERAL_LEDGER_REPORT_VIEW);
        break;
      case '/app/financials/trial-balance-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_TRIAL_BALANCE_REPORT_VIEW);
        break;
      case '/app/financials/cash-flow-statement-rpt':
        // isAuhtorized = this.authService.isAuhtorized(this.authService.EB_TRIAL_BALANCE_REPORT_VIEW);
        isAuhtorized = true;
        break;
      case '/app/financials/profit-loss-statement-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_PROFIT_LOSS_REPORT_VIEW);
        break;
      case '/app/financials/balance-sheet-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_BALANCE_SHEET_REPORT_VIEW);
        break;
      case '/app/financials/clients-cash-balance-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CLIENT_CASH_BALANCE_VIEW);
        break;
      case '/app/financials/capital-gain-tax-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CGT_REPORT_VIEW);
        break;
        case '/app/financials/complience-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_COMPLIENCE_RPT_VIEW);
        break;
        case '/app/financials/customer-risk-type-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_CRT_REPORT_VIEW);
        break;
        case '/app/financials/wire-transfer-activity-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_WTA_REPORT_VIEW);
        break;
        case '/app/financials/product-services-transactions-rpt':
          isAuhtorized = this.authService.isAuhtorized(this.authService.EB_FINANCIALS_PST_REPORT_VIEW);
          break;
      case '/app/equities/trade-confirmation-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CONTRACT_NOTE_REPORT_VIEW);
        break;
      case '/app/equities/account-holding-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_ACCOUNT_HOLDING_SUMMARY_REPORT_VIEW);
        break;
      case '/app/equities/client-last-activity-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CLIENT_LAST_ACTIVITY_REPORT_VIEW);
        break;
      case '/app/equities/securitywise-client-activity-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SEC_CLIENT_ACTIVITY_SUMMARY_REPORT_VIEW) || this.authService.isAuhtorized(this.authService.EB_SEC_CLIENT_ACTIVITY_DETAIL_REPORT_VIEW);
        break;
      case '/app/equities/account-activity-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_ACCOUNT_ACTIVITY_SUMMARY_REPORT_VIEW) || this.authService.isAuhtorized(this.authService.EB_ACCOUNT_ACTIVITY_DETAIL_REPORT_VIEW);
        break;
      case '/app/equities/account-margin-detail-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MARGIN_DETAIL_REPORT_VIEW);
        break;
      case '/app/equities/broker-client-delivery-money-obligation-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_PART_MONEY_OBL_REPORT_VIEW) || this.authService.isAuhtorized(this.authService.EB_PART_DEL_OBL_REPORT_VIEW) ||
          this.authService.isAuhtorized(this.authService.EB_CL_DEL_OBL_REPORT_VIEW) || this.authService.isAuhtorized(this.authService.EB_CL_MONEY_OBL_REPORT_VIEW);
        break;
      case '/app/equities/client-levies-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CL_LEVIES_DL_REPORT_VIEW) || this.authService.isAuhtorized(this.authService.EB_PE_LEVIES_REPORT_VIEW);
        break;
      case '/app/equities/participant-levies-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_PE_LEVIES_REPORT_VIEW);
        break;
      case '/app/equities/participant-commission-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_PART_COMMISSION_REPORT_VIEW);
        break;
      case '/app/equities/agent-commission-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_AGENT_COMMISSION_REPORT_VIEW);
        break;
      case '/app/equities/client-gain-loss-rpt':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CL_GN_LS_REPORT_VIEW);
        break;

      //  Marlin Admin      
      case '/admin/exchange-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_EXCHANGE_VIEW);
        break;
      case '/admin/settlement-type-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SETTLEMENT_TYPE_VIEW);
        break;
      case '/admin/market-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_MARKET_VIEW);
        break;
      case '/admin/settlement-calander-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SETTLEMENT_CALENDAR_VIEW);
        break;
      case '/admin/exch-mark-association-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_EXC_MKT_ASSOCIATION_VIEW);
        break;
      case '/admin/sector-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_SECTOR_VIEW);
        break;
      case '/admin/country-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_COUNTRY_VIEW);
        break;
      case '/admin/city-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CITY_VIEW);
        break;
      case '/admin/security-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_COMPANY_VIEW);
        break;
      case '/admin/registrar-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_REGISTRAR_VIEW);
        break;
      case '/admin/exch-mark-security-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_EX_MKT_SEC_VIEW);
        break;
      case '/admin/holidays-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_HOLIDAY_VIEW);
        break;
      case '/admin/participant-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_PARTICIPANT_VIEW);
        break;
      case '/admin/clear-house-levies-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_CLEARING_HOUSE_LEVIES_VIEW);
        break;
      case '/admin/reset-participant-page':
        isAuhtorized = this.authService.isAuhtorized(this.authService.EB_PARTICIPANT_RESET_VIEW);
        break;
      default:
        isAuhtorized = false;
    }

    return isAuhtorized ? true : this.kickOut();
  }

  // ----------------------------------------------------------------

  private kickOut(): boolean {
    alert('Access Denied!');
    this.authService.logout();
    this.router.navigate(['login']);
    return false;
  }
}
