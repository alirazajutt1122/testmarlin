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
import { smsBroadcast } from './../models/smsBroadcast';
import { BrokerBranch } from './../models/broker-branches';
import { SecurityDailyIndicator } from './../models/security-daily-indicator';
import { SRO } from '../models/sro';

import { AppUtility } from './../app.utility';
import { AppConstants } from './../app.utility';
import { AMLDATA } from '../models/aml-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService2 } from './auth2.service';
import { RdaClient } from 'app/models/rda-client';

import { RestService } from './api/rest.service';
import { TaxRanges } from 'app/models/tax-range';
import { InvestorRegistrationDepositry } from 'app/models/investor_registration_depo';
import { environment } from 'environments/environment';
import { DepoUser } from 'app/models/depo-user';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  constructor(private appUtility: AppUtility, private appCons: AppConstants, private http: HttpClient, private authService: AuthService2, private restService: RestService) { }
  urlString: string;

  public saveTransaction(transdet: TransactionDetail): any {
    return this.restService.post(true, 'transactions/', transdet);
  }

  public approveClient(obj: any): Observable<Object[]> {
    return this.http.post('http://192.168.36.120:8083/MarlinAPI/nccplData/sendDataToNccpl/', obj)
      .map(this.translateResponse)
      .catch(this.translateError);
  }


  public getPaymentScheduleForSecurity(securityId: Number,generateFlag:boolean): Observable<Object[]> {
    this.urlString = 'bondPaymentSchedules/paymentSchedule/securityID/' + securityId +'/generate/'+generateFlag

    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSavedClientRequestById(id: any): Observable<Object[]> {
    return this.http.get('http://192.168.36.120:8083/MarlinAPI/nccplData/getSavedClientRequest/' + id)
      .map(this.translateResponse)
      .catch(this.translateError);
  }

  public getSavedClientRequests(participientId: any): Observable<Object[]> {
    return this.http.get('http://192.168.36.120:8083/MarlinAPI/nccplData/getSavedClientRequests/' + participientId)
      .map(this.translateResponse)
      .catch(this.translateError);
  }

  public getSavedClientDetailedRequests(participientId: any): Observable<Object[]> {
    return this.http.get('http://192.168.36.120:8083/MarlinAPI/nccplData/getSavedDetailedClientListing/' + participientId)
      .map(this.translateResponse)
      .catch(this.translateError);
  }

  private translateResponse(res: any) {
    console.log('Response Status------------------------------------' + res.status);
    if (AppUtility.isEmpty(res.text())) {
      return null;
    } else {
      return res.json();
    }
  }

  private translateError(error: any): Observable<Object[]> {
    console.log('Error Status------------------------------------' + error.status);
    if (error.status === 0) {
      return Observable.throw('Problem in connecting to server. Make sure the requesting resource is a valid URL.');
    }
    else if (AppUtility.isEmpty(error.json().message)) {
      return Observable.throw('Error :: Please make sure the server is running.');
    }
    else
      return Observable.throw(error.json().message);

  }




  public getActualPortfolioSummary(userId : Number) : Observable<any>{
    this.urlString = `transactions/portfolio-sum/user/` + userId;
    return this.restService.get(true,this.urlString);
 }
 

 public getActualPortfolioDetail(assetId : Number , userId : Number , transDate : String) : Observable<any>{
  this.urlString = '/transactions/portfolio-det/asset/' + assetId + '/user/' + userId + '/transDate/' + transDate ;
  return this.restService.get(true,this.urlString);
}



 public getCurrencyList() : Observable<any>{
   this.urlString = `exchange-rate/currency`;
   return this.restService.get(true,this.urlString);
}


public getLatestExchangeRateCoefficient(currencyCode : any) : Observable<any> {
  this.urlString =  `exchange-rate/currency-coefficient/${currencyCode}`;
  return this.restService.get(true,this.urlString);
}



public saveNewCurrencyRate(newCurrencyRate): any {
 this.urlString = 'exchange-rate/';
 return this.restService.post(true, this.urlString, newCurrencyRate);
}



  public saveDepository(exchdet: InvestorRegistrationDepositry): any {
    return this.restService.postDepo(true, environment.DepositoryApiUrl, exchdet);
  }


  public getInvestorCDCStatuses(data :any) : Observable<Object[]> {
    this.urlString = 'inv-clients/cdc-status/';
    return this.restService.post(true, this.urlString , data);
  }


  public getInvestorCDCStatusesForClients(data :any) : Observable<Object[]> {
    this.urlString = 'clients/cdc-status/';
    return this.restService.post(true, this.urlString , data);
  }

  

  public getCurrencyCodeList(currencyCode : string) : Observable<any>{
    this.urlString = `exchange-rate/currencyCode/${currencyCode}`;
    return this.restService.get(true,this.urlString);

 }



  public deleteSingleBeneficiaryClients(clientId : Number, beneficiaryId : Number): any {
    this.urlString = "clients/clientID/"+ clientId +"/beneficiary/" + beneficiaryId
    return this.restService.delete(true, this.urlString);
  }


  public deleteSingleJointAccountClients(clientId : Number, jointAccountId : Number): any {
    this.urlString = "clients/clientID/"+ clientId +"/joint-accounts/" + jointAccountId
    return this.restService.delete(true, this.urlString);
  }


  public deleteSingleBankAccountClients(clientId : Number, bankId : Number): any {
    this.urlString = "clients/clientID/"+ clientId +"/bank-accounts-id/" + bankId
    return this.restService.delete(true, this.urlString);
  }

  public deleteSingleDocumentsClients(clientId : Number, documentId : Number): any {
    this.urlString = "clients/clientID/"+ clientId +"/document-id/" + documentId
    return this.restService.delete(true, this.urlString);
  }


  public getCouponPaymentDetail(data) : any{
    this.urlString = 'bondPayments/coupons/';
    return this.restService.post(true, this.urlString, data);
  
  }
  
    
  public getRedemptionPaymentList(data) : any{
    this.urlString = 'bondPayments/redemptions/';
    return this.restService.post(true, this.urlString, data);
  
  }


  public deleteSingleBeneficiary(clientId : Number, beneficiaryId : Number): any {
    this.urlString = "inv-clients/clientID/"+ clientId +"/beneficiary/" + beneficiaryId
    return this.restService.delete(true, this.urlString);
  }


  public deleteSingleJointAccount(clientId : Number, jointAccountId : Number): any {
    this.urlString = "inv-clients/clientID/"+ clientId +"/joint-accounts/" + jointAccountId
    return this.restService.delete(true, this.urlString);
  }


  public deleteSingleBankAccount(clientId : Number, bankId : Number): any {
    this.urlString = "inv-clients/clientID/"+ clientId +"/bank-accounts-id/" + bankId
    return this.restService.delete(true, this.urlString);
  }

  public deleteSingleDocuments(clientId : Number, documentId : Number): any {
    this.urlString = "inv-clients/clientID/"+ clientId +"/document-id/" + documentId
    return this.restService.delete(true, this.urlString);
  }



  public getInvestorProfileStatus(userId : Number) : Observable<Object[]> {
    this.urlString = 'inv-clients/inv-client-userid/' +  userId;
    return this.appUtility.wsGetRequest(this.urlString);
  }



  public getInvestorResidenceStatusList() : Observable<Object[]> {
    this.urlString = 'inv-residence-status/';
    return this.appUtility.wsGetRequest(this.urlString);
  }


  public getInvestorDocumentsTypeList() : Observable<Object[]> {
    this.urlString = 'inv-document-types/owner-flag/C/';
    return this.appUtility.wsGetRequest(this.urlString);
  }


public getAccountTypeInvestorList() : Observable<Object[]> {
    this.urlString = 'accountType/';
    return this.appUtility.wsGetRequest(this.urlString);
  }


  public getIdentificationTypeListBaseOnAccType(accountType : String) : Observable<Object[]> {
    this.urlString = 'lookups/identification-types/account-type/' + accountType;
    return this.appUtility.wsGetRequest(this.urlString);
  }  


  public getAccountCategoryList(): Observable<Object[]> {
    this.urlString = 'accountCategory/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public updateTransaction(transdet: TransactionDetail): any {
    return this.restService.put(true, 'transactions/', transdet);
  }

  public updateTransactionStatus(transIdList: String[], status: String): any {
    return this.restService.put(true, 'transactions/mark-as/' + status, transIdList);
  }
  public saveExchange(exchdet: Exchange): any {
    return this.restService.post(true, 'exchanges/', exchdet);
  }

  public updateExchange(exchdet: Exchange): any {
    return this.restService.put(true, 'exchanges/', exchdet);
  }

  public saveMarket(exchdet: Market): any {
    return this.restService.post(true, 'markets/', exchdet);
  }
  public updateMarket(exchdet: Market): any {
    return this.restService.put(true, 'markets/', exchdet);
  }

  public saveSettlementType(settypedet: SettlementType): any {
    return this.restService.post(true, 'settlementTypes/', settypedet);
  }

  public updateSettlementType(settypedet: SettlementType): any {
    return this.restService.put(true, 'settlementTypes/', settypedet);
  }

  // public updateSettlementCalendar(sc: SettlementCalendar): any {
  //   return this.restService.put(true,'settlementCalendars/updateSettlementCalander/', sc);
  // }
  // public generateSettlementCalendar(sc: SettlementCalendar): any {
  //   return this.restService.post(true,'settlementCalendars/generateSettlementCalander/', sc);
  // }

  public updateSettlementCalendar(sc: any): any {
    return this.restService.put(true, 'settlementCalendars/updateSettlementCalander/', sc);
  }
  public generateSettlementCalendar(sc: any): any {
    return this.restService.post(true, 'settlementCalendars/generateSettlementCalander/', sc);
  }

  // for Sector form
  public saveSector(secdet: Sector): any {
    return this.restService.post(true, 'sectors/', secdet);
  }
  public updateSector(secdet: Sector): any {
    return this.restService.put(true, 'sectors/', secdet);
  }


  // for country form
  public saveCountry(condet: Country): any {
    return this.restService.post(true, 'countries/', condet);
  }
  public updateCountry(condet: Country): any {
    return this.restService.put(true, 'countries/', condet);
  }

  // for bank form
  public saveBank(condet: Bank): any {
    return this.restService.post(true, 'banks/', condet);
  }
  public updateBank(condet: Bank): any {
    return this.restService.put(true, 'banks/', condet);
  }

  // Account Opening Balance
  public getOpeningBalanceDefiningPriviledge(participantId: Number): Observable<Object[]> {
    this.urlString = 'fiscal-year-balance/participantId/' + participantId + '/valid-for-opening-balance/';
    return this.restService.get(true, this.urlString);
  }

  public getOpeningBalanceForChartOfAccount(participantId: Number, chartOfAccountId: number): Observable<Object[]> {
    this.urlString = 'fiscal-year-balance/participantId/' + participantId + '/chart-of-accounts/' + chartOfAccountId;
    return this.restService.get(true, this.urlString);
  }

  public saveFiscalYearBalance(condet: any): any {
    return this.restService.post(true, 'fiscal-year-balance/', condet);
  }
  public updateFiscalYearBalance(condet: any): any {
    return this.restService.put(true, 'fiscal-year-balance/', condet);
  }

  // for Stock depost withdraw form
  public saveStockDepositWithdraw(condet: StockDepositWithdraw): any {
    return this.restService.post(true, 'stock-ledger/', condet);

  }
  public updateStockDepositWithdraw(condet: StockDepositWithdraw): any {
    return this.restService.put(true, 'stock-ledger/', condet);
  }
  public updateStockStatus(stockIdsList: String[], status: String): any {
    return this.restService.put(true, 'stock-ledger/mark-as/' + status, stockIdsList);
  }

  // for Fiscal year form
  public saveFiscalYear(condet: FiscalYear): any {
    return this.restService.post(true, 'fiscal-years/', condet);
  }
  public updateFiscalYear(condet: FiscalYear): any {
    return this.restService.put(true, 'fiscal-years/', condet);
  }

  // for chart of accounts
  public saveChartOfAccount(condet: ChartOfAccount): any {
    return this.restService.post(true, 'chart-of-accounts/', condet);
  }
  public updateChartOfAccount(condet: ChartOfAccount): any {
    return this.restService.put(true, 'chart-of-accounts/', condet);
  }

  // for bank branch form
  public saveBankBranch(condet: BankBranch): any {
    return this.restService.post(true, 'bank-branches/', condet);
  }
  public updateBankBranch(condet: BankBranch): any {
    return this.restService.put(true, 'bank-branches/', condet);
  }

  public saveApplicationSetup(condet: any): any {
    return this.restService.post(true, 'participants/application-setups/', condet);
  }

  // for Commission Slab form
  public saveCommissionSlab(condet: CommissionSlabDetail[]): any {
    return this.restService.post(true, 'commission-slabs/', condet);
  }
  public updateCommissionSlab(condet: CommissionSlabDetail[]): any {
    return this.restService.put(true, 'commission-slabs/', condet);
  }

  // for Clearing House Levis Page
  public saveClearingHouseLevis(condet: ClearingHouseLeviesDetail[]): any {
    return this.restService.post(true, 'ch-levies/', condet);
  }
  public updateClearingHouseLevis(condet: ClearingHouseLeviesDetail[]): any {
    return this.restService.put(true, 'ch-levies/', condet);
  }


  // for Security form
  public saveSecurity(exchdet: Security): any {
    return this.restService.post(true, 'securities/', exchdet);
  }
  public updateSecurity(exchdet: Security): any {
    return this.restService.put(true, 'securities/', exchdet);
  }

  // for city form
  public saveCity(citydet: City): any {
    return this.restService.post(true, 'cities/', citydet);
  }
  public updateCity(citydet: City): any {
    return this.restService.put(true, 'cities/', citydet);
  }


  // for registrar form
  public saveRegistrar(regdet: Registrar): any {
    return this.restService.post(true, 'registrars/', regdet);
  }
  public updateRegistrar(regdet: Registrar): any {
    return this.restService.put(true, 'registrars/', regdet);
  }

  // for exchange market Association form
  public saveExchangeMarketAssociationList(excmktdet: EMAssociation): any {
    return this.restService.post(true, 'exchange-markets/', excmktdet);
  }
  public updateExchangeMarketAssociationList(excmktdet: EMAssociation): any {
    return this.restService.put(true, 'exchange-markets/', excmktdet);
  }

  // For Exchange Market Security Form
  public updateAgent(ags: Agent): any {
    return this.restService.put(true, 'agents/', ags);
  }
  public saveAgent(ags: Agent): any {
    return this.restService.post(true, 'agents/', ags);
  }

  // for holidays form
  public savePublicHolidayList(phdet: PublicHoliday): any {
    return this.restService.post(true, 'holidays/publicHolidays/', phdet);
  }
  public updatePublicHolidayList(phdet: PublicHoliday): any {
    return this.restService.put(true, 'holidays/publicHolidays/', phdet);
  }
  public saveWeeklyOffDays(phdet: WeeklyOffDay): any {
    return this.restService.post(true, 'holidays/weeklyOffs/', phdet);
  }

  // For SRO page
  public saveSRO(sro: SRO): any {
    return this.restService.post(true, 'sro/', sro);
  }

  public updateSRO(sro: SRO): any {
    return this.restService.put(true, 'sro/', sro);
  }

  // for Terminal Binding Page
  public saveUserBinding(usBind: UserBinding): any {
    return this.restService.post(true, 'client-user-binding/', usBind);
  }

  public updateUserBinding(usBind: UserBinding): any {
    return this.restService.put(true, 'client-user-binding/', usBind);
  }

  public deleteUserBinding(usBind: UserBinding): any {
    // I Sahib Yar, is using 'Put' for delete, because that is what I was told to do
    // by Sir Asif,
    return this.restService.put(true, 'client-user-binding/delete/', usBind);
  }


  //
  public updateExchangeMarketSecurity(ems: ExchangeMarketSecurity): any {
    return this.restService.put(true, 'exchange-market-securities/', ems);
  }
  public saveExchangeMarketSecurity(ems: ExchangeMarketSecurity): any {
    return this.restService.post(true, 'exchange-market-securities/', ems);
  }

  public updateSecurityDailyIndicator(ems: SecurityDailyIndicator): any {
    return this.restService.put(true, 'security-daily-indicator/', ems);
  }
  public saveSecurityDailyIndicator(ems: SecurityDailyIndicator): any {
    return this.restService.post(true, 'security-daily-indicator/', ems);
  }


  public saveClient(phdet: Client): any {
    return this.restService.post(true, 'clients/', phdet);
  }

  public updateClient(phdet: Client): any {
    return this.restService.put(true, 'clients/', phdet);
  }


  public saveInvestor(phdet: Client): any {
    console.log(phdet);
    return this.restService.post(true, 'inv-clients/', phdet);
  }

  public saveRDAClient(phdet: RdaClient): any {
    return this.restService.post(true, 'clients/approve', phdet);
  }
  public updateClientBasicInfo(phdet: Client): any {
    return this.restService.put(true, 'clients/update/basic-info/', phdet);
  }
  public updateClientContatDetail(phdet: Client): any {
    return this.restService.put(true, 'clients/update/contact-info/', phdet);
  }
  public updateClientSystemAccess(phdet: Client): any {
    return this.restService.put(true, 'clients/update/system-access/', phdet);
  }
  public updateClientBankAccount(phdet: Client): any {
    return this.restService.put(true, 'clients/update/bank-account/', phdet);
  }
  public updateClientAppliedLevy(phdet: Client): any {
    return this.restService.put(true, 'clients/update/applied-levy/', phdet);
  }
  public updateClientJointAccount(phdet: Client): any {
    return this.restService.put(true, 'clients/update/joint-account/', phdet);
  }
  public updateClientDocuments(phdet: Client): any {
    return this.restService.put(true, 'clients/update/documents/', phdet);
  }
  public updateClientBeneficiary(phdet: Client): any {
    return this.restService.put(true, 'clients/update/beneficaries/', phdet);
  }

  public updateDepoUser(depo: DepoUser): any {
    return this.restService.put(true, 'depo/', depo);
  }

  //for client levy form
  public saveLevies(levydet: ClientLevieDetail[]): any {
    return this.restService.post(true, "levies/", levydet);
  }

  public updateLevies(levydet: ClientLevieDetail[]): any {
    return this.restService.put(true, 'levies/', levydet);
  }

  public updateClientExchanges(phdet: Client): any {
    return this.restService.put(true, "clients/update/client-exchange/", phdet);
  }
  public updateClientMarkets(phdet: Client): any {
    return this.restService.put(true, "clients/update/client-markets/", phdet);
  }
  public updateClientCustodians(phdet: Client): any {
    return this.restService.put(true, "clients/update/client-custodians/", phdet);
  }

  // for Voucher Type form
  public saveVoucherType(condet: VoucherType): any {
    return this.restService.post(true, 'voucher-types/', condet);
  }
  public updateVoucherType(condet: VoucherType): any {
    return this.restService.put(true, 'voucher-types/', condet);
  }
  public updateVoucherStatus(vousIdList: String[], status: String): any {
    return this.restService.put(true, 'vouchers/mark-as/' + status, vousIdList);
  }
  public deleteVoucher(voucherMasterId: Number): any {
    return this.restService.get(true, 'vouchers/voucherId/' + voucherMasterId);
  }
  // for voucher Page
  public saveVoucher(condet: voucherDetail[]): any {
    debugger
    return this.restService.post(true, 'vouchers/', condet);
  }
  public updateVoucher(condet: voucherDetail[]): any {
    return this.restService.put(true, 'vouchers/', condet);
  }
  public saveRole(condet: Role): any {
    return this.restService.post(true, 'roles/', condet);
  }
  public updateRole(condet: Role): any {
    return this.restService.put(true, 'roles/', condet);
  }
  public saveRolePrivileges(exchdet: RolePrivilege): any {
    return this.restService.post(true, 'roles/privs/save/', exchdet);
  }
  public saveUser(condet: User): any {
    return this.restService.post(true, 'users/', condet);
  }
  public updateUser(condet: User): any {
    return this.restService.put(true, 'users/', condet);
  }
  public updateSettlementStatus(settlementIdList: String[], status: String, participantId: Number): any {
    if (status == 'P')
      return this.restService.put(true, 'settlementCalendars/process-settlement/participantId/' + participantId, settlementIdList);
    else
      return this.restService.put(true, 'settlementCalendars/reverse-settlement/participantId/' + participantId, settlementIdList);
  }
  // public saveApplicationSetup(condet: ApplicationSetup): any {
  //   return this.restService.post(true,'participants/application-setups/', condet);
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
    return this.restService.get(true, this.urlString);
  }

  public getSettlementCalenderBy_ExchangeId_Status_TradeDate(participantId: Number, exchangeId: Number, tradeDate: Date, status: String): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(tradeDate, 'yyyy-MM-dd');
    this.urlString = 'settlementCalendars/settlement-process/search/participantId/' + participantId + '/exchangeId/' + exchangeId + '/trade-date/' + formatted + '/status/' + status;
    return this.restService.get(true, this.urlString);
  }

  public getSettlementCalendarByTradeDate(tradeDate: Date, isProcessed: Boolean, participantId: Number): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(tradeDate, 'yyyy-MM-dd');
    this.urlString = 'settlementCalendars/' + formatted + '/' + isProcessed + '/participantId/' + participantId + '/';
    return this.restService.get(true, this.urlString);
  }

  public getAllSettlementCalendarByTradeDate(tradeDate: Date, participantId: Number): Observable<Object[]> {
    let formatted = new DatePipe('en-US').transform(tradeDate, 'yyyy-MM-dd');
    this.urlString = 'settlementCalendars/' + formatted + '/participantId/' + participantId + '/';
    return this.restService.get(true, this.urlString);
  }

  public getParticipantSecurityExchanges(brokerId: number): Observable<Object[]> {
    this.urlString = 'participants/' + brokerId + '/exchange-market-securities/';
    return this.restService.get(true, this.urlString);
  }

  public getParticipantSecurityExchangesByMarket(brokerId: number, marketType: String): Observable<Object[]> {
    this.urlString = 'participants/' + brokerId + '/exchange-market-securities/marketType/' + marketType + '/';
    return this.restService.get(true, this.urlString);
  }

  public getParticipantSecurityExchangesByBaseMarket(brokerId: number): Observable<Object[]> {
    this.urlString = 'participants/' + brokerId + '/exchange-baseMarket-securities/';
    return this.restService.get(true, this.urlString);
  }

  public getExchangeListByBroker(brkerCode: string): Observable<Object[]> {
    this.urlString = 'exchanges/';
    return this.restService.get(true, this.urlString);
  }

  public getMarketListByExchange(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/';
    return this.restService.get(true, this.urlString);
  }

  public getMarketListByExchangeForBondPayment(exchangeId: Number): Observable<any[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/';
    return this.restService.get(true, this.urlString);
  }

  public getIndexListByExchangeId(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'reports/get-indexes-code/exchange/' + exchangeId + '/';
    return this.restService.get(true, this.urlString);
  }

  public getSymbolListByExchangeMarket(exchangeId: Number, marketId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/securities/';
    return this.restService.get(true, this.urlString, false);
  }

  public getSymbolListByExchangeMarketStatus(exchangeId: Number, marketId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/securities/' + status;
    return this.restService.get(true, this.urlString, false);
  }

  public getSymbolListByExchangeMarketandSettlementType(exchangeId: Number, marketId: Number, settlementTypeId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/settlement-type/' + settlementTypeId + '/securities/' + status;
    return this.restService.get(true, this.urlString, false);
  }

  public getClientCustodian(clientId: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientId + '/custodians/';
    return this.restService.get(true, this.urlString, false);
  }

  public getSymbolMarket(exchangeId: number, marketId: number, symbolId: number): Observable<Object[]> {
    //this.urlString = './app/services/demo_data/symbol.json';
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/securities/' + symbolId + '/securityMarket/';
    AppUtility.printConsole(' symbol market url: ' + this.urlString);
    return this.restService.get(true, this.urlString, false);
  }

  // for exchange form
  public getExchangeList(): Observable<Object[]> {
    this.urlString = 'exchanges/';
    return this.restService.get(true, this.urlString);
  }

  public getReceivableCommissionPayables(participantId: number) {
    this.urlString = 'participants/' + participantId + '/settlement-params/';
    return this.restService.get(true, this.urlString);
  }

  public getSectorsByExchange(exchangeId: number): any {
    this.urlString = 'exchanges/' + exchangeId + '/sectors/';
    return this.restService.get(true, this.urlString);
  }

  public getTransactionTypeByExchange(exchangeId: Number): any {
    this.urlString = 'exchanges/' + exchangeId + '/transaction-types/';
    return this.restService.get(true, this.urlString);
  }

  public getTransactionTypeByExchangeMarket(exchangeId: Number, marketId: Number): any {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/transaction-types/';
    return this.restService.get(true, this.urlString);
  }

  public getFCDays(exchangeId: Number, settlementCalendarId: Number, participantId: Number): any {
    this.urlString = 'transactions/fc-days/exchanges/' + exchangeId + '/settlement-calendar/' + settlementCalendarId + '/participants/' + participantId + '/';
    return this.restService.get(true, this.urlString);
  }


  public getCountryList(): Observable<Object[]> {
    //  var _status: String = '';
    // if (_active) _status = 'TRUE';
    // else _status = 'FALSE';

    this.urlString = 'countries/';
    return this.restService.get(true, this.urlString);
  }

  public getBanksList(participantId: Number, _active: Boolean): Observable<Object[]> {
    let _status: String = '';
    if (_active) _status = 'TRUE';
    else _status = 'FALSE';

    // False if we want to get all the Banks List
    // True  if we want get only active Banks List
    this.urlString = 'participants/' + participantId + '/banks/' + _status;
    return this.restService.get(true, this.urlString);
  }

  public getFiscalYearList(participantId): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/fiscal-years/false';
    AppUtility.printConsole("Url: " + this.urlString);
    return this.restService.get(true, this.urlString);
  }


  public getStockDepositWithdrawList(participantId, transFromDate, transToDate, type, posted): Observable<Object[]> {
    //this.urlString = /participants/1/stock-ledger/trans-date/2010-09-30/trans-type/D/posted/true';
    this.urlString = 'participants/' + participantId + '/stock-ledger/trans-from-date/' + transFromDate + '/trans-to-date/' + transToDate + '/posted/' + posted;
    AppUtility.printConsole("Url: " + this.urlString);
    return this.restService.get(true, this.urlString);
  }

  public getClientSecurityBalanceByParticipant(exchangeId, participantId, clientId, securityId): Observable<Object[]> {
    this.urlString = 'clients/exchangeID/' + exchangeId + '/participantID/' + participantId + '/clientID/' + clientId + '/securityID/' + securityId + '/security-balance/';
    AppUtility.printConsole("Url: " + this.urlString);
    return this.restService.get(true, this.urlString);
  }
  public getClientSecurityBalanceByCustodian(exchangeId, participantId, custodianId, clientId, securityId): Observable<Object[]> {
    this.urlString = 'clients/exchangeID/' + exchangeId + '/participantID/' + participantId + '/clientID/' + clientId + '/securityID/' + securityId + '/custodianID/' + custodianId + '/security-balance/';
    AppUtility.printConsole("Url: " + this.urlString);
    return this.restService.get(true, this.urlString);
  }
  public getClientSecurityPledgedBalance(exchangeId, participantId, clientId, securityId, entryType): Observable<Object[]> {
    this.urlString = 'clients/exchangeID/' + exchangeId + '/participantID/' + participantId + '/clientID/' + clientId + '/securityID/' + securityId + '/entryType/' + entryType + '/security-balance/';
    AppUtility.printConsole("Url: " + this.urlString);
    return this.restService.get(true, this.urlString);
  }

  public getCommissionSlabList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/commission-slabs/';
    return this.restService.get(true, this.urlString);
  }

  public getCommissionSlabDetailsList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/commission-slabs-detail/';
    return this.restService.get(true, this.urlString);
  }

  public getBankBranchList(participantId: Number, _active: Boolean): Observable<Object[]> {
    let _status: String = '';
    if (_active) _status = 'TRUE';
    else _status = 'FALSE';

    // False if we want to get all the Branch List
    // True  if we want get only active Branch List
    this.urlString = 'participants/' + participantId + '/bank-branches/' + _status;
    return this.restService.get(true, this.urlString);
  }

  public getSlabCommissionDetailList(_commissionSlabId: Number): Observable<Object[]> {
    this.urlString = 'commission-slabs/' + _commissionSlabId + '/slab-details/';
    return this.restService.get(true, this.urlString);
  }

  public getClearingHouseLeviesList(_exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + _exchangeId + '/levies/';
    // this.urlString = 'exchanges/1/levies/';

    return this.restService.get(true, this.urlString);
  }

  public getClearingHouseLeviesDetailList(_chLevyMasterId: Number): Observable<Object[]> {
    this.urlString = 'ch-levies/' + _chLevyMasterId + '/details/FALSE';
    // this.urlString = 'ch-levies/1/details/TRUE';

    return this.restService.get(true, this.urlString);
  }

  public getCityListByCountry(countryId: Number): Observable<Object[]> {
    // var _status: String = '';
    // if (_active) _status = 'true';
    // else _status = 'false';

    this.urlString = 'countries/' + countryId + '/cities/';
    //this.urlString = './app/services/demo_data/transactions.json';
    return this.restService.get(true, this.urlString);
  }

  public getProvinceListByCountry(countryId: Number): Observable<Object[]> {
    this.urlString = 'lookups/provinces/' + countryId;
    return this.restService.get(true, this.urlString);
  }

  public getCityListByProvince(provinceId: Number): Observable<Object[]> {
    this.urlString = 'lookups/cities/' + provinceId;
    return this.restService.get(true, this.urlString);
  }

  public getDistrictListByProvince(provinceId: Number): Observable<Object[]> {
    this.urlString = 'lookups/districts/' + provinceId;
    return this.restService.get(true, this.urlString);
  }

  public getCityList(): Observable<Object[]> {
    this.urlString = 'cities/';
    //this.urlString = './app/services/demo_data/transactions.json';
    return this.restService.get(true, this.urlString);
  }

  // for market form
  public getMarketList(): Observable<Object[]> {
    this.urlString = 'markets/';
    return this.restService.get(true, this.urlString);
  }
  public getActiveMarketList(): Observable<Object[]> {
    this.urlString = 'markets/active/';
    return this.restService.get(true, this.urlString);
  }
  public getAllBaseMarketList(): Observable<Object[]> {
    this.urlString = 'markets/baseMarkets/';
    return this.restService.get(true, this.urlString);
  }

  public getMarketTypeList(): Observable<Object[]> {
    this.urlString = 'marketTypes/';
    return this.restService.get(true, this.urlString);
  }
  public getBaseMarketList(marketTypeId: Number): Observable<Object[]> {
    this.urlString = 'marketTypes/' + marketTypeId + '/markets/';
    return this.restService.get(true, this.urlString);
  }

  // for settlement-type form
  public getAllSettlementTypesList(): Observable<Object[]> {
    this.urlString = 'settlementTypes/false';
    return this.restService.get(true, this.urlString);
  }

  public getSettlementCalenderCountBySettlementTypeId(settlementTypeId: Number) {
    this.urlString = 'settlementCalendars/get-settlement-calendar-count/settlementTypeId/' + settlementTypeId;
    return this.restService.get(true, this.urlString);
  }

  // for settlement-type form
  public getActiveSettlementTypesList(): Observable<Object[]> {
    this.urlString = 'settlementTypes/true';
    return this.restService.get(true, this.urlString);
  }
  // for settlementCalendar from
  public getSettlementCalendarList(): Observable<Object[]> {
    this.urlString = 'settlementCalendars/';
    return this.restService.get(true, this.urlString);
  }
  // for security form
  public getSecurityList(): Observable<Object[]> {
    this.urlString = 'securities/';
    return this.restService.get(true, this.urlString);
  }

  public getSecurityByMarketType(marketId: number): Observable<Object[]> {
    this.urlString = 'securities/byMarketType/' + marketId;
    return this.restService.get(true, this.urlString);
  }

  public getSecurityByExchangeMarket(exchangeId: number, marketId: number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/securities/true/';
    return this.restService.get(true, this.urlString);
  }
  // for stock screen, securites by exchange
  public getSecurityListByExchagne(exchangeId): Observable<Object[]> {
    this.urlString = 'securities/byExchange/' + exchangeId + '/active/true';
    return this.restService.get(true, this.urlString);
  }

  public getSecurityTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/securityTypes/';
    return this.restService.get(true, this.urlString);
  }
  public getRegistrarList(): Observable<Object[]> {
    this.urlString = 'registrars/';
    return this.restService.get(true, this.urlString);
  }

  public getActiveRegistrarList(isRegistrar:number): Observable<Object[]> {
    this.urlString = 'registrars/active/isRegistrar/' + isRegistrar;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSecurityById(securityId: number): Observable<Object> {
    this.urlString = 'securities/id/' + securityId;
    return this.restService.get(true, this.urlString);
  }

  // for sectors form
  public getSectorsList(): Observable<Object[]> {
    this.urlString = 'sectors/';
    return this.restService.get(true, this.urlString);
  }
  public getActiveSectorsList(): Observable<Object[]> {
    this.urlString = 'sectors/active/';
    return this.restService.get(true, this.urlString);
  }

  public getBondCategoryList(): Observable<Object[]> {
    this.urlString = 'lookups/bondCategories/';
    return this.restService.get(true, this.urlString);
  }
  public getBondTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/bondTypes/';
    return this.restService.get(true, this.urlString);
  }
  public getCouponFrequencyList(): Observable<Object[]> {
    this.urlString = 'lookups/couponFrequencies/';
    return this.restService.get(true, this.urlString);
  }
  // for exchange market security form
  public getExchangeMarketSecurities(): Observable<Object[]> {
    this.urlString = 'exchange-market-securities/';
    return this.restService.get(true, this.urlString);
  }
  public generateBondPaymentSchedual(securityId: number): Observable<Object[]> {
    this.urlString = 'bondPaymentSchedules/generate/securityID/' + securityId;
    return this.restService.get(true, this.urlString);
  }
  public getBondPaymentSchedual(exchangeId: number, marketId: number, securityId: number): Observable<Object[]> {
    this.urlString = 'bondPaymentSchedules/get/exchangeID/' + exchangeId + '/marketID/' + marketId + '/securityID/' + securityId;
    return this.restService.get(true, this.urlString);
  }
  public getCustodianByExchange(exchangeid: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeid + '/custodians/';
    return this.restService.get(true, this.urlString);
  }

  public getExchangeMarketSecuritiesByParam(exchangeId: number, marketId: number, securityId: number): Observable<Object[]> {
    this.urlString = 'exchange-market-securities/exchange/' + exchangeId + '/markets/' + marketId + '/securities/' + securityId;
    return this.restService.get(true, this.urlString);
  }

  public populateSecurityDailyIndicatorDetail(exchangeId: number, marketId: number, securityId: number, stats_Date: Date): Observable<Object[]> {
    let statsDate = new DatePipe('en-US').transform(stats_Date, 'yyyy-MM-dd');
    this.urlString = 'security-daily-indicator/exchanges/' + exchangeId + '/markets/' + marketId + '/securities/' + securityId + '/statsDate/' + statsDate;
    return this.restService.get(true, this.urlString);
  }

  public getSecurityStates(): Observable<Object[]> {
    this.urlString = 'lookups/securityStates/';
    return this.restService.get(true, this.urlString);
  }
  public getDayCountConventions(): Observable<Object[]> {
    this.urlString = 'lookups/dayCountConventions/';
    return this.restService.get(true, this.urlString);
  }
  // for exchange market Association form
  public getExchangeMarketAssociationList(): Observable<Object[]> {
    this.urlString = 'exchange-markets/';
    return this.restService.get(true, this.urlString);
  }

  public getOrderTypesList(): Observable<Object[]> {
    this.urlString = 'lookups/orderTypes/';
    return this.restService.get(true, this.urlString);
  }

  public getOrderQualifiersList(): Observable<Object[]> {
    this.urlString = 'lookups/orderQualifiers/';
    return this.restService.get(true, this.urlString);
  }

  public getTifOptionsList(): Observable<Object[]> {
    this.urlString = 'lookups/tifOptions/';
    return this.restService.get(true, this.urlString);
  }

  public getOrderTypesByExchangeMarket(exchangeId: Number, marketId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/orderTypes/';
    return this.restService.get(true, this.urlString);
  }

  public getOrderQualifiersByExchangeMarket(exchangeId: Number, marketId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/orderQualifiers/';
    return this.restService.get(true, this.urlString);
  }

  public getTifOptionsByExchangeMarket(exchangeId: Number, marketId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/markets/' + marketId + '/tifOptions/';
    return this.restService.get(true, this.urlString);
  }


  public getPublicHolidaysByExchange(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/publicHolidays/';
    return this.restService.get(true, this.urlString);
  }

  public getWeeklyOffByExchange(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/weeklyOffDays/';
    return this.restService.get(true, this.urlString);
  }

  public getWeekDaysLookup(): Observable<Object[]> {
    this.urlString = 'lookups/weekDays/';
    return this.restService.get(true, this.urlString);
  }

  public getAgentsbyParticipant(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/agents/false';
    return this.restService.get(true, this.urlString);
  }

  // for SRO form
  public getSROListByBroker(brkerId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = "participants/" + brkerId + "/sro/" + status;
    return this.restService.get(true, this.urlString);
  }

  public getSROListByBrokerAndName(brkerId: Number, name: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-sro/name/' + name;
    return this.restService.get(true, this.urlString);
  }

  public getSROListByBrokerAndCNIC(brkerId: Number, cnic: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-sro/cnic/' + cnic;
    return this.restService.get(true, this.urlString);
  }

  public getSROListByBrokerAndNameAndCNIC(brkerId: Number, name: string, cnic: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-sro/name/' + name + '/cnic/' + cnic;
    return this.restService.get(true, this.urlString);
  }


  public getInvestorListByParticipant(participantId: Number): Observable<Object[]> {
    this.urlString = "inv-clients/participant-id/"+ participantId;
    return this.restService.get(true, this.urlString);
  }


  public getInvestorListBySearch(participantId: Number, investorName : any , taxNumber : any): Observable<Object[]> {
    this.urlString = "inv-clients/inv-client-name/" + investorName + "/inv-client-tax/" + taxNumber + "/participant-id/" + participantId;
    return this.restService.get(true, this.urlString);
  }

 

  // for clients form
  public getClientListByBroker(brkerId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = "participants/" + brkerId + "/clients/" + status;
    return this.restService.get(true, this.urlString);
  }

  public getClientBasicInfoListByBroker(brkerId: Number, status: Boolean): Observable<Object[]> {
    this.urlString = "participants/" + brkerId + "/clients-basic-info/" + status;
    return this.restService.get(true, this.urlString);
  }

  public getClientUserBindings(participantID: number, userId: number, clientId: number) {
    this.urlString = "client-user-binding/participantId/" + participantID + "/userId/" + userId + "/clientId/" + clientId;
    return this.restService.get(true, this.urlString);
  }

  public getSROByReference(refNo: string) {
    this.urlString = "sro/docRef/" + refNo;
    return this.restService.get(true, this.urlString);
  }

  public getClientByCNIC(cnic: string) {
    this.urlString = "clients/" + cnic + "/";
    return this.restService.get(true, this.urlString);
  }

  public getClientByNAME(name: string) {
    this.urlString = "clients/name/" + name;
    return this.restService.get(true, this.urlString);
  }

  public getAllSRO() {
    this.urlString = "sro/";
    return this.restService.get(true, this.urlString);
  }
  public getAllAmlData() {
    this.urlString = "AML/";
    return this.restService.get(true, this.urlString);
  }
  public getAmlDataByParticipantId(participantID: Number) {
    this.urlString = "AML/participantID/" + participantID;
    return this.restService.get(true, this.urlString);
  }
  // For AML page - SRO Data Entry page
  public saveAMLData(amldata: AMLDATA): any {
    return this.restService.post(true, 'AML/', amldata);
  }

  public updateAmlData(amldata: AMLDATA): any {
    return this.restService.put(true, 'AML/', amldata);
  }

  public deleteAmlData(amldata: AMLDATA): any {
    return this.restService.delete(true, 'AML/', amldata);
  }

  public getClientListByExchangeBroker(exchagneId: Number, brokerId: Number, status: Boolean, orderBy: boolean = true): Observable<Object[]> {
    this.urlString = "participants/" + brokerId + "/exchanges/" + exchagneId + "/clients/" + status + "/asc/" + orderBy;
    return this.restService.get(true, this.urlString);
  }

  public getClientBasicInfoListByExchangeBroker(exchagneId: Number, brokerId: Number, status: Boolean, orderBy: boolean = true): Observable<Object[]> {
    this.urlString = "participants/" + brokerId + "/exchanges/" + exchagneId + "/clients-basic-info/" + status + "/asc/" + orderBy + '/';
    return this.restService.get(true, this.urlString);
  }

  public getClientBasicInfoListByExchangeBrokerAgent(exchagneId: Number, brokerId: Number, agentId: Number, status: Boolean, orderBy: boolean = true): Observable<Object[]> {
    this.urlString = "participants/" + brokerId + "/exchanges/" + exchagneId + "/agents/" + agentId + "/clients-basic-info/" + status + "/asc/" + orderBy + '/';
    return this.restService.get(true, this.urlString);
  }

  //  These are non Binded Search Clients
  public getClientListByBrokerAndClientCodeAndClientName(brkerId: Number, clientCode: string, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-clients/code/' + clientCode + '/name/' + clientName;
    return this.restService.get(true, this.urlString);
  }
  public getClientListByBrokerAndClientCode(brkerId: Number, clientCode: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-clients/code/' + clientCode;
    return this.restService.get(true, this.urlString);
  }
  public getClientListByBrokerAndClientName(brkerId: Number, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-clients/name/' + clientName;
    return this.restService.get(true, this.urlString);
  }

  public getClientListByBrokerAndExchangeAndClientCodeAndClientName(brkerId: Number, exId: Number, clientCode: string, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-clients/code/' + clientCode + '/name/' + clientName;
    return this.restService.get(true, this.urlString);
  }
  public getClientListByBrokerAndExchangeAndClientCode(brkerId: Number, exId: Number, clientCode: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-clients/code/' + clientCode;
    return this.restService.get(true, this.urlString);
  }
  public getClientListByBrokerAndExchangeAndClientName(brkerId: Number, exId: Number, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-clients/name/' + clientName;
    return this.restService.get(true, this.urlString);
  }
  //  These are Binded Search Clients
  public getBindedClientListByBrokerAndClientCodeAndClientName(brkerId: Number, clientCode: string, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-binded-clients/code/' + clientCode + '/name/' + clientName;
    return this.restService.get(true, this.urlString);
  }
  public getBindedClientListByBrokerAndClientCode(brkerId: Number, clientCode: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-binded-clients/code/' + clientCode;
    return this.restService.get(true, this.urlString);
  }
  public getBindedClientListByBrokerAndClientName(brkerId: Number, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/search-binded-clients/name/' + clientName;
    return this.restService.get(true, this.urlString);
  }

  public getBindedClientListByBrokerAndExchangeAndClientCodeAndClientName(brkerId: Number, exId: Number, clientCode: string, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-binded-clients/code/' + clientCode + '/name/' + clientName;
    return this.restService.get(true, this.urlString);
  }
  public getBindedClientListByBrokerAndExchangeAndClientCode(brkerId: Number, exId: Number, clientCode: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-binded-clients/code/' + clientCode;
    return this.restService.get(true, this.urlString);
  }
  public getBindedClientListByBrokerAndExchangeAndClientName(brkerId: Number, exId: Number, clientName: string): Observable<Object[]> {
    this.urlString = 'participants/' + brkerId + '/exchangeId/' + exId + '/search-binded-clients/name/' + clientName;
    return this.restService.get(true, this.urlString);
  }
  public getClientById(participantID: Number, clientID: Number): any {
    this.urlString = 'clients/participantID/' + participantID + '/clientID/' + clientID;
    return this.restService.get(true, this.urlString);
  }


  public getInvestorByUserId(UserId : Number): any {
    this.urlString = 'inv-clients/user-id/' + UserId;
    return this.restService.get(true, this.urlString);
  }


  public getInvestorByClientId(ClientId : Number): any {
    this.urlString = 'inv-clients/invclientid/' + ClientId;
    return this.restService.get(true, this.urlString);
  }

 

  public getGLParams(participantID: Number): any {
    this.urlString = 'participants/' + participantID + "/gl-params/";
    return this.restService.get(true, this.urlString);
  }
  public getHeadLevelDetails(participantID: Number): any {
    this.urlString = 'participants/' + participantID + "/head-level-details/";
    return this.restService.get(true, this.urlString);
  }
  public getLastHeadLevel(participantID: Number): any {
    this.urlString = 'participants/' + participantID + '/head-level-details/last-level/';
    return this.restService.get(true, this.urlString);
  }
  public getClientControlAccount(participantID: Number): any {
    this.urlString = 'participants/' + participantID + '/client-control-account/';
    return this.restService.get(true, this.urlString);
  }
  public getActiveAgentsbyParticipant(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/agents/true';
    return this.restService.get(true, this.urlString);
  }
  public getDashboardsbyParticipantAndUserTypeAndRoles(participantId: Number, userTypeId: Number, rolesList: string = ''): Observable<Object[]> {
    this.urlString = 'users/assigned-modules/participantId/' + participantId + '/userTypeId/' + userTypeId + '/rolesList/' + rolesList;
    return this.restService.get(true, this.urlString);
  }
  public getClientBankAccountList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/bank-accounts/';
    return this.restService.get(true, this.urlString);
  }


  public getInvClientBankAccountList(clientID: Number): Observable<Object[]> {
    this.urlString = 'inv-clients/clientID/' + clientID + '/bank-accounts/';
    return this.restService.get(true, this.urlString);
  }



  public getClientBeneficiaryList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/' + clientID + '/beneficiary';
    return this.restService.get(true, this.urlString);
  }


  public getInvClientBeneficiaryList(clientID: Number): Observable<Object[]> {
    this.urlString = 'inv-clients/clientID/' + clientID + '/beneficiary';
    return this.restService.get(true, this.urlString);
  }


  public getLeviesByClient(clientId: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientId + '/applied-levies/';
    return this.restService.get(true, this.urlString);
  }

  
  public getClientJointAccountList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/joint-accounts/';
    return this.restService.get(true, this.urlString);
  }


  public getInvClientJointAccountList(clientID: Number): Observable<any[]> {
    this.urlString = 'inv-clients/clientID/' + clientID + '/joint-accounts/';
    return this.restService.get(true, this.urlString);
  }

  public getBankBranchListByBank(bankId: Number): Observable<Object[]> {
    this.urlString = 'bank-branches/' + bankId + '/branches/';
    return this.restService.get(true, this.urlString);
  }
  public getDocumentTypes(): Observable<Object[]> {
    this.urlString = 'lookups/document-types/';
    return this.restService.get(true, this.urlString);
  }
  public getClientDocumentsList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/documents/';
    return this.restService.get(true, this.urlString);
  }

  public getInvClientDocumentsList(clientID: Number): Observable<Object[]> {
    this.urlString = 'inv-clients/clientID/' + clientID + '/documents/';
    return this.restService.get(true, this.urlString);
  }



  public getClientExchangeList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/exchanges/';
    return this.restService.get(true, this.urlString);
  }
  public getClientMarketList(clientID: Number): Observable<Object[]> {
    this.urlString = 'clients/clientID/' + clientID + '/marekts/';
    return this.restService.get(true, this.urlString);
  }


  public getInvClientMarketList(clientID: Number): Observable<Object[]> {
    this.urlString = 'inv-clients/clientID/' + clientID + '/marekts/';
    return this.restService.get(true, this.urlString);
  }



  // public getInvClientMarketList(clientID: Number): Observable<Object[]> {
  //   this.urlString = 'inv-clients/clientID/' + clientID + '/marekts/';
  //   return this.restService.get(true, this.urlString);
  // }



  public getParticipantExchangeList(participantId: Number): Observable<any> {
    this.urlString = 'participants/' + participantId + '/exchanges/';
    return this.restService.get(true, this.urlString);
  }

  public getParticipantBranchList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/participant-branches/';
    return this.restService.get(true, this.urlString);
  }


  public updateClientStatusCode(data : any): Observable<Object[]> {
    this.urlString = 'inv-clients/status/inv-client-id/';
    return this.restService.put(true, this.urlString , data);
  }


 


  public updateClientStatusCodeForClients(data : any): Observable<Object[]> {
    this.urlString = 'clients/status/client-id/';
    return this.restService.put(true, this.urlString , data);
  }



  public getParticipantListByExchagne(exchangeId: Number): Observable<Object[]> {
    this.urlString = 'exchanges/' + exchangeId + '/participants/';
    return this.restService.get(true, this.urlString);
  }

  public getIdentificationTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/identification-types/';
    return this.restService.get(true, this.urlString);
  }

  public getProfessionList(): Observable<Object[]> {
    this.urlString = 'lookups/professions/';
    return this.restService.get(true, this.urlString);
  }

  public getIncomeSourceList(): Observable<Object[]> {
    this.urlString = 'lookups/incomeSources/';
    return this.restService.get(true, this.urlString);
  }

  public getRelationList(): Observable<Object[]> {
    this.urlString = 'lookups/relations';
    return this.restService.get(true, this.urlString);
  }

  public getIndustryList(): Observable<Object[]> {
    this.urlString = 'lookups/industries/';
    return this.restService.get(true, this.urlString);
  }

  //  for portfolio-return page
  public getInstrumentList(): Observable<Object[]> {
    this.urlString = 'lookups/instruments/';
    return this.restService.get(true, this.urlString);
  }

  public savePortfolioReturn(pfr: PortfolioReturnModel): any {
    return this.restService.post(true, 'portfolio-returns/', pfr);
  }

  public getPFRList(pfr: PortfolioReturnModel): Observable<Object[]> {
    let yearEndString: string;
    yearEndString = wjcCore.Globalize.format(pfr.yearEnd, AppConstants.DATE_FORMAT);
    this.urlString = 'participants/' + pfr.participant.participantId + '/portfolio-returns/instruments/' +
      pfr.instrument.instrumentId + '/year-end/' + yearEndString + '/period/' + pfr.period;
    return this.restService.get(true, this.urlString);
  }

  public updatePortfolioReturn(pfr: PortfolioReturnModel): any {
    return this.restService.put(true, 'portfolio-returns/', pfr);
  }

  public deletePortFolioReturn(pfr: PortfolioReturnModel): any {
    return this.restService.delete(true, 'portfolio-returns/', pfr);
  }

  //  for Analysis => Announcement page
  public getAnnouncementTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/announcement-types/';
    return this.restService.get(true, this.urlString);
  }

  public getAnnouncementList(am: AnnouncementModel): Observable<Object[]> {
    let fromDateString: string;
    let toDateString: string;
    fromDateString = wjcCore.Globalize.format(am.fromDate, AppConstants.DATE_FORMAT);
    toDateString = wjcCore.Globalize.format(am.toDate, AppConstants.DATE_FORMAT);
    this.urlString = 'participants/' + am.participant.participantId + '/announcements/securities/' + am.security.securityId +
      '/from/' + fromDateString + '/to/' + toDateString + '/type/' + am.announcementType.announcementTypeId;
    return this.restService.get(true, this.urlString);
  }

  public getAnnouncementListBySecurity(_exCode, _secCode): Observable<Object[]> {
    this.urlString = 'reports/get-announcements/participant/' + AppConstants.participantId + '/exchange/'
      + _exCode + '/security/' + _secCode + '/';
    return this.restService.get(true, this.urlString);
  }

  public getExchangesListBySecurityId(secId: number): Observable<Object[]> {
    this.urlString = 'securities/id/' + secId + '/exchanges/';
    return this.restService.get(true, this.urlString);
  }

  public saveAnnouncement(am: AnnouncementModel): any {
    return this.restService.post(true, 'announcements/', am);
  }

  public updateAnnouncement(am: AnnouncementModel): any {
    return this.restService.put(true, 'announcements/', am);
  }

  public deleteAnnouncement(am: AnnouncementModel): any {
    return this.restService.delete(true, 'announcements/', am);
  }

  //  for financial => Reports => Trial balance
  public getTrialBalanceReport(PID_: number, HL_: number, startDate_: string, endDate_: string, reportFormat: string,lang): Observable<Object[]> {
    this.urlString = 'reports/trial-balance/participant/' + PID_ + '/head-level/' +
      HL_ + '/start-date/' + startDate_ + '/end-date/' + endDate_ + '/report-format/' + reportFormat + '/lang/' + lang +'/';
    return this.restService.get(true, this.urlString);
  }
  public getTrialBalanceReportForamt1(PID_: number, HL_: number, startDate_: string, endDate_: string, tradeDate_: string, reportFormat: string,lang): Observable<Object[]> {
    this.urlString = 'reports/trial-balance-format1/participant/' + PID_ + '/head-level/' +
      HL_ + '/start-date/' + startDate_ + '/end-date/' + endDate_ + '/trade-date/' + tradeDate_ + '/report-format/' + reportFormat+ '/lang/' + lang +'/';
    return this.restService.get(true, this.urlString);
  }
  public getTrialBalanceReportForamt2A(PID_: number, HL_: number, startDate_: string, endDate_: string, tradeDate_: string, reportFormat: string, reportType: string,lang): Observable<Object[]> {
    this.urlString = 'reports/trial-balance-format1/participant/' + PID_ + '/head-level/' +
      HL_ + '/start-date/' + startDate_ + '/end-date/' + endDate_ + '/trade-date/' + tradeDate_ + '/report-format/' + reportFormat + '/report-type/' + reportType + '/lang/' + lang +'/';
    return this.restService.get(true, this.urlString);
  }
  public getTrialBalanceReportForamt2Secp(PID_: number, HL_: number, startDate_: string, endDate_: string, tradeDate_: string, reportFormat: string,lang): Observable<Object[]> {
    this.urlString = 'reports/trial-balance-format2-secp/participant/' + PID_ + '/head-level/' +
      HL_ + '/start-date/' + startDate_ + '/end-date/' + endDate_ + '/trade-date/' + tradeDate_ + '/report-format/' + reportFormat + '/lang/' + lang +'/';
    return this.restService.get(true, this.urlString);
  }
  public getTrialBalanceReportForamt2MarlinSecp(PID_: number, HL_: number, startDate_: string, endDate_: string, tradeDate_: string, reportFormat: string,lang): Observable<Object[]> {
    this.urlString = 'reports/trial-balance-format2-marlinsecp/participant/' + PID_ + '/head-level/' +
      HL_ + '/start-date/' + startDate_ + '/end-date/' + endDate_ + '/trade-date/' + tradeDate_ + '/report-format/' + reportFormat + '/lang/' + lang +'/';
    return this.restService.get(true, this.urlString);
  }
  //  for financial => Reports => Profit/Loss Statement
  public getProfitLossStatementReport(PID_: number, HL_: number, asOnDate_: string,lang): Observable<Object[]> {
    this.urlString = 'reports/profit-loss/participant/' + PID_ + '/head-level/' +
      HL_ + '/asOnDate/' + asOnDate_  + '/lang/' + lang +'/';
    return this.restService.get(true, this.urlString);
  }

  //  for financial => Reports => Balance Sheet
  public getBalanceSheetReport(PID_: number, HL_: number, asOnDate_: string,lang): Observable<Object[]> {
    this.urlString = 'reports/balance-sheet/participant/' + PID_ + '/head-level/' +
      HL_ + '/asOnDate/' + asOnDate_  + '/lang/' + lang +'/';
    return this.restService.get(true, this.urlString);
  }

  public insertClientAging(PID_: number, asOnDate_: string): Observable<Object[]> {
    this.urlString = 'clients/insert-clients-aging/participant/' + PID_ + '/asOnDate/' + asOnDate_ + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for financial => Reports => Net Capital Balance
  public getNetCapitalBalanceReport(PID_: number, asOnDate_: string): Observable<Object[]> {
    this.urlString = 'reports/net-capital-balance/participant/' + PID_ + '/asOnDate/' + asOnDate_ + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for financial => Reports => IBTS
  public getIBTSReport(PID_: number, asOnDate_: string): Observable<Object[]> {
    this.urlString = 'reports/ibts/participant/' + PID_ + '/asOnDate/' + asOnDate_ + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for financial => Reports => Net Capital Detail
  public getNetCapitalDetailReport(PID_: number, asOnDate_: string): Observable<Object[]> {
    this.urlString = 'reports/net-capital-detail/participant/' + PID_ + '/asOnDate/' + asOnDate_ + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for financial => Reports => Liquid Capital Balance
  public getLiquidCapitalBalanceReport(PID_: number, asOnDate_: string): Observable<Object[]> {
    this.urlString = 'reports/liquid-capital-balance/participant/' + PID_ + '/asOnDate/' + asOnDate_ + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for financial => Reports => General Ledger
  public getGeneralLedgerReport(PID_: number, from_client_: string, to_client_: string, start_date_: string,
    end_date_: string, vt_id_: number, vt_: string, vp_: number, reportType: string,lang): Observable<Object[]> {
    this.urlString = 'reports/general-ledger/participant/' + PID_ + '/from-account/' + from_client_ +
      '/to-account/' + to_client_ + '/start-date/' + start_date_ + '/end-date/' + end_date_ + '/voucher-type-id/' +
      vt_id_ + '/voucher-type/' + vt_ + '/voucher-posted/' + vp_ + '/reportType/' + reportType + '/lang/' + lang +'/';
    return this.restService.get(true, this.urlString);
  }

  //  for equity => settlement reports => participant delivery obligation
  public getParticipantDeliveryObligationReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string, transTypeId, transType, lang): Observable<Object[]> {
    this.urlString = 'reports/participant-delivery-obligation/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/transType-id/' + transTypeId + '/transType/' + transType + '/lang/' + lang + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for equity => settlement reports => client delivery obligation
  public getClientDeliveryObligationReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string, transTypeId, transType, lang): Observable<Object[]> {
    this.urlString = 'reports/client-delivery-obligation/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/transType-id/' + transTypeId + '/transType/' + transType + '/lang/' + lang + '/';
    return this.restService.get(true, this.urlString);
  }

  public getClientPreSettlementDeliveryReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string, reportFormat: string, lang): Observable<Object[]> {
    this.urlString = 'reports/client-pre-settlement-delivery/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/report-format/' + reportFormat + '/lang/' + lang + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for equity => settlement reports => participant money obligation
  public getParticipantMoneyObligationReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string, transTypeId, transType): Observable<Object[]> {
    this.urlString = 'reports/participant-money-obligation/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/transType-id/' + transTypeId + '/transType/' + transType + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for equity => settlement reports => client money obligation
  public getClientMoneyObligationReport(PID_: number, ExNa_: string, SeCaID_: number, SeTy_: string, StDa_: string, EnDa_: string, SeDa_: string, transTypeId, transType, lang): Observable<Object[]> {
    this.urlString = 'reports/client-money-obligation/participant/' + PID_ + '/exchange-name/' + ExNa_ +
      '/settlement-calender-id/' + SeCaID_ + '/settlement-type/' + SeTy_ + '/start-date/' + StDa_ + '/end-date/' + EnDa_ + '/settlement-date/' + SeDa_ + '/transType-id/' + transTypeId + '/transType/' + transType + '/lang/' + lang + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for backoffice => migrator => client holding
  public uploadClientHolding(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/clients-holding/';
    return this.restService.post(true, this.urlString, oClientHolding);
  }

  //  for backoffice => Reconcilation => CDC
  public uploadCDCReconcilation(oCDCMigrator: Migrator): any {
    this.urlString = 'reconcilation/cdc/';
    return this.restService.post(true, this.urlString, oCDCMigrator);
  }

  public uploadCDCReconcilationNew(oCDCMigrator: Migrator): any {
    this.urlString = 'reconcilation/cdc-new/';
    return this.restService.post(true, this.urlString, oCDCMigrator);
  }


  //  for backoffice => Reconcilation => Clients Cash
  public uploadClientsCashReconcilation(oClientsCashMigrator: Migrator): any {
    this.urlString = 'reconcilation/clients-cash/';
    return this.restService.post(true, this.urlString, oClientsCashMigrator);
  }

  //  for backoffice => Client Assets => CDC
  public uploadClientsAssetsReconcilation(oCDCMigrator: Migrator): any {
    this.urlString = 'reconcilation/clients-assets/';
    return this.restService.post(true, this.urlString, oCDCMigrator);
  }

  //  for backoffice => migrator => Clients Setup
  public uploadClientsSetup(oClients: Migrator): any {
    this.urlString = 'migrator/upload/clients-setup/';
    return this.restService.post(true, this.urlString, oClients);
  }

  //  for backoffice => migrator => Agent
  public uploadAgents(oAgent: Migrator): any {
    this.urlString = 'migrator/upload/agent/';
    return this.restService.post(true, this.urlString, oAgent);
  }

  //  for backoffice => migrator => Commission Slab
  public uploadCommissionSlab(oCommissionSlab: Migrator): any {
    this.urlString = 'migrator/upload/commission-slab/';
    return this.restService.post(true, this.urlString, oCommissionSlab);
  }

  //  for backoffice => migrator => Commission Slab
  public uploadAssignmentOfSlab(oAssignmentSlab: Migrator): any {
    this.urlString = 'migrator/upload/assignment-of-slab/';
    return this.restService.post(true, this.urlString, oAssignmentSlab);
  }

  //  for backoffice => migrator => clients
  public uploadClients(oClients: Migrator): any {
    this.urlString = 'migrator/upload/clients/';
    return this.restService.post(true, this.urlString, oClients);
  }

  //  for backoffice => migrator => clients Holding
  public uploadHolding(oClients: Migrator): any {
    this.urlString = 'migrator/upload/holding/';
    return this.restService.post(true, this.urlString, oClients);
  }
  //  for backoffice => migrator => COA Control Accounts
  public uploadControlAccount(oClients: Migrator): any {
    this.urlString = 'migrator/upload/coa-control-account/';
    return this.restService.post(true, this.urlString, oClients);
  }
  //  for backoffice => migrator => COA Detail Accounts
  public uploadDetailAccount(oClients: Migrator): any {
    this.urlString = 'migrator/upload/coa-detail-account/';
    return this.restService.post(true, this.urlString, oClients);
  }

  //  for backoffice => migrator => transactions
  public uploadTransactions(oTransactions: Migrator): any {
    this.urlString = 'migrator/upload/transactions/';
    return this.restService.post(true, this.urlString, oTransactions);
  }

  //  for backoffice => migrator => vaults
  public uploadVaults(oTransactions: Migrator): any {
    this.urlString = 'migrator/upload/vault/';
    return this.restService.post(true, this.urlString, oTransactions);
  }

  //  for backoffice => migrator => fut open trade
  public uploadFutOpenTrade(oTransactions: Migrator): any {
    this.urlString = 'migrator/upload/fut-open-trade/';
    return this.restService.post(true, this.urlString, oTransactions);
  }

  //  for backoffice => migrator => capital gain tax
  public uploadCapitalGainTax(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/capital-gain-tax/';
    return this.restService.post(true, this.urlString, oClientHolding);
  }


  //  for backoffice => migrator => closing rates
  public uploadClosingRates(oClosingRates: Migrator): any {
    this.urlString = 'migrator/upload/closing-rates/';
    return this.restService.post(true, this.urlString, oClosingRates);
  }
  // for AML file data loader
  //  for backoffice => setup => load aml data

  public uploadAmlFileData(oAmlData: Migrator): any {
    this.urlString = 'migrator/upload/amlFileData/';
    return this.restService.post(true, this.urlString, oAmlData);
  }


  //  for backoffice => migrator => voucher
  public uploadVouchers(oVoucher: Migrator): any {
    this.urlString = 'migrator/upload/voucher/';
    return this.restService.post(true, this.urlString, oVoucher);
  }

  //  for backoffice => migrator => closing rates
  public uploadVarAndSecurityHaircut(oVarAndSecurityHaircut: Migrator): any {
    this.urlString = 'migrator/upload/var-and-secuirty-haircut/';
    return this.restService.post(true, this.urlString, oVarAndSecurityHaircut);
  }

  //  for backoffice => migrator => Financial Announcement
  public uploadFinancialAnnouncement(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/financial-announcement/';
    return this.restService.post(true, this.urlString, oClientHolding);
  }
  //  for backoffice => migrator => Meeting Announcement
  public uploadMeetingAnnouncement(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/meeting-announcement/';
    return this.restService.post(true, this.urlString, oClientHolding);
  }
  //  for backoffice => migrator => Others Announcement
  public uploadOthersAnnouncement(oClientHolding: Migrator): any {
    this.urlString = 'migrator/upload/other-announcement/';
    return this.restService.post(true, this.urlString, oClientHolding);
  }
  //for client levy form
  public getLeviesByBroker(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/levies/";
    return this.restService.get(true, this.urlString);
  }

  public getVoucherTypeList(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/voucher-types/";
    return this.restService.get(true, this.urlString);
  }

  public getRdaClientsList(participantId: Number): Observable<Object[]> {
    this.urlString = "rda/" + "clients/" + participantId;
    return this.restService.get(true, this.urlString);
  }

  public getChartOfAccountList(participantId: Number, leaves: boolean = false, orderBy: boolean = true): Observable<Object[]> {
    //if (leaves)
    this.urlString = "participants/" + participantId + "/chart-of-accounts/leaves/" + leaves + "/asc/" + orderBy;
    // else
    //   this.urlString = "participants/" + participantId + "/chart-of-accounts/leaves/false";

    return this.restService.get(true, this.urlString);
  }

  public getChartOfAccountBasicInfoList(participantId: Number, leaves: boolean = false, orderBy: boolean = true): Observable<Object[]> {
    //if (leaves)
    this.urlString = "participants/" + participantId + "/chart-of-accounts-basic-info/leaves/" + leaves + "/asc/" + orderBy;
    // else
    //   this.urlString = "participants/" + participantId + "/chart-of-accounts/leaves/false";

    return this.restService.get(true, this.urlString);
  }


  public getclientControlAccountList(participantId: Number) {
    this.urlString = "participants/" + participantId + "/chart-of-accounts/second-last-accounts/";
    return this.restService.get(true, this.urlString);
  }

  public getFinacialsDisabledFlag(participantId: Number) {
    this.urlString = "participants/" + participantId + "/chart-of-accounts/child-exists/";
    return this.restService.get(true, this.urlString);
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

    return this.restService.get(true, this.urlString);

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

    return this.restService.get(true, this.urlString);

  }
  public getBindedAndSortedChartOfAccountList(participantId: Number, orderBy: Boolean): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/binded-chart-of-accounts/asc/" + orderBy;
    return this.restService.get(true, this.urlString);
  }
  public getBindedAndSortedChartOfAccountBasicInfoList(participantId: Number, orderBy: Boolean): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/binded-chart-of-accounts-basic-info/asc/" + orderBy;
    return this.restService.get(true, this.urlString);
  }
  public getClientLevieDetailList(leviesMasterId: Number, participantId: Number): Observable<Object[]> {
    this.urlString = null;
    this.urlString = "levies/" + leviesMasterId + "/levies-detail/false/participants/" + participantId;
    return this.restService.get(true, this.urlString);
  }

  public getVoucherListByBroker(participantId: Number, voucherTypeId: Number, voucherStatus: String, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'participants/' + participantId + '/voucher-types/' + voucherTypeId + '/status/' + voucherStatus + '/from-date/' + from_Date + '/to-date/' + to_Date;
    return this.restService.get(true, this.urlString);
  }

  public getVoucherListByBrokerDate(participantId: Number, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'participants/' + participantId + '/cheque-clearance-vouchers/from-date/' + from_Date + '/to-date/' + to_Date;
    return this.restService.get(true, this.urlString);
  }

  public getClientListRpt(participantId: Number, fromDate: Date, toDate: Date, lang:String): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'reports/clients/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + '/lang/' + lang + '/';
    return this.restService.get(true, this.urlString);
  }
  // for Complience Reports
  public getComplienceAccSummaryRpt(participantId: Number, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    // this.urlString = 'reports/clients/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + "/";
    this.urlString = 'reports/complience/acc_opening/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + "/";

    return this.restService.get(true, this.urlString);
  }
  public getComliencePepForeignRpt(participantId: Number, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    // this.urlString = 'reports/clients/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + "/";
    this.urlString = 'reports/complience/pep_foreign/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + "/";

    return this.restService.get(true, this.urlString);
  }
  // fo demo purpose only
  public getDemoSRORpt(participantId: Number, fromDate: Date, toDate: Date, statusId: Number): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'reports/democlients/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + '/status/' + statusId;
    return this.restService.get(true, this.urlString);
  }

  public getCustomerRiskTypeRpt(participantId: Number, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'reports/customer-risk-type/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + "/";
    return this.restService.get(true, this.urlString);
  }

  public getWireTransferActivityRpt(participantId: Number, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'reports/wire-transfer-activity/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + "/";
    return this.restService.get(true, this.urlString);
  }

  public getProductServicesTransactionsRpt(participantId: Number, fromDate: Date, toDate: Date): Observable<Object[]> {
    this.urlString = null;
    let from_Date = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let to_Date = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'reports/product-services-transactions/participant/' + participantId + '/from-date/' + from_Date + '/to-date/' + to_Date + "/";
    return this.restService.get(true, this.urlString);
  }


  public getvoucherDetailList(voucherMasterId: Number): Observable<Object[]> {
    this.urlString = 'vouchers/' + voucherMasterId + '/voucher-details/';
    return this.restService.get(true, this.urlString);
  }

  public getGlParamsByParticipant(participantID: Number): any {
    this.urlString = null;
    this.urlString = 'participants/' + participantID + '/gl-params/';
    return this.restService.get(true, this.urlString);
  }

  public getFiscalYearByParticipant(participantId: Number, startDate: Date, status: Boolean): Observable<Object[]> {
    this.urlString = null;
    let start_Date = new DatePipe('en-US').transform(startDate, 'yyyy-MM-dd');
    this.urlString = "participants/" + participantId + "/fiscal-years/start-date/" + start_Date + '/' + status;
    // this.urlString = "participants/" + participantId + "/chart-of-accounts";
    return this.restService.get(true, this.urlString);
  }


  public getRoleList(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/roles/";
    return this.restService.get(true, this.urlString);
  }
  public getPrivilegeList(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/privs/";
    return this.restService.get(true, this.urlString);
  }
  public getRolePriveleges(roleId: Number): Observable<Object[]> {
    this.urlString = "roles/" + roleId + "/privs/";
    return this.restService.get(true, this.urlString);
  }
  public getUserList(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/users/";
    return this.restService.get(true, this.urlString);
  }

  public getActiveUsersListExceptParticipantAdmin(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/active-users/";
    return this.restService.get(true, this.urlString);
  }
  public getUserTypeList(): Observable<Object[]> {
    this.urlString = 'lookups/user-types/';
    return this.restService.get(true, this.urlString);
  }

  public getUserStateList(): Observable<Object[]> {
    this.urlString = 'lookups/user-state/';
    return this.restService.get(true, this.urlString);
  }

  public getApplicationSetup(participantId: Number): Observable<Object[]> {
    this.urlString = "participants/" + participantId + "/application-setups/";
    return this.restService.get(true, this.urlString);
  }

  public getParticipantParamsByParticipant(participantID: Number): any {
    this.urlString = null;
    this.urlString = "participants/" + participantID + "/application-setups/Params";
    return this.restService.get(true, this.urlString);
  }

  public getParticipantLogoByParticipant(participantID: Number): any {
    this.urlString = null;
    this.urlString = "participants/" + participantID + "/application-setups/Logo";
    return this.restService.get(true, this.urlString);
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
    return this.restService.get(true, this.urlString);
  }

  public saveBrokerBranch(condet: BrokerBranch): any {
    return this.restService.post(true, 'participant-branches/', condet);
  }

  public updateBrokerBranch(condet: BrokerBranch): any {
    return this.restService.put(true, 'participant-branches/', condet);
  }

  public getParticipantSecurityParams(participantId: number, exchangeId: number): Observable<Object[]> {
    this.urlString = 'participant-security-param/participantId/' + participantId + '/exchangeId/' + exchangeId;
    return this.restService.get(true, this.urlString);
  }

  public saveParticipantSecurityParams(transdet: any): any {
    return this.restService.post(true, 'participant-security-param/', transdet);
  }

  public saveParticipant(participant: any): any {
    return this.restService.post(true, 'participants/', participant);
  }

  public updateParticipant(participant: any): any {
    return this.restService.put(true, 'participants/', participant);
  }

  public updateContact(contact: any): any {
    return this.restService.put(true, 'participants/update/contact-info/', contact);
  }

  public updateParticipantExchangeAssociation(exchangeAssociation: any[]): any {
    return this.restService.put(true, 'participant-exchanges/', exchangeAssociation);
  }

  public updateParticipantModules(exchangeAssociation: any[]): any {
    return this.restService.put(true, 'participant-role-priv/', exchangeAssociation);
  }
  public updateParticipantSecurityParams(transdet: any): any {
    return this.restService.put(true, 'participant-security-param/', transdet);
  }
  public getClientUser(clientID: Number): Observable<Object> {
    this.urlString = 'clients/clientID/' + clientID + '/system-access/';
    return this.restService.get(true, this.urlString);
  }
  public getBrokerBranchList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participant-branches/participantId/' + participantId;
    return this.restService.get(true, this.urlString);
  }

  public getSampleReport(): Observable<Object> {
    this.urlString = 'reports/test-email/';
    return this.restService.get(true, this.urlString);
  }

  public getParticipantUser(participantID: number, userType: number): Observable<Object> {
    this.urlString = 'participants/' + participantID + '/user-type/' + userType;
    return this.restService.get(true, this.urlString);

  }

  public getParticipantModulesList(participantId: Number): Observable<Object[]> {
    this.urlString = 'participants/' + participantId + '/modules/';
    return this.restService.get(true, this.urlString);
  }

  public getModulesList(): Observable<Object[]> {
    this.urlString = '/modules/all/';
    return this.restService.get(true, this.urlString);
  }

  // Research -> Research -> Corporate Analysis Reports -> Dividend Details
  public getFinancialAnnouncementListByExchange(_exId: number): Observable<Object[]> {
    this.urlString = 'reports/get-fin-announcements/participant/' + AppConstants.participantId + '/exchange/'
      + _exId + '/';
    return this.restService.get(true, this.urlString);
  }

  //  for backoffice => migrator => chart of accounts
  public uploadChartOfAccounts(oCOA: Migrator): any {
    this.urlString = 'migrator/upload/chart-of-account/';
    return this.restService.post(true, this.urlString, oCOA);
  }

  // get Beneficiary Relation List
  public getBeneficiaryRelationList(): Observable<Object[]> {
    this.urlString = 'lookups/relations/';
    return this.restService.get(true, this.urlString);
  }

  /******************************
   ********************************/
  public getOrderSides(): any[] {
    //this.urlString = './app/services/data/order-sides.json';
    let cmbItem: ComboItem;
    let orderSides: any[] = [];
    cmbItem = new ComboItem('Buy', 'buy');
    orderSides.push(cmbItem);
    cmbItem = new ComboItem('Sell', 'sell');
    orderSides.push(cmbItem);
    return orderSides;
    //return this.restService.get(true,this.urlString, true);
  }

  public deleteParticipant(participantId: Number, exchangeId: Number, delVouchers: Boolean, delTrades: Boolean, delStocks: Boolean, delClients: Boolean, delCoa: Boolean): any {
    this.urlString = "/participants/" + participantId + "/exchanges/" + exchangeId + "/delete-participant/vouchers/" + delVouchers + "/trades/" + delTrades + "/stocks/" + delStocks + "/clients/" + delClients + "/coa/" + delCoa + "/";
    return this.restService.get(true, this.urlString);
  }

  // Getting Traansaction Type list by Initial Letters
  public getTraansactionList(code: String): Observable<Object[]> {
    this.urlString = 'transactions/' + code + '/traansaction-types/';
    return this.restService.get(true, this.urlString);
  }


  //  for backoffice => export => client holding
  public exportClients(oClients: Migrator): any {
    this.urlString = 'export/clients/';
    return this.restService.post(true, this.urlString, oClients);
  }
  //  for backoffice => export => client holding with balance
  public exportClientswithBalance(oClientsWithBalance: Migrator): any {
    this.urlString = 'export/clients-with-balance/';
    return this.restService.post(true, this.urlString, oClientsWithBalance);
  }

  //  for backoffice => export => client holding with balance
  public exportAgentList(oAgentsList: Migrator): any {
    this.urlString = 'export/agents/';
    return this.restService.post(true, this.urlString, oAgentsList);
  }
  //  for backoffice => export => KTIS CDC
  public exportCDC(oKitsCdc: Migrator): any {
    this.urlString = 'export/kits-cdc/';
    return this.restService.post(true, this.urlString, oKitsCdc);
  }
  //  for backoffice => export => transactions
  public exportTransactions(oTransactions: Migrator): any {
    this.urlString = 'export/transaction/';
    return this.restService.post(true, this.urlString, oTransactions);
  }

  //  for backoffice => export => KATS
  public exportKats(oKats: Migrator): any {
    this.urlString = 'export/kats/';
    return this.restService.post(true, this.urlString, oKats);
  }

  //  for backoffice => export => FED
  public exportFed(oKats: Migrator): any {
    this.urlString = 'export/fed/';
    return this.restService.post(true, this.urlString, oKats);
  }

  //  for backoffice => export => IBTS
  public exportIBTS(oKats: Migrator): any {
    this.urlString = 'export/IBTS/';
    return this.restService.post(true, this.urlString, oKats);
  }
  //  for backoffice => migrator => client holding
  public smsBroadCast(smsBroadcast: smsBroadcast): any {
    this.urlString = 'sms/sms-broadcast/';
    return this.restService.post(true, this.urlString, smsBroadcast);
  }

  public getSecpAccountList(): Observable<Object[]> {
    this.urlString = 'secp-accounts/';
    return this.restService.get(true, this.urlString);
  }

  // for tax ranges used in bond, 17 sept 2022, Muhammad Hassan
  public getTaxRangesList(): Observable<Object[]> {
    this.urlString = 'taxRanges/' ;
    return this.restService.get(true, this.urlString);
  }

  public saveTaxRanges(taxRanges: TaxRanges): any {
    return this.restService.post(true, 'taxRanges/', taxRanges);
  }
  public updateTaxRanges( taxRanges: TaxRanges): any {
    return this.restService.put(true, 'taxRanges/', taxRanges);
  }

  // for audit log
  public getAuditLogList( ): Observable<Object[]> {
    this.urlString = 'auditlog/' ;
    return this.restService.get(true, this.urlString);
  }

  public getAuditLogListBySearchParams(fromDate, toDate ): Observable<Object[]> {
    let fromDateFormatted = new DatePipe('en-US').transform(fromDate, 'yyyy-MM-dd');
    let toDateFormatted = new DatePipe('en-US').transform(toDate, 'yyyy-MM-dd');
    this.urlString = 'auditlog/from-date/'+ fromDateFormatted + '/to-date/' + toDateFormatted ;
    return this.restService.get(true, this.urlString);
  }

  public getSecurityTypeByTypeId(securityTypeId:number): Observable<Object[]> {
    this.urlString = 'lookups/securityTypes/'+securityTypeId;
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

  public getAuctionById(auctionId: Number): Observable<Object> {
    this.urlString = 'mmAuctions/byAuctionId/' + auctionId + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }
  public getAuctionByNumber(auctionNumber: Number): Observable<Object> {
    this.urlString = 'mmAuctions/byAuctionNumber/' + auctionNumber + '/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getBondSubCategoryList(): Observable<Object[]> {
    this.urlString = 'lookups/bondSubCategories/';
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getSecuritiesBySecurityType(securityTypeId: number): Observable<Object[]> {
    this.urlString = 'securities/bySecurityType/' + securityTypeId;
    return this.appUtility.wsGetRequest(this.urlString);
  }

  public getPaymentSchedualByExchangeMarketSecurityId(exchangeMarketSecurityId: number): Observable<Object[]> {
    this.urlString = 'bondPaymentSchedules/get/exchangeMarketSecurityId/' + exchangeMarketSecurityId;
    return this.appUtility.wsGetRequest(this.urlString);
  }
}
