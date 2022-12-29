import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import * as wjcCore from '@grapecity/wijmo';

import 'rxjs/add/operator/toPromise';
import { TransactionDetail } from './../models/transaction-detail';
import { ComboItem } from '../models/combo-item';
import { Exchange } from './../models/exchange';
import { SettlementType } from './../models/settlement-type';
import { Market } from './../models/market';
import { SettlementCalendar } from './../models/settlement-calendar';
import { EMAssociation } from './../models/exch-mark-association';
import { Sector } from './../models/sector';
import { Country } from './../models/country';
import { City } from './../models/city';
import { Registrar } from './../models/registrar';
import { ExchangeMarketSecurity } from './../models/exch-mark-security';
import { PublicHoliday } from './../models/public-holiday';
import { WeeklyOffDay } from './../models/weekly-off-day';
import { Bank } from './../models/bank';
import { Agent } from './../models/agent';
import { Alert } from './../models/alert';
import { BankBranch } from './../models/bank-branches';
import { CommissionSlabMaster } from './../models/commission-slab-master';
import { CommissionSlabDetail } from './../models/commission-slab-detail';
import { ClearingHouseLeviesMaster } from './../models/clear-house-levies-master';
import { ClearingHouseLeviesDetail } from './../models/clear-house-levies-detail';
import { Client } from './../models/client';
import { ClientLevieDetail } from './../models/client-levy-detail';
import { VoucherType } from './../models/voucher-type';
import { FiscalYear } from './../models/fiscal-year';
import { VoucherMaster } from './../models/voucher-master';
import { voucherDetail } from './../models/voucher-detail';
import { Security } from './../models/security';
import { ChartOfAccount } from './../models/chart-of-account';
import { ApplicationSetup } from './../models/application-setup';
import { PortfolioReturnModel } from './../models/porfol-ret';
import { Role } from './../models/role';
import { RolePrivilege } from './../models/role-privilege';
import { User } from './../models/user';
import { StockDepositWithdraw } from './../models/stock-deposit-withdraw';
import { AnnouncementModel } from './../models/announcement-model';
import { Params } from './../models/report-params';
import { UserBinding } from './../models/terminal-binding';
import { AccountOpeningBalance } from './../models/account-opening-balance';
import { Migrator } from './../models/migrator';
import { BrokerBranch } from './../models/broker-branches';
import { MmAuction } from './../models/mm-Auctions';

import { NewBid } from 'app/models/new-bid';
import { ReInvestment } from './../models/re-investment';
import { BondTransactionDetail } from 'app/models/bond-transaction-detail';
import { AppConstants, AppUtility } from 'app/app.utility';

@Injectable()
export class ListingService {
  constructor(private appUtility: AppUtility, private appCons: AppConstants) { }
  urlString: string;

  public saveTransaction(transdet: TransactionDetail): any {
    return this.appUtility.wsPostRequest('transactions/', transdet);
  }

  public getTransactionDateBySettlementType(transactionDate: any, settlementTypeId: any): any {
    return this.appUtility.wsGetRequest('settlementCalendars/transaction-date/'+transactionDate+'/settlement-type/'+settlementTypeId);
  }

  public updateTransaction(transdet: TransactionDetail): any {
    return this.appUtility.wsPutRequest('transactions/', transdet);
  }

  public updateTransactionStatus(transIdList: String[], status: String): any {
    return this.appUtility.wsPutRequest('transactions/mark-as/' + status, transIdList);
  }

  public updateBondTransactionStatus(transIdList: String[], status: String): any {
    return this.appUtility.wsPutRequest('bond-transactions/mark-as/' + status, transIdList);
  }
  public saveExchange(exchdet: Exchange): any {
    return this.appUtility.wsPostRequest('exchanges/', exchdet);
  }

  public updateExchange(exchdet: Exchange): any {
    return this.appUtility.wsPutRequest('exchanges/', exchdet);
  }

  public saveMarket(exchdet: Market): any {
    return this.appUtility.wsPostRequest('markets/', exchdet);
  }
  public updateMarket(exchdet: Market): any {
    return this.appUtility.wsPutRequest('markets/', exchdet);
  }

  public saveSettlementType(settypedet: SettlementType): any {
    return this.appUtility.wsPostRequest('settlementTypes/', settypedet);
  }

  public updateSettlementType(settypedet: SettlementType): any {
    return this.appUtility.wsPutRequest('settlementTypes/', settypedet);
  }

  // public updateSettlementCalendar(sc: SettlementCalendar): any {
  //   return this.appUtility.wsPutRequest('settlementCalendars/updateSettlementCalander/', sc);
  // }
  // public generateSettlementCalendar(sc: SettlementCalendar): any {
  //   return this.appUtility.wsPostRequest('settlementCalendars/generateSettlementCalander/', sc);
  // }

  public updateSettlementCalendar(sc: any): any {
    return this.appUtility.wsPutRequest('settlementCalendars/updateSettlementCalander/', sc);
  }
  public generateSettlementCalendar(sc: any): any {
    return this.appUtility.wsPostRequest('settlementCalendars/generateSettlementCalander/', sc);
  }

  // for Sector form
  public saveSector(secdet: Sector): any {
    return this.appUtility.wsPostRequest('sectors/', secdet);
  }
  public updateSector(secdet: Sector): any {
    return this.appUtility.wsPutRequest('sectors/', secdet);
  }


  // for country form
  public saveCountry(condet: Country): any {
    return this.appUtility.wsPostRequest('countries/', condet);
  }
  public updateCountry(condet: Country): any {
    return this.appUtility.wsPutRequest('countries/', condet);
  }

  // for bank form
  public saveBank(condet: Bank): any {
    return this.appUtility.wsPostRequest('banks/', condet);
  }
  public updateBank(condet: Bank): any {
    return this.appUtility.wsPutRequest('banks/', condet);
  }

