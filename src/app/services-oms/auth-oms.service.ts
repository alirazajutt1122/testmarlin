import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import * as io from 'socket.io-client';
const io = require("socket.io-client");
import { map,catchError } from 'rxjs/operators';
import { AppConstants, AppUtility } from 'app/app.utility';
import { environment } from 'environments/environment';




let jwtDecode = require('jwt-decode');

/////////////////////////////////////////////////////////////

@Injectable()
export class AuthService {
  public readonly OM_EQUITY_MARKET_WATCH_VIEW: string = '101';
  public readonly OM_EQUITY_BEST_OFFER_VIEW: string = '102';
  public readonly OM_EQUITY_BEST_PRICE_VIEW: string = '103';
  public readonly OM_BOND_MARKET_WATCH_VIEW: string = '104';
  public readonly OM_BOND_BEST_OFFER_VIEW: string = '105';
  public readonly OM_BOND_BEST_PRICE_VIEW: string = '106';
  public readonly OM_REPORTS_WORKING_ORDERS_VIEW: string = '107';
  public readonly OM_REPORTS_EXECUTED_ORDERS_VIEW: string = '108';
  public readonly OM_REPORTS_EVENT_LOG_VIEW: string = '109';
  public readonly OM_REPORTS_SECURITY_DETAILS_VIEW: string = '110';
  public readonly OM_REPORTS_EXCHANGE_STATS_VIEW: string = '111';
  public readonly OM_REPORTS_CLIENT_MARGIN_REPORT_VIEW: string = '112';
  public readonly OM_REPORTS_MARKET_SUMMARY_VIEW: string = '113';
  public readonly OM_REPORTS_SECTOR_STATS_VIEW: string = '114';
  public readonly OM_EQUITY_ORDER_NEW: string = '115';
  public readonly OM_EQUITY_ORDER_CHANGE: string = '116';
  public readonly OM_EQUITY_ORDER_CANCEL: string = '117';
  public readonly OM_BOND_ORDER_NEW: string = '118';
  public readonly OM_BOND_ORDER_CHANGE: string = '119';
  public readonly OM_BOND_ORDER_CANCEL: string = '120';
  public readonly OM_ALERT_MANAGEMENT_ALERT_NEW: string = '121';
  public readonly OM_ALERT_MANAGEMENT_ALERT_UPDATE: string = '122';
  public readonly OM_ALERT_MANAGEMENT_ALERT_VIEW: string = '123';
  public readonly OM_ALERT_MANAGEMENT_ALERT_DELETE: string = '124';
  public readonly OM_BOND_PAYMENT_SCHEDULE_VIEW: string = '125';
  public readonly OM_BOND_PRICE_YIELD_CONVERTER_VIEW: string = '126';
  public readonly OM_REPORTS_SECURITY_CHART_VIEW: string = '127';
  public readonly OM_HOME: string = '128';


  public readonly OM_REPORTS_BOND_WORKING_ORDERS_VIEW: string = '910';
  public readonly OM_REPORTS_BOND_EXECUTED_ORDERS_VIEW: string = '911';
  public readonly OM_REPORTS_BOND_SECURITY_DETAILS_VIEW: string = '131';
  public readonly OM_REPORTS_BOND_EVENT_LOG_VIEW: string = '912';

  public readonly EB_EXCHANGE_NEW: string = '301';
  public readonly EB_EXCHANGE_UPDATE: string = '302';
  public readonly EB_EXCHANGE_VIEW: string = '303';
  public readonly EB_SETTLEMENT_TYPE_UPDATE: string = '304';
  public readonly EB_SETTLEMENT_TYPE_NEW: string = '305';
  public readonly EB_SETTLEMENT_TYPE_VIEW: string = '306';
  public readonly EB_MARKET_NEW: string = '307';
  public readonly EB_MARKET_UPDATE: string = '308';
  public readonly EB_MARKET_VIEW: string = '309';
  public readonly EB_PARTICIPANT_NEW: string = '310';
  public readonly EB_PARTICIPANT_UPDATE: string = '311';
  public readonly EB_PARTICIPANT_VIEW: string = '312';
  public readonly EB_SETTLEMENT_CALENDAR_NEW: string = '313';
  public readonly EB_SETTLEMENT_CALENDAR_UPDATE: string = '314';
  public readonly EB_SETTLEMENT_CALENDAR_VIEW: string = '315';
  public readonly EB_CLEARING_HOUSE_LEVIES_NEW: string = '316';
  public readonly EB_CLEARING_HOUSE_LEVIES_UPDATE: string = '317';
  public readonly EB_CLEARING_HOUSE_LEVIES_VIEW: string = '318';
  public readonly EB_EXC_MKT_ASSOCIATION_NEW: string = '319';
  public readonly EB_EXC_MKT_ASSOCIATION_UPDATE: string = '320';
  public readonly EB_EXC_MKT_ASSOCIATION_VIEW: string = '321';
  public readonly EB_HOLIDAY_NEW: string = '322';
  public readonly EB_HOLIDAY_UPDATE: string = '323';
  public readonly EB_HOLIDAY_VIEW: string = '324';
  public readonly EB_SECURITY_VIEW: string = '325';
  public readonly EB_COMPANY_NEW: string = '326';
  public readonly EB_COMPANY_UPDATE: string = '327';
  public readonly EB_COMPANY_VIEW: string = '328';
  public readonly EB_REGISTRAR_NEW: string = '329';
  public readonly EB_REGISTRAR_UPDATE: string = '330';
  public readonly EB_REGISTRAR_VIEW: string = '331';
  public readonly EB_SECTOR_NEW: string = '332';
  public readonly EB_SECTOR_UPDATE: string = '333';
  public readonly EB_SECTOR_VIEW: string = '334';
  public readonly EB_COUNTRY_NEW: string = '335';
  public readonly EB_COUNTRY_UPDATE: string = '336';
  public readonly EB_COUNTRY_VIEW: string = '337';
  public readonly EB_CITY_NEW: string = '338';
  public readonly EB_CITY_UPDATE: string = '339';
  public readonly EB_CITY_VIEW: string = '340';
  public readonly EB_CURRENCY_NEW: string = '341';
  public readonly EB_CURRENCY_UPDATE: string = '342';
  public readonly EB_CURRENCY_VIEW: string = '343';
  public readonly EB_EQUITY_TRANSACTION_NEW: string = '344';
  public readonly EB_EQUITY_TRANSACTION_UPDATE: string = '345';
  public readonly EB_EQUITY_TRANSACTION_VIEW: string = '346';
  public readonly EB_EQUITY_TRANSACTION_CANCEL: string = '347';
  public readonly EB_EQUITY_TRANSACTION_POST: string = '348';
  public readonly EB_EQUITY_TRANSACTION_UN_POST: string = '349';
  public readonly EB_EQUITY_SETTLEMENT_VIEW: string = '350';
  public readonly EB_EQUITY_SETTLEMENT_PROCESS: string = '351';
  public readonly EB_EQUITY_SETTLEMENT_REVERSE: string = '352';
  public readonly EB_CONTRACT_NOTE_REPORT_VIEW: string = '353';
  public readonly EB_VAULT_DEPOSIT_WITHDRAW_NEW: string = '354';
  public readonly EB_VAULT_DEPOSIT_WITHDRAW_VIEW: string = '355';
  public readonly EB_VAULT_DEPOSIT_WITHDRAW_CANCEL: string = '356';
  public readonly EB_VAULT_DEPOSIT_WITHDRAW_POST: string = '357';
  public readonly EB_STOCK_RECEIPT_REPORT_VIEW: string = '358';
  public readonly EB_FINANCIALS_CHART_OF_ACCOUNT_NEW: string = '359';
  public readonly EB_FINANCIALS_CHART_OF_ACCOUNT_UPDATE: string = '360';
  public readonly EB_FINANCIALS_CHART_OF_ACCOUNT_VIEW: string = '361';
  public readonly EB_FINANCIALS_VOUCHER_NEW: string = '362';
  public readonly EB_FINANCIALS_VOUCHER_UPDATE: string = '363';
  public readonly EB_FINANCIALS_VOUCHER_REVERSE: string = '364';
  public readonly EB_FINANCIALS_VOUCHER_POST: string = '365';
  public readonly EB_FINANCIALS_VOUCHER_CHEQUE_CLEARANCE: string = '366';
  public readonly EB_FINANCIALS_VOUCHER_VIEW: string = '367';
  public readonly EB_FINANCIALS_FISCAL_YEAR_NEW: string = '368';
  public readonly EB_FINANCIALS_FISCAL_YEAR_CLOSE: string = '369';
  public readonly EB_FINANCIALS_FISCAL_YEAR_VIEW: string = '370';
  public readonly EB_FINANCIALS_FISCL_YEAR_OPENING_BALANCE: string = '371';
  public readonly EB_FINANCIALS_FISCL_YEAR_UPDATE: string = '372';
  public readonly EB_FINANCIALS_VOUCHER_LIST_REPORT_VIEW: string = '373';
  public readonly EB_CONF_APPLICATION_SETUP_UPDATE: string = '374';
  public readonly EB_CONF_APPLICATION_SETUP_VIEW: string = '375';
  public readonly EB_CONF_VOUCHER_TYPE_NEW: string = '376';
  public readonly EB_CONF_VOUCHER_TYPE_UPDATE: string = '377';
  public readonly EB_CONF_VOUCHER_TYPE_VIEW: string = '378';
  public readonly EB_PARTICIPANT_BRANCH_NEW: string = '379';
  public readonly EB_PARTICIPANT_BRANCH_UPDATE: string = '380';
  public readonly EB_PARTICIPANT_BRANCH_VIEW: string = '381';
  public readonly EB_CONF_CLIENTS_NEW: string = '382';
  public readonly EB_CONF_CLIENTS_UPDATE: string = '383';
  public readonly EB_CONF_CLIENTS_VIEW: string = '384';
  public readonly EB_CONF_COMMISSION_SLAB_NEW: string = '385';
  public readonly EB_CONF_COMMISSION_SLAB_UPDATE: string = '386';
  public readonly EB_CONF_COMMISSION_SLAB_VIEW: string = '387';
  public readonly EB_CONF_LEVIES_NEW: string = '388';
  public readonly EB_CONF_LEVIES_UPDATE: string = '389';
  public readonly EB_CONF_LEVIES_VIEW: string = '390';
  public readonly EB_CONF_AGENT_NEW: string = '391';
  public readonly EB_CONF_AGENT_UPDATE: string = '392';
  public readonly EB_CONF_AGENT_VIEW: string = '393';
  public readonly EB_CONF_BANKS_NEW: string = '394';
  public readonly EB_CONF_BANKS_UPDATE: string = '395';
  public readonly EB_CONF_BANKS_VIEW: string = '396';
  public readonly EB_CONF_BANK_BRANCHES_NEW: string = '397';
  public readonly EB_CONF_BANK_BRANCHES_UPDATE: string = '398';
  public readonly EB_CONF_BANK_BRANCHES_VIEW: string = '399';
  // Client List Added
  public readonly EB_CLIENT_LIST_REPORT_VIEW: string = '400';
  public readonly EB_CONF_PLEDGEE_ACCOUNT_UPDATE: string = '401';
  public readonly EB_CONF_PLEDGDE_ACCOUNT_VIEW: string = '402';
  public readonly EB_REPORTS_SAMPLE_REPORT_VIEW: string = '403';
  public readonly EB_STOCK_ACTIVITY_REPORT_VIEW: string = '404';
  public readonly EB_CHART_OF_ACCOUNT_REPORT_VIEW: string = '405';
  public readonly EB_GENERAL_LEDGER_REPORT_VIEW: string = '406';
  public readonly EB_TRIAL_BALANCE_REPORT_VIEW: string = '407';
  public readonly EB_PROFIT_LOSS_REPORT_VIEW: string = '408';
  public readonly EB_BALANCE_SHEET_REPORT_VIEW: string = '409';
  public readonly EB_CLIENT_CASH_BALANCE_VIEW: string = '410';
  public readonly EB_ACCOUNT_HOLDING_SUMMARY_REPORT_VIEW: string = '411';
  public readonly EB_ACCOUNT_ACTIVITY_SUMMARY_REPORT_VIEW: string = '412';
  public readonly EB_ACCOUNT_ACTIVITY_DETAIL_REPORT_VIEW: string = '413';
  public readonly EB_EX_MKT_SEC_VIEW: string = '414';
  public readonly EB_EX_MKT_SEC_UPDATE: string = '415';
  public readonly EB_EX_MKT_SEC_NEW: string = '416';
  public readonly EB_PART_MONEY_OBL_REPORT_VIEW: string = '417';
  public readonly EB_CL_MONEY_OBL_REPORT_VIEW: string = '418';
  public readonly EB_PART_DEL_OBL_REPORT_VIEW: string = '419';
  public readonly EB_CL_DEL_OBL_REPORT_VIEW: string = '420';
  public readonly EB_ACC_OPENING_BALANCE_VIEW: string = '421';
  public readonly EB_ACC_OPENING_BALANCE_UPDATE: string = '422';
  public readonly EB_SECURITY_HAIRCUT_VIEW: string = '423';
  public readonly EB_SECURITY_HAIRCUT_UPDATE: string = '424';
  public readonly EB_TERMINAL_BIND_NEW: string = '425';
  public readonly EB_TERMINAL_BIND_UPDATE: string = '426';
  public readonly EB_TERMINAL_BIND_VIEW: string = '427';
  public readonly EB_CL_GN_LS_REPORT_VIEW: string = '428';
  public readonly EB_CL_LEVIES_DL_REPORT_VIEW: string = '429';
  public readonly EB_PE_LEVIES_REPORT_VIEW: string = '430';
  public readonly EB_PART_COMMISSION_REPORT_VIEW: string = '431';
  public readonly EB_AGENT_COMMISSION_REPORT_VIEW: string = '432';
  public readonly EB_MIGRATORS_CL_HOLDING_NEW: string = '433';
  public readonly EB_MIGRATORS_COA_NEW: string = '434';
  public readonly EB_SECURITY_HAIRCUT_NEW: string = '435';
  public readonly EB_HOME: string = '436';
  public readonly EB_MON_MKT_AUC_NEW: string = '437';
  public readonly EB_MON_MKT_AUC_UPDATE: string = '438';
  public readonly EB_MON_MKT_AUC_VIEW: string = '439';
  public readonly EB_MON_MKT_DEBT_ISSUER_NEW: string = '440';
  public readonly EB_MON_MKT_DEBT_ISSUER_UPDATE: string = '441';
  public readonly EB_MON_MKT_DEBT_ISSUER_VIEW: string = '442';
  public readonly EB_FI_COMPANY_NEW: string = '913';
  public readonly EB_FI_COMPANY_UPDATE: string = '914';
  public readonly EB_FI_COMPANY_VIEW: string = '915';
  public readonly EB_MON_MKT_FIS_TRANSACTION_NEW: string = '446';
  public readonly EB_MON_MKT_FIS_TRANSACTION_UPDATE: string = '447';
  public readonly EB_MON_MKT_FIS_TRANSACTION_VIEW: string = '448';
  public readonly EB_MON_MKT_FIS_TRANSACTION_CANCEL: string = '449';
  public readonly EB_MON_MKT_FIS_TRANSACTION_POST: string = '450';
  public readonly EB_MON_MKT_FIS_TRANSACTION_UN_POST: string = '451';
  public readonly EB_MON_MKT_BID_NEW: string = '452';
  public readonly EB_MON_MKT_BID_UPDATE: string = '453';
  public readonly EB_MON_MKT_BID_VIEW: string = '454';
  public readonly EB_MON_MKT_BID_CANCEL: string = '455';
  public readonly EB_MON_MKT_APP_LIST_REPORT_VIEW: string = '456';
  public readonly EB_MON_MKT_PUR_ORD_REPORT_VIEW: string = '457';
  public readonly EB_MON_MKT_CON_NOT_REPORT_VIEW: string = '458';
  public readonly EB_MON_MKT_AVL_MAT_REPORT_VIEW: string = '459';
  public readonly EB_MON_MKT_INC_SCH_REPORT_VIEW: string = '460';
  public readonly EB_MON_MKT_REINVESTMENT_NEW: string = '461';
  public readonly EB_MON_MKT_REINVESTMENT_UPDATE: string = '462';
  public readonly EB_MON_MKT_REINVESTMENT_VIEW: string = '463';
  public readonly EB_MON_MKT_REINVESTMENT_CANCEL: string = '464';