  // Account Opening Balance
  public getOpeningBalanceDefiningPriviledge(participantId: Number): Observable<Object[]> {
    this.urlString = 'fiscal-year-balance/participantId/' + participantId + '/valid-for-opening-balance/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getOpeningBalanceForChartOfAccount(participantId: Number, chartOfAccountId: number): Observable<Object[]> {
    this.urlString = 'fiscal-year-balance/participantId/' + participantId + '/chart-of-accounts/' + chartOfAccountId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public saveFiscalYearBalance(condet: any): any {
    return this.appUtility.wsPostRequest('fiscal-year-balance/', condet);
  }
  public updateFiscalYearBalance(condet: any): any {
    return this.appUtility.wsPutRequest('fiscal-year-balance/', condet);
  }

  // for Stock depost withdraw form
  public saveStockDepositWithdraw(condet: StockDepositWithdraw): any {
    return this.appUtility.wsPostRequest('stock-ledger/', condet);
  }
  public updateStockDepositWithdraw(condet: StockDepositWithdraw): any {
    return this.appUtility.wsPutRequest('stock-ledger/', condet);
  }
  public updateStockStatus(stockIdsList: String[], status: String): any {
    return this.appUtility.wsPutRequest('stock-ledger/mark-as/' + status, stockIdsList);
  }

  // for Fiscal year form
  public saveFiscalYear(condet: FiscalYear): any {
    return this.appUtility.wsPostRequest('fiscal-years/', condet);
  }
  public updateFiscalYear(condet: FiscalYear): any {
    return this.appUtility.wsPutRequest('fiscal-years/', condet);
  }

  // for chart of accounts
  public saveChartOfAccount(condet: ChartOfAccount): any {
    return this.appUtility.wsPostRequest('chart-of-accounts/', condet);
  }
  public updateChartOfAccount(condet: ChartOfAccount): any {
    return this.appUtility.wsPutRequest('chart-of-accounts/', condet);
  }

  // for bank branch form
  public saveBankBranch(condet: BankBranch): any {
    return this.appUtility.wsPostRequest('bank-branches/', condet);
  }
  public updateBankBranch(condet: BankBranch): any {
    return this.appUtility.wsPutRequest('bank-branches/', condet);
  }

  public saveApplicationSetup(condet: any): any {
    return this.appUtility.wsPostRequest('participants/application-setups/', condet);
  }

  // for Commission Slab form
  public saveCommissionSlab(condet: CommissionSlabDetail[]): any {
    return this.appUtility.wsPostRequest('commission-slabs/', condet);
  }
  public updateCommissionSlab(condet: CommissionSlabDetail[]): any {
    return this.appUtility.wsPutRequest('commission-slabs/', condet);
  }

  // for Clearing House Levis Page
  public saveClearingHouseLevis(condet: ClearingHouseLeviesDetail[]): any {
    return this.appUtility.wsPostRequest('ch-levies/', condet);
  }
  public updateClearingHouseLevis(condet: ClearingHouseLeviesDetail[]): any {
    return this.appUtility.wsPutRequest('ch-levies/', condet);
  }


  // for Security form
  public saveSecurity(exchdet: Security): any {
    return this.appUtility.wsPostRequest('securities/', exchdet);
  }
  public updateSecurity(exchdet: Security): any {
    return this.appUtility.wsPutRequest('securities/', exchdet);
  }

  // for city form
  public saveCity(citydet: City): any {
    return this.appUtility.wsPostRequest('cities/', citydet);
  }
  public updateCity(citydet: City): any {
    return this.appUtility.wsPutRequest('cities/', citydet);
  }


  // for registrar form
  public saveRegistrar(regdet: Registrar): any {
    return this.appUtility.wsPostRequest('registrars/', regdet);
  }
  public updateRegistrar(regdet: Registrar): any {
    return this.appUtility.wsPutRequest('registrars/', regdet);
  }

  // for new bid form
  public saveNewBid(newbid: NewBid): any {
    return this.appUtility.wsPostRequest('mmBids/', newbid);
  }
  public updateNewBid(updatebid: NewBid): any {
    return this.appUtility.wsPutRequest('mmBids/', updatebid);
  }
  public getBidList(): Observable<Object[]> {
    this.urlString = 'mmBids/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientInstructionsList(): Observable<Object[]> {
    this.urlString = 'lookups/clientInstructions/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getSecuritiesByAuction(aucNumber: number, status: boolean): Observable<Object[]> {
    this.urlString = 'securities/byAuction/' + aucNumber + '/active/' + status;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public updateBidStatus(bidNumber: Number, status: String): any {
    return this.appUtility.wsPutRequest('mmBids/mark-as-cancel/' + status, bidNumber);
  }

  // for exchange market Association form
  public saveExchangeMarketAssociationList(excmktdet: EMAssociation): any {
    return this.appUtility.wsPostRequest('exchange-markets/', excmktdet);
  }
  public updateExchangeMarketAssociationList(excmktdet: EMAssociation): any {
    return this.appUtility.wsPutRequest('exchange-markets/', excmktdet);
  }

  // For Exchange Market Security Form
  public updateAgent(ags: Agent): any {
    return this.appUtility.wsPutRequest('agents/', ags);
  }
  public saveAgent(ags: Agent): any {
    return this.appUtility.wsPostRequest('agents/', ags);
  }

  // for holidays form
  public savePublicHolidayList(phdet: PublicHoliday): any {
    return this.appUtility.wsPostRequest('holidays/publicHolidays/', phdet);
  }
  public updatePublicHolidayList(phdet: PublicHoliday): any {
    return this.appUtility.wsPutRequest('holidays/publicHolidays/', phdet);
  }
  public saveWeeklyOffDays(phdet: WeeklyOffDay): any {
    return this.appUtility.wsPostRequest('holidays/weeklyOffs/', phdet);
  }

  // for Terminal Binding Page
  public saveUserBinding(usBind: UserBinding): any {
    return this.appUtility.wsPostRequest('client-user-binding/', usBind);
  }

  public updateUserBinding(usBind: UserBinding): any {
    return this.appUtility.wsPutRequest('client-user-binding/', usBind);
  }

  public deleteUserBinding(usBind: UserBinding): any {
    // I Sahib Yar, is using 'Put' for delete, because that is what I was told to do
    // by Sir Asif,
    return this.appUtility.wsPutRequest('client-user-binding/delete/', usBind);
  }


  // For Agent Form
  public updateExchangeMarketSecurity(ems: ExchangeMarketSecurity): any {
    return this.appUtility.wsPutRequest('exchange-market-securities/', ems);
  }
  public saveExchangeMarketSecurity(ems: ExchangeMarketSecurity): any {
    return this.appUtility.wsPutRequest('exchange-market-securities/', ems);
  }
  public saveClient(phdet: Client): any {
    return this.appUtility.wsPostRequest('clients/', phdet);
  }
  public updateClientBasicInfo(phdet: Client): any {
    return this.appUtility.wsPutRequest('clients/update/basic-info/', phdet);
  }
  public updateClientContatDetail(phdet: Client): any {
    return this.appUtility.wsPutRequest('clients/update/contact-info/', phdet);
  }
  public updateClientSystemAccess(phdet: Client): any {
    return this.appUtility.wsPutRequest('clients/update/system-access/', phdet);
  }
  public updateClientBankAccount(phdet: Client): any {
    return this.appUtility.wsPutRequest('clients/update/bank-account/', phdet);
  }
  public updateClientJointAccount(phdet: Client): any {
    return this.appUtility.wsPutRequest('clients/update/joint-account/', phdet);
  }
  public updateClientDocuments(phdet: Client): any {
    return this.appUtility.wsPutRequest('clients/update/documents/', phdet);
  }

  //for client levy form
  public saveLevies(levydet: ClientLevieDetail[]): any {
    return this.appUtility.wsPostRequest("levies/", levydet);
  }

  public updateLevies(levydet: ClientLevieDetail[]): any {
    return this.appUtility.wsPutRequest('levies/', levydet);
  }

  public updateClientExchanges(phdet: Client): any {
    return this.appUtility.wsPutRequest("clients/update/client-exchange/", phdet);
  }
  public updateClientMarkets(phdet: Client): any {
    return this.appUtility.wsPutRequest("clients/update/client-markets/", phdet);
  }
  public updateClientCustodians(phdet: Client): any {
    return this.appUtility.wsPutRequest("clients/update/client-custodians/", phdet);
  }

  // for Voucher Type form
  public saveVoucherType(condet: VoucherType): any {
    return this.appUtility.wsPostRequest('voucher-types/', condet);
  }
  public updateVoucherType(condet: VoucherType): any {
    return this.appUtility.wsPutRequest('voucher-types/', condet);
  }
  public updateVoucherStatus(vousIdList: String[], status: String): any {
    return this.appUtility.wsPutRequest('vouchers/mark-as/' + status, vousIdList);
  }

  // for voucher Page
  public saveVoucher(condet: voucherDetail[]): any {
    return this.appUtility.wsPostRequest('vouchers/', condet);
  }
  public updateVoucher(condet: voucherDetail[]): any {
    return this.appUtility.wsPutRequest('vouchers/', condet);
  }
  public saveRole(condet: Role): any {
    return this.appUtility.wsPostRequest('roles/', condet);
  }
  public updateRole(condet: Role): any {
    return this.appUtility.wsPutRequest('roles/', condet);
  }
  public saveRolePrivileges(exchdet: RolePrivilege): any {
    return this.appUtility.wsPostRequest('roles/privs/save/', exchdet);
  }
  public saveUser(condet: User): any {
    return this.appUtility.wsPostRequest('users/', condet);
  }
  public updateUser(condet: User): any {
    return this.appUtility.wsPutRequest('users/', condet);
  }
  public updateSettlementStatus(settlementIdList: String[], status: String, participantId: Number): any {
    if (status == 'P')
      return this.appUtility.wsPutRequest('settlementCalendars/process-settlement/participantId/' + participantId, settlementIdList);
    else
      return this.appUtility.wsPutRequest('settlementCalendars/reverse-settlement/participantId/' + participantId, settlementIdList);
  }
  // public saveApplicationSetup(condet: ApplicationSetup): any {
  //   return this.appUtility.wsPostRequest('participants/application-setups/', condet);
  // }

  /******************************
    *
    * Data fetching Methods Start
    *
    ********************************/

  // for manual transaction form
  public getAllTransactionsByBroker(participantId: Number, transactionStatus: String, transactionDate: Date): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(transactionDate, 'yyyy-MM-dd');
    this.urlString = 'participants/' + participantId + '/transactions/trans-date/' + formatted + '/status/' + transactionStatus;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getAllTransactionsByBrokerAndMarket(participantId: Number, transactionStatus: String, transactionDate: Date,marketCode: String): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(transactionDate, 'yyyy-MM-dd');
    this.urlString = 'participants/' + participantId + '/transactions/trans-date/' + formatted + '/status/' + transactionStatus+ '/marketCode/' + marketCode;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSettlementCalenderBy_ExchangeId_Status_TradeDate(participantId: Number, exchangeId: Number, tradeDate: Date, status: String): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(tradeDate, 'yyyy-MM-dd');
    this.urlString = 'settlementCalendars/settlement-process/search/participantId/' + participantId + '/exchangeId/' + exchangeId + '/trade-date/' + formatted + '/status/' + status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSettlementCalendarByTradeDate(tradeDate: Date, isProcessed: Boolean): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(tradeDate, 'yyyy-MM-dd');
    this.urlString = 'settlementCalendars/' + formatted + '/' + isProcessed + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getParticipantSecurityExchanges(brokerId: number): Observable<Object[]> {
    this.urlString = 'participants/' + brokerId + '/exchange-market-securities/';
    return this.appUtility.wsGetRequest(this.urlString);
  }


  public getexchangeCodeSecurityExchanges(): Observable<Object[]> {
    this.urlString = 'exchanges/' + AppConstants.exchangeCode + '/exchange-market-securities/';
    return this.appUtility.wsGetRequest(this.urlString);
  }



  public getParticipantSecurityExchangesByMarket(brokerId: number, marketType: String): Observable<Object[]> {
    this.urlString = 'participants/' + brokerId + '/exchange-market-securities/marketType/' + marketType + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getParticipantSecurityExchangesByBaseMarket(brokerId: number): Observable<Object[]> {
    this.urlString = 'participants/' + brokerId + '/exchange-baseMarket-securities/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getExchangeListByBroker(brkerCode: string): Observable<Object[]> {
    this.urlString = 'exchanges/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getExchangeByExchangeCode(exchangeCode: string): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeCode;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getExchangeByExchangeId(exchangeId: number): Observable<Object[]> {
    this.urlString = 'exchanges/id/' + exchangeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getMarketListByExchange(exchangeId: Number): Observable<Object[]> {

    this.urlString = 'exchanges/' + exchangeId + '/markets/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getEquityMarketListByExchange(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/equity/markets/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getMarketListByExchangeMarketCode(exchangeId: Number,marketCode: string): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/code/'+ marketCode;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getMarketListByExchangeMarkeType(exchangeId: Number,marketTypeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/type/'+ marketTypeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  // public get(exchangeId: Number,marketTypeId: Number): Observable<Object[]> {
  //   this.urlString = 'exchanges/' + exchangeId + '/markets/type/'+ marketTypeId;
  //   return this.appUtility.wsGetRequest(this.urlString);
  // }

  public getIndexListByExchangeId(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'reports/get-indexes-code/exchange/' + exchangeId + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSymbolListByExchangeMarket(exchangeId: Number, marketId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/securities/';
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  public getActiveSecuritiesByExchangeMarket(exchangeId: Number, marketId: Number, status : Boolean): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/securities/' + status;
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  public getActiveSecuritiesByExchangeMarketBondSubCategory(exchangeId: Number, marketId: Number, bondSubCategory: Number, tradeDate: Date, status : Boolean): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/bondSubCategories/' + bondSubCategory + '/tradeDate/' + tradeDate + '/securities/' + status;
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  public getSecurityMaturityDate(securityId: Number): Observable<Object[]> {
    this.urlString = 'securities/' + securityId;
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  public getSymbolListByExchangeMarketandSettlementType(exchangeId: Number, marketId: Number, settlementTypeId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/settlement-type/' + settlementTypeId + '/securities/' + status;
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  public getSymbolListByExchangeMarketCodeandSettlementType(exchangeId: Number, marketCode: String, settlementTypeId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/marketCode/' + marketCode + '/settlement-type/' + settlementTypeId + '/securities/' + status;
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  public getNonmatureSymbolListByExchangeMarketCodeandSettlementType(exchangeId: Number, marketCode: String, settlementTypeId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/marketCode/' + marketCode + '/settlement-type/' + settlementTypeId + '/nonMature/securities/' + status;
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  public getClientCustodian(clientId: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientId + '/custodians/';
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  public getSymbolMarket(exchangeId: number, marketId: number, symbolId: number): Observable<Object[]> {
    //this.urlString = './app/services/demo_data/symbol.json';
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/securities/' + symbolId + '/securityMarket/';
    return this.appUtility.wsGetRequest(this.urlString, false);
  }

  // for exchange form
  public getExchangeList(): Observable<Object[]> {
    this.urlString = 'exchanges/';
    return this.appUtility.wsGetRequest(this.urlString);
  }


//For Exchange and Market Base Securities
//Added By Faizan - 9-15-2022
  public getExchangeMarketSecuritiesList(exchangeId , marketId): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/securities/' + 1;
    return this.appUtility.wsGetRequest(this.urlString);
  }




  public getReceivableCommissionPayables(participantId: number) {
    this.urlString = 'participants/' + participantId + '/settlement-params/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSectorsByExchange(exchangeId: number): any {
    this.urlString = 'exchanges/' + exchangeId + '/sectors/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getCountryList(): Observable<Object[]> {
    //  var _status: String = '';
    // if (_active) _status = 'TRUE';
    // else _status = 'FALSE';

    this.urlString = 'countries/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getBanksList(participantId: Number, _active: Boolean): Observable<Object[]> {
    let _status: String = '';
    if (_active) _status = 'TRUE';
    else _status = 'FALSE';

    // False if we want to get all the Banks List
    // True  if we want get only active Banks List
    this.urlString = 'participants/' + participantId + '/banks/' + _status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getFiscalYearList(participantId): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/fiscal-years/false';
    AppUtility.printConsole("Url: " + this.urlString);
    return this.appUtility.wsGetRequest(this.urlString);
  }


  public getStockDepositWithdrawList(participantId, transDate, type, posted): Observable<Object[]> {
    //this.urlString = /participants/1/stock-ledger/trans-date/2010-09-30/trans-type/D/posted/true';
    this.urlString = 'participants/' + participantId + '/stock-ledger/trans-date/' + transDate + '/posted/' + posted;
    AppUtility.printConsole("Url: " + this.urlString);
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getClientSecurityBalanceByParticipant(exchangeId, participantId, clientId, securityId): Observable<Object[]> {
    this.urlString = 'clients/exchangeID/' + exchangeId + '/participantID/' + participantId + '/clientID/' + clientId + '/securityID/' + securityId + '/security-balance/';
    AppUtility.printConsole("Url: " + this.urlString);
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientSecurityBalanceByCustodian(exchangeId, participantId, custodianId, clientId, securityId): Observable<Object[]> {
    this.urlString = 'clients/exchangeID/' + exchangeId + '/participantID/' + participantId + '/clientID/' + clientId + '/securityID/' + securityId + '/custodianID/' + custodianId + '/security-balance/';
    AppUtility.printConsole("Url: " + this.urlString);
    return this.appUtility.wsGetRequest(this.urlString);
  }


  public getCommissionSlabList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/commission-slabs/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getBankBranchList(participantId: Number, _active: Boolean): Observable<Object[]> {
    let _status: String = '';
    if (_active) _status = 'TRUE';
    else _status = 'FALSE';

    // False if we want to get all the Branch List
    // True  if we want get only active Branch List
    this.urlString = 'participants/' + participantId + '/bank-branches/' + _status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSlabCommissionDetailList(_exchangeId: Number): Observable<Object[]> {
    this.urlString = 'commission-slabs/' + _exchangeId + '/slab-details/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getClearingHouseLeviesList(_exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + _exchangeId + '/levies/';
    // this.urlString = 'exchanges/1/levies/';

    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getClearingHouseLeviesDetailList(_chLevyMasterId: Number): Observable<Object[]> {
    this.urlString = 'ch-levies/' + _chLevyMasterId + '/details/FALSE';
    // this.urlString = 'ch-levies/1/details/TRUE';

    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getCityListByCountry(countryId: Number): Observable<Object[]> {
    // var _status: String = '';
    // if (_active) _status = 'true';
    // else _status = 'false';

    this.urlString = 'countries/' + countryId + '/cities/';
    //this.urlString = './app/services/demo_data/transactions.json';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getCityList(): Observable<Object[]> {
    this.urlString = 'cities/';
    //this.urlString = './app/services/demo_data/transactions.json';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  // for market form
  public getMarketList(): Observable<Object[]> {
    this.urlString = 'markets/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getActiveMarketList(): Observable<Object[]> {
    this.urlString = 'markets/active/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getAllBaseMarketList(): Observable<Object[]> {
    this.urlString = 'markets/baseMarkets/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getMarketByMarketCode(marketCode: string): Observable<Object[]> {
    this.urlString = 'markets/code/'+ marketCode + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getMarketTypeList(): Observable<Object[]> {
    this.urlString = 'marketTypes/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getBaseMarketList(marketTypeId: Number): Observable<Object[]> {
    this.urlString = 'marketTypes/' + marketTypeId + '/markets/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  // for settlement-type form
  public getAllSettlementTypesList(): Observable<Object[]> {
    this.urlString = 'settlementTypes/false';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSettlementCalenderCountBySettlementTypeId(settlementTypeId: Number) {
    this.urlString = 'settlementCalendars/get-settlement-calendar-count/settlementTypeId/' + settlementTypeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  // for settlement-type form
  public getActiveSettlementTypesList(): Observable<Object[]> {
    this.urlString = 'settlementTypes/true';
    return this.appUtility.wsGetRequest(this.urlString);
  }
    // for settlement-type form
    // public getActiveSettlementTypesList(): Observable<Object[]> {
    //   this.urlString = 'settlementTypes/true';
    //   return this.appUtility.wsGetRequest(this.urlString);
    // }
  // for settlementCalendar from
  public getSettlementCalendarList(): Observable<Object[]> {
    this.urlString = 'settlementCalendars/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  // for security form
  public getSecurityList(): Observable<Object[]> {
    this.urlString = 'securities/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getSecurityByMarketType(marketId: number): Observable<Object[]> {
    this.urlString = 'securities/byMarketType/' + marketId;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getSecuritiesBySecurityType(securityTypeId: number): Observable<Object[]> {
    this.urlString = 'securities/bySecurityType/' + securityTypeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  // for stock screen, securites by exchange
  public getSecurityListByExchagne(exchangeId): Observable<Object[]> {
    this.urlString = 'securities/byExchange/' + exchangeId + '/active/true';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSecurityTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/securityTypes/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSecurityTypeByTypeId(securityTypeId:number): Observable<Object[]> {
    this.urlString = 'lookups/securityTypes/'+securityTypeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getRegistrarList(): Observable<Object[]> {
    this.urlString = 'registrars/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getActiveRegistrarList(isRegistrar:number): Observable<Object[]> {
    this.urlString = 'registrars/active/isRegistrar/' + isRegistrar;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  this method returns the auctions equal or greater than today
  public getActiveMmAuctionListByDateAndStatus(auctionDate:Date,status: Boolean): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(auctionDate, 'yyyy-MM-dd');
    this.urlString = 'mmAuctions/byAuctionDate/' + formatted + '/Status/' + status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  this method returns the auctions equal to given date
  public populateAuctionNumberListByAuctionDate(auctionDate:Date,status: Boolean): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(auctionDate, 'yyyy-MM-dd');
    this.urlString = 'mmAuctions/byAuctionCurrentDate/' + formatted + '/Status/' + status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSecurityById(securityId: number): Observable<Object> {
    this.urlString = 'securities/id/' + securityId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSecuritiesByMaturityDate(maturityDate: Date): Observable<Object[]> {
    let formattedDate = new DatePipe('en-US').transform(maturityDate, 'yyyy-MM-dd');
    this.urlString = 'securities/maturedSecurity/maturityDate/' + formattedDate;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  // for sectors form
  public getSectorsList(): Observable<Object[]> {
    this.urlString = 'sectors/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getActiveSectorsList(): Observable<Object[]> {
    this.urlString = 'sectors/active/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getBondCategoryList(): Observable<Object[]> {
    this.urlString = 'lookups/bondCategories/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getBondSubCategoryList(): Observable<Object[]> {
    this.urlString = 'lookups/bondSubCategories/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getBondTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/bondTypes/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getCouponFrequencyList(): Observable<Object[]> {
    this.urlString = 'lookups/couponFrequencies/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  // for exchange market security form
  public getExchangeMarketSecurities(): Observable<Object[]> {
    this.urlString = 'exchange-market-securities/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public generateBondPaymentSchedual(securityId: number): Observable<Object[]> {
    this.urlString = 'bondPaymentSchedules/generate/securityID/' + securityId;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getBondPaymentSchedual(exchangeId: number, marketId: number, securityId: number): Observable<Object[]> {
    this.urlString = 'bondPaymentSchedules/get/exchangeID/' + exchangeId + '/marketID/' + marketId + '/securityID/' + securityId;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getPaymentSchedualByExchangeMarketSecurityId(exchangeMarketSecurityId: number): Observable<Object[]> {
    this.urlString = 'bondPaymentSchedules/get/exchangeMarketSecurityId/' + exchangeMarketSecurityId;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getCustodianByExchange(exchangeid: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeid + '/custodians/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getExchangeMarketSecuritiesByParam(exchangeId: number, marketId: number, securityId: number): Observable<Object[]> {
    this.urlString = 'exchange-market-securities/exchange/' + exchangeId + '/markets/' + marketId + '/securities/' + securityId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getExchangeMarketSecuritiesByMarketANDSecurity(marketTypeId: number, securityId: number): Observable<Object[]> {
    this.urlString = 'exchange-market-securities/marketTypeId/' + marketTypeId + '/securities/' + securityId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSecurityStates(): Observable<Object[]> {
    this.urlString = 'lookups/securityStates/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getDayCountConventions(): Observable<Object[]> {
    this.urlString = 'lookups/dayCountConventions/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  // for exchange market Association form
  public getExchangeMarketAssociationList(): Observable<Object[]> {
    this.urlString = 'exchange-markets/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getOrderTypesList(): Observable<Object[]> {
    this.urlString = 'lookups/orderTypes/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getOrderQualifiersList(): Observable<Object[]> {
    this.urlString = 'lookups/orderQualifiers/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getTifOptionsList(): Observable<Object[]> {
    this.urlString = 'lookups/tifOptions/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getOrderTypesByExchangeMarket(exchangeId: Number, marketId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/orderTypes/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getOrderQualifiersByExchangeMarket(exchangeId: Number, marketId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/orderQualifiers/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getTifOptionsByExchangeMarket(exchangeId: Number, marketId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/tifOptions/';
    return this.appUtility.wsGetRequest(this.urlString);
  }


  public getPublicHolidaysByExchange(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/publicHolidays/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getWeeklyOffByExchange(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/weeklyOffDays/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getWeekDaysLookup(): Observable<Object[]> {
    this.urlString = 'lookups/weekDays/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getAgentsbyParticipant(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/agents/false';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  // for clients form
  public getClientListByBroker(brkerId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = "participants/" + brkerId + "/clients/" + status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getClientUserBindings(participantID: number, userId: number, clientId: number) {
    this.urlString = "client-user-binding/participantId/" + participantID + "/userId/" + userId + "/clientId/" + clientId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getClientListByExchangeBroker(exchagneId: Number, brokerId: Number, status: Boolean, orderBy: boolean = true): Observable<Object[]> {
    this.urlString = "participants/" + brokerId + "/exchanges/" + exchagneId + "/clients/" + status + "/asc/" + orderBy;
    return this.appUtility.wsGetRequest(this.urlString);
  }
//  These are non Binded Search Clients
  public getClientListByBrokerAndClientCodeAndClientName(brkerId: Number, clientCode: string, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-clients/code/' + clientCode + '/name/' + clientName;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientListByBrokerAndClientCode(brkerId: Number, clientCode: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-clients/code/' + clientCode;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientListByBrokerAndClientName(brkerId: Number, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-clients/name/' + clientName;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getClientListByBrokerAndExchangeAndClientCodeAndClientName(brkerId: Number, exId: Number, clientCode: string, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-clients/code/' + clientCode + '/name/' + clientName;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientListByBrokerAndExchangeAndClientCode(brkerId: Number, exId: Number, clientCode: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-clients/code/' + clientCode;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientListByBrokerAndExchangeAndClientName(brkerId: Number, exId: Number, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-clients/name/' + clientName;
    return this.appUtility.wsGetRequest(this.urlString);
  }
//  These are Binded Search Clients
  public getBindedClientListByBrokerAndClientCodeAndClientName(brkerId: Number, clientCode: string, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-binded-clients/code/' + clientCode + '/name/' + clientName;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getBindedClientListByBrokerAndClientCode(brkerId: Number, clientCode: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-binded-clients/code/' + clientCode;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getBindedClientListByBrokerAndClientName(brkerId: Number, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-binded-clients/name/' + clientName;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getBindedClientListByBrokerAndExchangeAndClientCodeAndClientName(brkerId: Number, exId: Number, clientCode: string, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-binded-clients/code/' + clientCode + '/name/' + clientName;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getBindedClientListByBrokerAndExchangeAndClientCode(brkerId: Number, exId: Number, clientCode: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-binded-clients/code/' + clientCode;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getBindedClientListByBrokerAndExchangeAndClientName(brkerId: Number, exId: Number, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-binded-clients/name/' + clientName;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientById(participantID: Number, clientID: Number): any {
    this.urlString = 'clients/participantID/' + participantID + '/clientID/' + clientID;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getGLParams(participantID: Number): any {
    this.urlString = 'participants/' + participantID + "/gl-params/";
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getHeadLevelDetails(participantID: Number): any {
    this.urlString = 'participants/' + participantID + "/head-level-details/";
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getLastHeadLevel(participantID: Number): any {
    this.urlString = 'participants/' + participantID + '/head-level-details/last-level/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientControlAccount(participantID: Number): any {
    this.urlString = 'participants/' + participantID + '/client-control-account/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getActiveAgentsbyParticipant(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/agents/true';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getDashboardsbyParticipantAndUserTypeAndRoles(participantId: Number, userTypeId: Number, rolesList: string = ''): Observable<Object[]> {
    this.urlString = 'users/assigned-modules/participantId/' + participantId + '/userTypeId/' + userTypeId + '/rolesList/' + rolesList;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientBankAccountList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/bank-accounts/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientJointAccountList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/joint-accounts/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getBankBranchListByBank(bankId: Number): Observable<Object[]> {
    this.urlString = 'bank-branches/' + bankId + '/branches/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getDocumentTypes(): Observable<Object[]> {
    this.urlString = 'lookups/document-types/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientDocumentsList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/documents/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientExchangeList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/exchanges/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientMarketList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/marekts/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getParticipantExchangeList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/exchanges/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  // for agent form
  public getParticipantBranchList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/participant-branches/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getIdentificationTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/identification-types/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getProfessionList(): Observable<Object[]> {
    this.urlString = 'lookups/professions/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getIndustryList(): Observable<Object[]> {
    this.urlString = 'lookups/industries/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for portfolio-return page
  public getInstrumentList(): Observable<Object[]> {
    this.urlString = 'lookups/instruments/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public savePortfolioReturn(pfr: PortfolioReturnModel): any {
    return this.appUtility.wsPostRequest('portfolio-returns/', pfr);
  }

  public getPFRList(pfr: PortfolioReturnModel): Observable<Object[]> {
    let yearEndString: string;
    yearEndString = wjcCore.Globalize.format(pfr.yearEnd, AppConstants.DATE_FORMAT);
    this.urlString = 'participants/' + pfr.participant.participantId + '/portfolio-returns/instruments/' +
      pfr.instrument.instrumentId + '/year-end/' + yearEndString + '/period/' + pfr.period;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public updatePortfolioReturn(pfr: PortfolioReturnModel): any {
    return this.appUtility.wsPutRequest('portfolio-returns/', pfr);
  }

  public deletePortFolioReturn(pfr: PortfolioReturnModel): any {
    return this.appUtility.wsDeleteRequest('portfolio-returns/', pfr);
  }

  //  for Analysis => Announcement page
  public getAnnouncementTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/announcement-types/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getAnnouncementList(am: AnnouncementModel): Observable<Object[]> {
    let fromDateString: string;
    let toDateString: string;
    fromDateString = wjcCore.Globalize.format(am.fromDate, AppConstants.DATE_FORMAT);
    toDateString = wjcCore.Globalize.format(am.toDate, AppConstants.DATE_FORMAT);
    this.urlString = 'participants/' + am.participant.participantId + '/announcements/securities/' + am.security.securityId +
      '/from/' + fromDateString + '/to/' + toDateString + '/type/' + am.announcementType.announcementTypeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getAnnouncementListBySecurity(_exCode, _secCode): Observable<Object[]> {
    this.urlString = 'reports/get-announcements/participant/' + AppConstants.participantId + '/exchange/'
    + _exCode + '/security/' + _secCode + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getExchangesListBySecurityId(secId: number): Observable<Object[]> {
    this.urlString = 'securities/id/' + secId + '/exchanges/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public saveAnnouncement(am: AnnouncementModel): any {
    return this.appUtility.wsPostRequest('announcements/', am);
  }

  public updateAnnouncement(am: AnnouncementModel): any {
    return this.appUtility.wsPutRequest('announcements/', am);
  }

  public deleteAnnouncement(am: AnnouncementModel): any {
    return this.appUtility.wsDeleteRequest('announcements/', am);
  }

  //  for financial => Reports => Trial balance
  public getTrialBalanceReport(PID_: number, HL_: number, startDate_: string, endDate_: string,reportFormat:string): Observable<Object[]> {
    this.urlString = 'reports/trial-balance/participant/' + PID_ + '/head-level/' +
      HL_ + '/start-date/' + startDate_ + '/end-date/' + endDate_ + '/reportFormat/' + reportFormat + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for financial => Reports => Profit/Loss Statement
  public getProfitLossStatementReport(PID_: number, HL_: number, asOnDate_: string,reportFormat:string): Observable<Object[]> {
    this.urlString = 'reports/profit-loss/participant/' + PID_ + '/head-level/' +
      HL_ + '/asOnDate/' + asOnDate_ + '/reportFormat/' + reportFormat + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for financial => Reports => Balance Sheet
  public getBalanceSheetReport(PID_: number, HL_: number, asOnDate_: string): Observable<Object[]> {
    this.urlString = 'reports/balance-sheet/participant/' + PID_ + '/head-level/' +
      HL_ + '/asOnDate/' + asOnDate_ + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for financial => Reports => Clients Cash Balance
  public getClientsCashBalanceReport(PID_: number, client_: number, balance_: string, lang_: string): Observable<Object[]> {
    
    this.urlString = 'reports/clients-cash-balance/participant/' + PID_ + '/balance/' +
      balance_ + '/clients/' + client_ + '/lang/' + lang_ + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for financial => Reports => General Ledger
  public getGeneralLedgerReport(PID_: number, from_client_: string, to_client_: string, start_date_: string,
    end_date_: string, vt_id_: number, vt_: string, vp_: number,reportFormat:string): Observable<Object[]> {
    this.urlString = 'reports/general-ledger/participant/' + PID_ + '/from-account/' + from_client_ +
      '/to-account/' + to_client_ + '/start-date/' + start_date_ + '/end-date/' + end_date_ + '/voucher-type-id/' +
      vt_id_ + '/voucher-type/' + vt_ + '/voucher-posted/' + vp_ + '/reportFormat/' + reportFormat + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for equity => settlement reports => participant delivery obligation
  public getParticipantDeliveryObligationReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string): Observable<Object[]> {
    this.urlString = 'reports/participant-delivery-obligation/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for equity => settlement reports => client delivery obligation
  public getClientDeliveryObligationReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string): Observable<Object[]> {
    this.urlString = 'reports/client-delivery-obligation/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for equity => settlement reports => participant money obligation
  public getParticipantMoneyObligationReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string): Observable<Object[]> {
    this.urlString = 'reports/participant-money-obligation/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for equity => settlement reports => client money obligation
  public getClientMoneyObligationReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string): Observable<Object[]> {
    this.urlString = 'reports/client-money-obligation/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for money market => Reports => Application list
  public getApplicationListReport(PID_: number, auction_id: number, auction_number: number, sec_id_: number, sec_: string, client_instruction: string, ci_id_: number): Observable<Object[]> {
    this.urlString = 'reports/mm-application-list/participant/' + PID_ + '/auction-id/' + auction_id + '/auction-number/' + auction_number + '/security-id/' + sec_id_ +
      '/security/' + sec_ + '/instruction/' + client_instruction + '/instructionId/' + ci_id_ + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for money market => Reports => Purchase order
  public getPurchaseOrderReport(PID_: number, auction_id: number, auction_number: number): Observable<Object[]> {
    this.urlString = 'reports/mm-purchase-order/participant/' + PID_ + '/auction-id/' + auction_id + '/auction-number/' + auction_number + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for money market => Reports => Contract notes
  public getContractNotesReport(PID_: number, auction_id: number, auction_number: number, client_id: number): Observable<Object[]> {
    this.urlString = 'reports/mm-contract-notes/participant/' + PID_ + '/auction-id/' + auction_id + '/auction-number/' + auction_number + '/client-id/' + client_id + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for money market => Reports => Available maturities
  public getAvailableMaturitiesReport(PID_: number, date_: string, sec_id_: number, sec_: string): Observable<Object[]> {
    this.urlString = 'reports/mm-available-maturities/participant/' + PID_ + '/date/' + date_ + '/security-id/' + sec_id_ + '/security/' + sec_ +'/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for money market => Reports => Income schedule summary
  public getIncomeScheduleSummaryReport(PID_: number, start_date_: string, end_date_: string): Observable<Object[]> {
    this.urlString = 'reports/mm-income-schedule-summary/participant/' + PID_ + '/start-date/' + start_date_ + '/end-date/' + end_date_ + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for money market => Reports => Income schedule detail
  public getIncomeScheduleDetailReport(PID_: number, start_date_: string, end_date_: string, sec_id_: number, sec_: string): Observable<Object[]> {
    this.urlString = 'reports/mm-income-schedule-detail/participant/' + PID_ + '/start-date/' + start_date_ + '/end-date/' + end_date_ + '/security-id/' + sec_id_ + '/security/' + sec_ +'/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for backoffice => migrator => client holding
  public uploadClientHolding(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/clients-holding/';
    return this.appUtility.wsPostRequest(this.urlString, oClientHolding);
  }
   //  for backoffice => migrator => Financial Announcement
  public uploadFinancialAnnouncement(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/financial-announcement/';
    return this.appUtility.wsPostRequest(this.urlString, oClientHolding);
  }
 //  for backoffice => migrator => Meeting Announcement
  public uploadMeetingAnnouncement(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/meeting-announcement/';
    return this.appUtility.wsPostRequest(this.urlString, oClientHolding);
  }
   //  for backoffice => migrator => Others Announcement
  public uploadOthersAnnouncement(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/other-announcement/';
    return this.appUtility.wsPostRequest(this.urlString, oClientHolding);
  }
  //for client levy form
  public getLeviesByBroker(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/levies/";
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getVoucherTypeList(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/voucher-types/";
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getChartOfAccountList(participantId: Number, leaves: boolean = false, orderBy: boolean = true): Observable<Object[]> {
    //if (leaves)
    this.urlString = "participants/" + participantId + "/chart-of-accounts/leaves/" + leaves + "/asc/" + orderBy;
    // else
    //   this.urlString = "participants/" + participantId + "/chart-of-accounts/leaves/false";

    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getChartOfAccountListNonClients(participantId: Number, orderBy: boolean = true): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/chart-of-accounts-non-clients/asc/' + orderBy;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getclientControlAccountList(participantId: Number) {
    this.urlString = "participants/" + participantId + "/chart-of-accounts/second-last-accounts/";
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getFinacialsDisabledFlag(participantId: Number) {
    this.urlString = "participants/" + participantId + "/chart-of-accounts/child-exists/";
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getChartOfAccountListbyglCodeDesc(participantId: Number, glCode: String, glDesc: String, exactMatch: String): Observable<Object[]> {
    this.urlString = null;
    //if (!AppUtility.isEmpty(glCode) || !AppUtility.isEmpty(glDesc))
    this.urlString = "participants/" + participantId + "/chart-of-accounts/";

    if (!AppUtility.isEmpty(glCode))
      this.urlString = this.urlString + "code/" + glCode + '/';

    if (!AppUtility.isEmpty(glDesc))
      this.urlString = this.urlString + "desc/" + glDesc + '/';

    if (!AppUtility.isEmpty(glCode) && !AppUtility.isEmpty(exactMatch))
      this.urlString = this.urlString + exactMatch;

    return this.appUtility.wsGetRequest(this.urlString);

  }

  public getBindedChartOfAccountListbyglCodeDesc(participantId: Number, glCode: String, glDesc: String, exactMatch: String): Observable<Object[]> {
    this.urlString = null;
    //if (!AppUtility.isEmpty(glCode) || !AppUtility.isEmpty(glDesc))
    this.urlString = "participants/" + participantId + "/binded-chart-of-accounts/";

    if (!AppUtility.isEmpty(glCode))
      this.urlString = this.urlString + "code/" + glCode + '/';

    if (!AppUtility.isEmpty(glDesc))
      this.urlString = this.urlString + "desc/" + glDesc + '/';

    if (!AppUtility.isEmpty(glCode) && !AppUtility.isEmpty(exactMatch))
      this.urlString = this.urlString + exactMatch;

    return this.appUtility.wsGetRequest(this.urlString);

  }
public getBindedAndSortedChartOfAccountList(participantId: Number, orderBy: Boolean): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/binded-chart-of-accounts/asc/" + orderBy;
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getClientLevieDetailList(leviesMasterId: Number): Observable<Object[]> {
    this.urlString = null;
    this.urlString = "levies/" + leviesMasterId + "/levies-detail/false";
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getVoucherListByBroker(participantId: Number, voucherTypeId: Number, voucherStatus: String, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'participants/' + participantId + '/voucher-types/' + voucherTypeId + '/status/' + voucherStatus + '/from-date/' + from_Date + '/to-date/' + to_Date;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getVoucherListByBrokerDate(participantId: Number, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'participants/' + participantId + '/cheque-clearance-vouchers/from-date/' + from_Date + '/to-date/' + to_Date;
    return this.appUtility.wsGetRequest(this.urlString);
  }
public getClientListRpt(participantId: Number, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'reports/clients/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date+"/";
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getvoucherDetailList(voucherMasterId: Number): Observable<Object[]> {
    this.urlString = 'vouchers/' + voucherMasterId + '/voucher-details/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getGlParamsByParticipant(participantID: Number): any {
    this.urlString = null;
    this.urlString = 'participants/' + participantID + '/gl-params/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getFiscalYearByParticipant(participantId: Number, startDate: Date, status: Boolean): Observable<Object[]> {
    this.urlString = null;
    let start_Date = new DatePipe('en-US').transform(startDate, 'yyyy-MM-dd');
    this.urlString = "participants/" + participantId + "/fiscal-years/start-date/" + start_Date + '/' + status;
    // this.urlString = "participants/" + participantId + "/chart-of-accounts";
    return this.appUtility.wsGetRequest(this.urlString);
  }


  public getRoleList(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/roles/";
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getPrivilegeList(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/privs/";
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getRolePriveleges(roleId: Number): Observable<Object[]> {
    this.urlString = "roles/" + roleId + "/privs/";
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getUserList(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/users/";
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getActiveUsersListExceptParticipantAdmin(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/active-users/";
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getUserTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/user-types/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getApplicationSetup(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/application-setups/";
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getParticipantListbyCodeNameType(code: String, name: String, isCustodian: Boolean): Observable<Object[]> {
    this.urlString = null;

    this.urlString = "participants/search/";

    if (!AppUtility.isEmpty(isCustodian))
      this.urlString = this.urlString + "is-custodian/" + isCustodian + '/';

    if (!AppUtility.isEmpty(code))
      this.urlString = this.urlString + "code/" + code + '/';

    if (!AppUtility.isEmpty(name))
      this.urlString = this.urlString + "name/" + name + '/';


    console.log(this.urlString);
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public saveBrokerBranch(condet: BrokerBranch): any {
    return this.appUtility.wsPostRequest('participant-branches/', condet);
  }

  public updateBrokerBranch(condet: BrokerBranch): any {
    return this.appUtility.wsPutRequest('participant-branches/', condet);
  }

  public getParticipantSecurityParams(participantId: number, exchangeId: number): Observable<Object[]> {
    this.urlString = 'participant-security-param/participantId/' + participantId + '/exchangeId/' + exchangeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public saveParticipantSecurityParams(transdet: any): any {
    return this.appUtility.wsPostRequest('participant-security-param/', transdet);
  }

  public saveParticipant(participant: any): any {
    return this.appUtility.wsPostRequest('participants/', participant);
  }

  public updateParticipant(participant: any): any {
    return this.appUtility.wsPutRequest('participants/', participant);
  }

  public updateContact(contact: any): any {
    return this.appUtility.wsPutRequest('participants/update/contact-info/', contact);
  }

  public updateParticipantExchangeAssociation(exchangeAssociation: any[]): any {
    return this.appUtility.wsPutRequest('participant-exchanges/', exchangeAssociation);
  }

  public updateParticipantModules(exchangeAssociation: any[]): any {
    return this.appUtility.wsPutRequest('participant-role-priv/', exchangeAssociation);
  }
  public updateParticipantSecurityParams(transdet: any): any {
    return this.appUtility.wsPutRequest('participant-security-param/', transdet);
  }
  public getClientUser(clientID: Number): Observable<Object> {
    this.urlString = 'clients/clientID/' + clientID + '/system-access/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getBrokerBranchList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participant-branches/participantId/' + participantId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSampleReport(): Observable<Object> {
    this.urlString = 'reports/test-email/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getParticipantUser(participantID: number, userType: number): Observable<Object> {
    this.urlString = 'participants/' + participantID + '/user-type/' + userType;
    return this.appUtility.wsGetRequest(this.urlString);

  }

  public getParticipantModulesList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/modules/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getModulesList(): Observable<Object[]> {
    this.urlString = '/modules/all/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  // Research -> Research -> Corporate Analysis Reports -> Dividend Details
  public getFinancialAnnouncementListByExchange(_exId: number): Observable<Object[]> {
    this.urlString = 'reports/get-fin-announcements/participant/' + AppConstants.participantId + '/exchange/'
    + _exId + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  //  for backoffice => migrator => chart of accounts
  public uploadChartOfAccounts(oCOA: Migrator): any {
    this.urlString = 'migrator/upload/chart-of-account/';
    return this.appUtility.wsPostRequest(this.urlString, oCOA);
  }

  /******************************
   ********************************/
  public getOrderSides(): any[] {
    //this.urlString = './app/services/data/order-sides.json';
    let lang=localStorage.getItem("lang");
    if(lang==null){ lang='en'}

    let cmbItem: ComboItem;
    let orderSides: any[] = [];
    if (lang=='en'){
      cmbItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
      orderSides.push(cmbItem);
      cmbItem = new ComboItem('Buy', 'buy');
      orderSides.push(cmbItem);
      cmbItem = new ComboItem('Sell', 'sell');
      orderSides.push(cmbItem);
    }
    else if (lang=='pt'){
      cmbItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
      orderSides.push(cmbItem);
      cmbItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
      orderSides.push(cmbItem);
      cmbItem = new ComboItem('Comprar', 'buy');
      orderSides.push(cmbItem);
      cmbItem = new ComboItem('Vender', 'sell');
      orderSides.push(cmbItem);
    }
    return orderSides;
    //return this.appUtility.wsGetRequest(this.urlString, true);
  }

   // for auction configuration form
   public getAuctionsList(): Observable<Object[]> {
    this.urlString = 'mmAuctions/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getAuctionById(auctionId: Number): Observable<Object> {
    this.urlString = 'mmAuctions/byAuctionId/' + auctionId + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getAuctionByNumber(auctionNumber: Number): Observable<Object> {
    this.urlString = 'mmAuctions/byAuctionNumber/' + auctionNumber + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public saveAuctions(auctionConfig: MmAuction): any {
    return this.appUtility.wsPostRequest('mmAuctions/', auctionConfig);
  }
  public updateAuctions(auctionConfig: MmAuction): any {
    return this.appUtility.wsPutRequest('mmAuctions/', auctionConfig);
  }
  public getMaxAuctionNumber(): Observable<Object[]> {
    this.urlString = 'mmAuctions/maxAuctionNumber';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public updateAuctionStatus(auctionNumber: Number, status: String): any {
    return this.appUtility.wsPutRequest('mmAuctions/mark-as/' + status, auctionNumber);
  }

  public getReInvestmentList(): Observable<Object[]> {
    this.urlString = 'mmReInvestments/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public saveReInvestment(reInvestment: ReInvestment): any {
    return this.appUtility.wsPostRequest('mmReInvestments/', reInvestment);
  }
  public updateReInvestment(reInvestment: ReInvestment): any {
    return this.appUtility.wsPutRequest('mmReInvestments/', reInvestment);
  }

  public getMaturedSecurityByAuctionId(aucId: number, status: boolean): Observable<Object[]> {
    this.urlString = 'securities/maturedSecurity/byAuction/' + aucId + '/active/' + status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getUnMaturedSecurityByAuctionId(aucId: number, status: boolean): Observable<Object[]> {
    this.urlString = 'securities/unMaturedSecurity/byAuction/' + aucId + '/active/' + status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getAllMaturedSecurityAuction(): Observable<Object[]> {
    this.urlString = 'mmAuctions/maturedSecurityAuction/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getUnMaturedSecurityAuction(): Observable<Object[]> {
    this.urlString = 'mmAuctions/unMaturedSecurityAuction/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getActiveCustodianByExchange(exchangeid: Number, status:boolean): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeid + '/custodians' + '/active/' + status;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getClientsByCustodian(custodianId: Number): Observable<Object[]> {
    this.urlString = 'clients/custodianId/' + custodianId + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public saveBondTransaction(bondTransDet: BondTransactionDetail): any {
    return this.appUtility.wsPostRequest('bond-transactions/', bondTransDet);
  }

  public updateBondTransaction(transdet: BondTransactionDetail): any {
    return this.appUtility.wsPutRequest('bond-transactions/', transdet);
  }
  public getBondTransactionsByBroker(participantId: Number, transactionStatus: String, transactionDate: Date): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(transactionDate, 'yyyy-MM-dd');
    this.urlString = 'participants/' + participantId + '/bond-transactions/trans-date/' + formatted + '/status/' + transactionStatus;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getLastBondPaymentScheduleByDate(exchangeId: Number, marketId: Number, securityId: Number, tradeDate: Date): Observable<Object[]> {
    this.urlString = 'bondPaymentSchedules/get/exchangeID/' + exchangeId + '/marketID/' + marketId + '/securityID/' + securityId + '/tradeDate/' + tradeDate;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  /*public updateTransaction(transdet: TransactionDetail): any {
    return this.appUtility.wsPutRequest('transactions/', transdet);
  }*/

  public getBondTransactionByParticipantAndTradeNo(participantId: Number, tradeNumber: Number){
    this.urlString = 'bond-transactions/participant-id/' + participantId + '/trade-number/' + tradeNumber;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getBondTransactionByParticipantAndTransNo(participantId: Number, transNumber: Number){
    this.urlString = 'bond-transactions/participant-id/'+participantId+'/trans-number/' + transNumber;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSecurityByMarketTypeId(marketTypeId: number): Observable<Object[]> {
    this.urlString = 'securities/byMarketTypeId/' + marketTypeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

}