  // public readonly EB_FINANCIALS_CLIENT_LIST_REPORT_VIEW: string = '437';

  public readonly RA_FINANCIAL_RESULTS_NEW: string = '701';
  public readonly RA_FINANCIAL_RESULTS_UPDATE: string = '702';
  public readonly RA_FINANCIAL_RESULTS_VIEW: string = '703';
  public readonly RA_FINANCIAL_RESULTS_DELETE: string = '704';
  public readonly RA_PORTFOLIO_RETURN_NEW: string = '705';
  public readonly RA_PORTFOLIO_RETURN_UPDATE: string = '706';
  public readonly RA_PORTFOLIO_RETURN_VIEW: string = '707';
  public readonly RA_PORTFOLIO_RETURN_DELETE: string = '708';
  public readonly RA_YEARLY_DIVIDEND_COMPARISION_VIEW: string = '709';
  public readonly RA_HISTORICAL_PAYOUTS_VIEW: string = '710';
  // public readonly RA_STOCK_COMPARISION_FUNDAMENTAL_VIEW: string	= '711';
  // public readonly RA_STOCK_COMPARISION_EARNING_DIVIDEND_VIEW: string	= '712';
  public readonly RA_STOCK_COMPARISON_VIEW: string = '713';
  public readonly RA_STOCK_SCREENER_VIEW: string = '714';
  public readonly RA_YEARLY_ASSETS_HISTORY_VIEW: string = '715';
  public readonly RA_PORTFOLIO_ANALYSIS_VIEW: string = '716';
  public readonly RA_MEETING_NEW: string = '717';
  public readonly RA_MEETING_UPDATE: string = '718';
  public readonly RA_MEETING_VIEW: string = '719';
  public readonly RA_MEETING_DELETE: string = '720';
  public readonly RA_OTHERS_NEW: string = '721';
  public readonly RA_OTHERS_UPDATE: string = '722';
  public readonly RA_OTHERS_VIEW: string = '723';
  public readonly RA_OTHERS_DELETE: string = '724';
  public readonly RA_SEC_LOOKUP_QUOTE_VIEW: string = '725';
  public readonly RA_DIVIDEND_DETAILS_VIEW: string = '726';
  public readonly RA_STRONGEST_INVESTMENTS_VIEW: string = '727';
  public readonly RA_SECOTR_PERFORMANCE_VIEW: string = '728';
  public readonly RA_HOME: string = '729';
  public readonly RA_MIGRATORS_FINANCIAL_ANNOUNCEMENT_NEW: string = '730';
  public readonly RA_MIGRATORS_MEETING_ANNOUNCEMENT_NEW: string = '731';
  public readonly RA_MIGRATORS_OTHER_ANNOUNCEMENT_NEW: string = '732';

  public readonly EB_ACCESS_CONTROL_USER_NEW: string = '901';
  public readonly EB_ACCESS_CONTROL_USER_UPDATE: string = '902';
  public readonly EB_ACCESS_CONTROL_USER_VIEW: string = '903';
  public readonly EB_ACCESS_CONTROL_PRIVILEGE_NEW: string = '904';
  public readonly EB_ACCESS_CONTROL_PRIVILEGE_UPDATE: string = '905';
  public readonly EB_ACCESS_CONTROL_PRIVILEGE_VIEW: string = '906';
  public readonly EB_ACCESS_CONTROL_ROLE_NEW: string = '907';
  public readonly EB_ACCESS_CONTROL_ROLE_UPDATE: string = '908';
  public readonly EB_ACCESS_CONTROL_ROLE_VIEW: string = '909';


  public readonly EB_BOND_TRANSACTION_NEW: string = '910';
  public readonly EB_BOND_TRANSACTION_UPDATE: string = '911';
  public readonly EB_BOND_TRANSACTION_VIEW: string = '912';
  public readonly EB_BOND_TRANSACTION_CANCEL: string = '913';
  public readonly EB_BOND_TRANSACTION_POST: string = '914';
  public readonly EB_BOND_TRANSACTION_UN_POST: string = '915';

  public token: string = null;
  public claims: any = null;
  socket = io(environment.socketUrl, { 'forceNew': true });

  private loggedIn = false;

  // ------------------------------------------------------

  constructor(private http: HttpClient) {

    let token = sessionStorage.getItem('token');
    if (token && !AppUtility.isEmpty(token)) {
      let model = { token: token };
      this.processToken(model);
    }
  }

  // ------------------------------------------------------

  initializeAppConstants() {

    AppConstants.participantId = this.claims.participant.id;
    AppConstants.loggedinBrokerCode = this.claims.participant.code;
    AppConstants.username = this.claims.sub;
    AppConstants.loginName = this.claims.user.loginName;
    AppConstants.userType = this.claims.user.userType;
  }

  // ------------------------------------------------------

  processToken(res): boolean {

   var socketToken = "a||-5Jh>R(I&`4Xf42vz=Z]Dtze{@#4}5?}YJ*VC>,bc?,JNVg;#UlJ+Fk.n>~+";

    if (res.token) {
      this.token = res.token;
      this.claims = jwtDecode(this.token);
      sessionStorage.setItem('token', this.token);
      this.initializeAppConstants();
      this.loggedIn = true;
      this.socket = io(environment.socketUrl, { 'forceNew': true });
      console.log("This socket Auth OMS" , this.socket);
      this.socket.on('connect', () => {

        this.socket.emit('authenticate', { token: socketToken }) // send the jwt
          .on('authenticated', (data) => {
            console.log("Socket Data==================", data);
            this.socket.emit('order_confirmation' , {'user' : AppConstants.username});
            
           })
          .on('unauthorized', (error) => {
            console.log('unauthorized on push server: ' + JSON.stringify(error.data));
          });
      });
    }
    else {
      this.loggedIn = false;
    }

    return this.loggedIn;
  }

  // ------------------------------------------------------

  sendCredentials(email: string, password: string): Observable<boolean> {

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Content-Type', 'application/json');

    // let options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    let url = AppConstants.apiBaseUrl + 'marlin-authentication/login/';
    return this.http.post(url, JSON.stringify({ email, password }), { headers: Httpheaders })
    .pipe(
      map((res) => {
        return this.processToken(res);
      }));
  }

  // ------------------------------------------------------

  sendPasscode(email: string, passCode: string) {
    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Content-Type', 'application/json');

    // let options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    let url = AppConstants.apiBaseUrl + 'marlin-authentication/login/passcode/';
    return this.http.post(url, JSON.stringify({ email, passCode }), { headers: Httpheaders } )
    .pipe(
      map((res) => {
        return this.processToken(res);
      }));
  }

  // ------------------------------------------------------

  requestPasswordReset(email: string) {
    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Content-Type', 'application/json');

    // let options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    let url = AppConstants.apiBaseUrl + 'marlin-authentication/forgot-password/';
    return this.http.post(url, JSON.stringify({ email }), { headers: Httpheaders } );
  }

  // ------------------------------------------------------

  resetPassword(email: string, password: string, passCode: string) {
    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Content-Type', 'application/json');

    let url = AppConstants.apiBaseUrl + 'marlin-authentication/reset-password/';
    return this.http.post(url, JSON.stringify({ email, password, passCode }), { headers: Httpheaders });
  }

  // ------------------------------------------------------

  changePassword(password: string, newPassword: string) {
    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Content-Type', 'application/json');
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.token);

    let url = AppConstants.apiBaseUrl + 'marlin-authentication/change-password/';
    let email = this.claims.sub;
    return this.http.post(url, JSON.stringify({ email, password, newPassword }), { headers: Httpheaders });
  }

  // ------------------------------------------------------

  logout() {
    this.loggedIn = false;
    this.token = null;
    this.claims = null;

    sessionStorage.removeItem('token');

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // ------------------------------------------------------

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // ------------------------------------------------------

  isAuhtorized(authority: string): boolean {
    if (!this.claims)
      return false;

    return this.claims.authorities.indexOf(authority) !== -1;
  }

  // ------------------------------------------------------

  isOmsAuhtorized(): boolean {
    if (this.claims == null){
      return false;
    }

    return (this.claims.authorities.indexOf(this.OM_EQUITY_MARKET_WATCH_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_EQUITY_BEST_OFFER_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_EQUITY_BEST_PRICE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_BOND_MARKET_WATCH_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_BOND_BEST_OFFER_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_BOND_BEST_PRICE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_WORKING_ORDERS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_BOND_WORKING_ORDERS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_EXECUTED_ORDERS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_BOND_EXECUTED_ORDERS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_EVENT_LOG_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_BOND_EVENT_LOG_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_SECURITY_DETAILS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_BOND_SECURITY_DETAILS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_EXCHANGE_STATS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_CLIENT_MARGIN_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_MARKET_SUMMARY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_SECTOR_STATS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_ALERT_MANAGEMENT_ALERT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_BOND_PAYMENT_SCHEDULE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_BOND_PRICE_YIELD_CONVERTER_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.OM_REPORTS_SECURITY_CHART_VIEW) !== -1);
  }

  // ------------------------------------------------------

  isEbAuhtorized(): boolean {
    if (this.claims == null){
      return false;
    }

    return (this.claims.authorities.indexOf(this.EB_EXCHANGE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_SETTLEMENT_TYPE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_MARKET_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_PARTICIPANT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_SETTLEMENT_CALENDAR_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CLEARING_HOUSE_LEVIES_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_EXC_MKT_ASSOCIATION_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_HOLIDAY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_SECURITY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_COMPANY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_FI_COMPANY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_REGISTRAR_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_SECTOR_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_COUNTRY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CITY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CURRENCY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_EQUITY_TRANSACTION_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_EQUITY_SETTLEMENT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONTRACT_NOTE_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_VAULT_DEPOSIT_WITHDRAW_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_STOCK_RECEIPT_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_FINANCIALS_CHART_OF_ACCOUNT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_FINANCIALS_VOUCHER_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_FINANCIALS_FISCAL_YEAR_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_FINANCIALS_VOUCHER_LIST_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_APPLICATION_SETUP_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_VOUCHER_TYPE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_PARTICIPANT_BRANCH_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_CLIENTS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_COMMISSION_SLAB_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_LEVIES_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_AGENT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_BANKS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_BANK_BRANCHES_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CONF_PLEDGDE_ACCOUNT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_REPORTS_SAMPLE_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_STOCK_ACTIVITY_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CHART_OF_ACCOUNT_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_GENERAL_LEDGER_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_TRIAL_BALANCE_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_PROFIT_LOSS_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_BALANCE_SHEET_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CLIENT_CASH_BALANCE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_ACCOUNT_HOLDING_SUMMARY_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_ACCOUNT_ACTIVITY_SUMMARY_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_ACCOUNT_ACTIVITY_DETAIL_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_EX_MKT_SEC_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_MON_MKT_AUC_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_PART_MONEY_OBL_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CL_MONEY_OBL_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CLIENT_LIST_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_PART_DEL_OBL_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CL_DEL_OBL_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_ACC_OPENING_BALANCE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_SECURITY_HAIRCUT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_TERMINAL_BIND_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CL_GN_LS_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_CL_LEVIES_DL_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_PE_LEVIES_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_PART_COMMISSION_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_AGENT_COMMISSION_REPORT_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_MIGRATORS_CL_HOLDING_NEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_MIGRATORS_COA_NEW) !== -1) ||
      (this.claims.authorities.indexOf(this.EB_BOND_TRANSACTION_VIEW) !== -1);
    //  ||
    // (this.claims.authorities.indexOf(this.EB_ACCESS_CONTROL_USER_VIEW) !== -1) ||
    // (this.claims.authorities.indexOf(this.EB_ACCESS_CONTROL_PRIVILEGE_VIEW) !== -1) ||
    // (this.claims.authorities.indexOf(this.EB_ACCESS_CONTROL_ROLE_VIEW) !== -1);
  }


  // ------------------------------------------------------

  isRnaAuhtorized(): boolean {
    if (this.claims == null){
      return false;
    }

    return (this.claims.authorities.indexOf(this.RA_FINANCIAL_RESULTS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_PORTFOLIO_RETURN_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_YEARLY_DIVIDEND_COMPARISION_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_HISTORICAL_PAYOUTS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_STOCK_COMPARISON_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_STOCK_SCREENER_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_YEARLY_ASSETS_HISTORY_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_PORTFOLIO_ANALYSIS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_MEETING_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_OTHERS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_SEC_LOOKUP_QUOTE_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_DIVIDEND_DETAILS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_STRONGEST_INVESTMENTS_VIEW) !== -1) ||
      (this.claims.authorities.indexOf(this.RA_SECOTR_PERFORMANCE_VIEW) !== -1);
  }

}

