import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
// import 'rxjs/Rx';
import { map, catchError } from 'rxjs/operators';

import { AuthService2 } from './services/auth2.service';
import { stringify } from 'querystring';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppUtility {

    errorMessage: string = '';
    apiUrl: string;

    private headers: HttpHeaders;


    public static isSplitSymbolMarketExchange = (str: any) => {
        if (str.indexOf('/') <= str.indexOf('(')) {
            let symBolSubstring = str.substring(0, str.indexOf('('));
            let subString = str.substring(str.indexOf('('), str.indexOf(')'));
            let subStringArr = subString.split(/[(/\)]/);
            var filtered = subStringArr.filter(function (el) {
                return el != "";
            });

            filtered.unshift(symBolSubstring);
            console.log("Filtered", filtered);
            return filtered;
        }
        else {
            return (str.split(/[(/\)]/));

        }
    }





    public static symbolMarketExchangeComb = (symbol: string, market: string, exchange: string) => {

        let smeString = symbol + "(" + market + "/" + exchange + ")";
        return smeString;

    }





    public static moveSelectionToLastItem(itemsList: wjcCore.CollectionView) {
        itemsList.sortDescriptions.clear();
        itemsList.moveToLastPage();
        itemsList.moveCurrentToLast();
    }

    public static isValidVariable(variable): boolean {
        return ((typeof variable !== 'undefined') && (variable !== null));
    }

    public static isNullOrEmpty(s: string) {
        return (s == null || s === '');
    }

    public static isEmpty(obj: Object): boolean {
        return (obj == null || obj.toString() === '');
    }

    public static isEmptyArray(ary: any[]): boolean {
        return (ary == null || ary.length === 0);
    }

    public static printConsole(str): void {
        if (AppConstants.debug) {
            console.log(str);
        }
    }

    public static formatDate(date: Date): string {
        let mm = date.getMonth() + 1; // getMonth() is zero-based
        let dd = date.getDate();

        return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join('-');
    };

    public static ucFirstLetter(str: string): string {

        return str.substr(0, 1).toUpperCase() + str.substr(1);
    }
    public static lcFirstLetter(str: string): string {
        return str.substr(0, 1).toLowerCase() + str.substr(1);
    }

    public static formatTime(dateTime: string): string {

        let formattedTime: string;
        // AppUtility.printConsole('Date Time: ' + dateTime);
        if (AppUtility.isValidVariable(dateTime)) {
            let dateTimeStr = dateTime.toString();
            // dateTime = new Date ( dateTime.getUTCDate());
            let dateTimeParse = dateTimeStr.split('T');
            let date = dateTimeParse[0];
            let time = dateTimeParse[1].split(':');
            let seconds = time[2].split('.');
            // formattedTime= time[0]+":"+time[1]+":"+time[2];
            formattedTime = time[0] + ':' + time[1] + ':' + seconds[0];
            // formattedTime= dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getSeconds();

        }
        return formattedTime;
    }

    public static removeQuotesFromStartAndEndOfString(inputStr): string {
        let result = '';
        if (AppUtility.isValidVariable(inputStr) && !AppUtility.isValidVariable(inputStr.isTrusted)) {
            result = inputStr;
            let firstQuote = inputStr.indexOf('\"');
            let lastQuote = result.lastIndexOf('\"');
            let strLength = inputStr.length;
            if (firstQuote === 0 && lastQuote === strLength - 1) {
                result = result.substring(1, strLength - 1);
            }
        }
        return result;
    }

    public static validateCNIC(inputText: String): Boolean {
        let numbers = /^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/;
        if (inputText.match(numbers)) {
            return true;
        } else {
            return false;
        }
    }

    public static validateEmail(email: string): Boolean {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    public static validateNumberOnly(inputText: string): Boolean {
        let numbers = /^[-+]?[0-9]+$/;
        if (inputText.match(numbers)) {
            return true;
        } else {
            return false;
        }
    }

    public static validateAlphaNumeric(inputText: string): Boolean {
        let code, i, len;
        for (i = 0, len = inputText.length; i < len; i++) {
            code = inputText.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true;
    }

    public static validateSpecialCharacter(inputText: string): Boolean {
        // return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inputText);
        return /[~!@#$%^&*\-()_]/g.test(inputText);
    }

    public static regularExpressionvalidator(ctl: String, inputText: string, pattern: string): Boolean {
        if (!AppUtility.isEmpty(inputText)) {
            let re: RegExp = new RegExp(pattern);
            console.log(ctl + '------------' + inputText + '=============' + re.test(inputText));
            return re.test(inputText);
        }
        else
            return true;
    }

    public static toYYYYMMDD(date: Date): string {
        let mm = date.getMonth() + 1; // getMonth() is zero-based
        let dd = date.getDate();

        return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join('-');
    }

    constructor(private http: HttpClient, private authService: AuthService2) { }

    /**
     * control Validator
     */
    public validatControl(controlName) {
        let valid = /^[a-zA-Z0-9 _]+$/.test(controlName.value);

        if (valid) {
            return null;
        }
        return { 'invalidName': true };
    }

    public static getDaysBetweenDates(start, end) {
        const date1 = new Date(start);
        const date2 = new Date(end);

        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;

        // Calculating the time difference between two dates
        const diffInTime = date2.getTime() - date1.getTime();

        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);

        return diffInDays;
    }

    public static formatDate_YYYY_MM_DD(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }

    // ...............................................................Utility2 Methods......................................................................

    lang: any;

    public wsGetRequest(urlString: string, localData: boolean = false, dataObject: any = null): Observable<Object[]> {

        if (localData) {
            this.apiUrl = urlString;
        } else {

            this.apiUrl = environment.BASE_API_URL + urlString;
        }

        console.log(this.apiUrl);
        let Httpheaders = new HttpHeaders();
        let token = sessionStorage.getItem('token');
        if (AppUtility.isEmpty(dataObject)) {
            Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + token);
            return this.http.get(this.apiUrl, { headers: Httpheaders }).pipe(map(this.translateResponse)
                , catchError<any, any>(this.translateError));

        } else {
            Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + token);
            //HTTPHeaderError ->used [ params:dataObject ] instead of [body: JSON.stringify(dataObject) ]
            return this.http.get(this.apiUrl, { headers: Httpheaders, params: dataObject }).pipe(map(this.translateResponse)
                , catchError<any, any>(this.translateError))

        }
    }

    public wsOMSGetRequest(urlString: string, localData: boolean = false): Observable<Object[]> {
        if (localData) {
            this.apiUrl = urlString;
        } else {
            this.apiUrl = environment.omsBaseUrl + urlString;
        }

        console.log(this.apiUrl);
        let Httpheaders = new HttpHeaders();

        Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);
        return this.http.get(this.apiUrl, { headers: Httpheaders })
            .map(this.translateResponse)
            .catch<any, any>(this.translateError);
    }

    public wsPostRequest(urlString: string, obj: Object): any {
        // this.apiUrl = urlString;
        this.apiUrl = environment.BASE_API_URL + urlString;
        let Httpheaders = new HttpHeaders();
        Httpheaders = Httpheaders.append('Content-Type', 'application/json');
        Httpheaders = Httpheaders.append('Accept', 'application/json');
        Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);
        console.log('-------------------' + JSON.stringify(obj));
        return this.http.post(this.apiUrl, JSON.stringify(obj), { headers: Httpheaders })
            .map(this.translateResponse)
            .catch(this.translateError);
    }

    public wsPutRequest(urlString: string, obj: Object): any {
        this.apiUrl = environment.BASE_API_URL + urlString;

        let Httpheaders = new HttpHeaders();
        Httpheaders = Httpheaders.append('Content-Type', 'application/json');
        Httpheaders = Httpheaders.append('Accept', 'application/json');
        Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);



        return this.http.put(this.apiUrl, JSON.stringify(obj), { headers: Httpheaders })
            .map(this.translateResponse)
            .catch(this.translateError);
    }

    public wsDeleteRequest(urlString: string, obj: Object): any {
        this.apiUrl = environment.BASE_API_URL + urlString;
        let Httpheaders = new HttpHeaders();

        Httpheaders = Httpheaders.append('Content-Type', 'application/json');
        Httpheaders = Httpheaders.append('Accept', 'application/json');
        Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);



        return this.http.delete(this.apiUrl, { headers: Httpheaders, body: JSON.stringify(obj) });
    }


    private translateError(error: any): Observable<Object[]> {
        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }

        if (error.error.status === 0) {
            if (this.lang == 'en') { return Observable.throw('Problem in connecting to server. Make sure the requesting resource is a valid URL.'); }
            else if (this.lang == 'pt') { return Observable.throw('Problema na conexão com o servidor. Verifique se o recurso solicitante é um URL válido.'); }
        }
        else if (AppUtility.isEmpty(error.error.message)) {
            if (this.lang == 'en') { return Observable.throw('Error :: Please make sure the server is running.'); }
            else if (this.lang == 'pt') { return Observable.throw('Erro :: Verifique se o servidor está em execução.'); }
        }
        else {


            let Error = error.error.message
            let ErrorMsg1 = "Sorry for the inconvenience. The system will be restored shortly"
            let ErrorMsg1Po = "Desculpe pela inconveniência. O sistema será restaurado em breve"
            let ErrorMsg2 = "There is no such resource"
            let ErrorMsg2Po = "Não existe esse recurso"
            let ErrorMsg3 = "Fiscal Year Not found for given date"
            let ErrorMsg3Po = "Ano Fiscal Não encontrado para determinada data"

            if (Error == ErrorMsg1) {
                if (this.lang == 'en') { return Observable.throw(Error); }
                else if (this.lang == 'pt') { return Observable.throw(ErrorMsg1Po); }
            }
            if (Error == ErrorMsg2) {
                if (this.lang == 'en') { return Observable.throw(Error); }
                else if (this.lang == 'pt') { return Observable.throw(ErrorMsg2Po); }
            }
            if (Error == ErrorMsg3) {
                if (this.lang == 'en') { return Observable.throw(Error); }
                else if (this.lang == 'pt') { return Observable.throw(ErrorMsg3Po); }
            }

            else return Observable.throw(JSON.stringify(error.error.message));
        }

    }

    private translateResponse(res: Response) {
        console.log('Response Status------------------------------------' + res.status);
        if (AppUtility.isEmpty(JSON.stringify(res))) {
            return null;
        } else {
            return res;
        }
    }
    // ..............................................................Utility2 Methods...................................................................

}

/**
 *
 */

export enum UserTypes {
    MARLIN_ADMIN = "MARLIN ADMIN",
    PARTICIPANT = "PARTICIPANT",
    PARTICIPANT_ADMIN = "PARTICIPANT ADMIN",
    PARTICIPANT_OPERATOR = "PARTICIPANT OPERATOR",
    AGENT = "AGENT",
    CLIENT = 'CLIENT',

}

export enum AssetClass {
    Equity = "EQTY",
    Bond = "BOND",
    ETF = "ETF",
    Crypto = "CRYPTO",
    Commodity = "CMDTY",
    RealEstate = "REALES"
}

@Injectable({
    providedIn: 'root'
})

export class AppConstants {
    
     

    public static LOCALE_STR_PK: 'en-PK';
    public static IS_CUSTODIAN = false;
    public static ACCOUNT_TYPE_INDIVIDUAL = "INDIVIDUAL";
    public static ACCOUNT_TYPE_CORPORATE = "CORPORATE";

    public static USER_TYPE_PARTICIPANT_CODE = "PARTICIPANT";
    public static MARKET_CODE_COLOR = "#cbd5e1"
    public static USER_TYPE_PARTICIPANT_ADMIN_CODE = "PARTICIPANT ADMIN";
    public static USER_TYPE_PARTICIPANT_OPERATOR_CODE = "PARTICIPANT OPERATOR";
    public static USER_TYPE_AGENT_CODE = "AGENT";
    public static USER_TYPE_CLIENT_CODE = "CLIENT";
    public static USER_TYPE_MARLIN_ADMIN_CODE = "MARLIN ADMIN";
    public static TOP_BUYERS_SELLERS_LIMIT = 20;

    public static ASSET_CLASS_ID_EQUITIES = 1;
    public static ASSET_CLASS_ID_BONDS = 5;
    public static ASSET_CLASS_ID_ETFS = 6;

    public static CUSTODIAN_MODEL = false;
    public static SELECTED_ASSET_CLASS = "equities"
    public static DEFAULT_IDENTIFICATION_TYPE_ID = 7;
    public static DEFAULT_VALUE_FALSE = false;
    public static DEFAULT_VALUE_TRUE = true; 
    public static INV_USERNAME = "";
    public static INV_FIRST_NAME = "";
    public static INV_LAST_NAME = "";
    public static INV_MOBILE_NUMBER = "";
    public static INV_EMAIL = "";
    public static INV_COUNTRY_ID = null;

    public static TOP_TRADED_SYMBOLS_COUNT = 5;
    public static TOP_TRADED_SYMBOLS_COUNT_UNLIMITED = 1000;
    public static DEFAULT_COUNTRY_CODE = "AGO"

    public static INV_STATUS_EMPTY = "";
    public static INV_STATUS_SUBMITTED = "S";
    public static INV_STATUS_PENDING = "P";
    public static INV_STATUS_DRAFT = "D";
    public static INV_STATUS_APPROVED = "A";
    public static INV_STATUS_REJECTED = "R";
    public static INV_STATUS_CONFIRMED = "C";
    public static INV_STATUS_REGISTERED = "RG";
    public static INV_STATUS_ACTIVE = "AC";
    public static INV_STATUS_INACTIVE = "INACTIVE";
    public static INV_SUBMITTED = "SUBMITTED";
    public static INV_PENDING = "PENDING";
    public static INV_DRAFT = "DRAFT";
    public static INV_APPROVED = "APPROVED";
    public static INV_REJECTED = "REJECTED";
    public static INV_CONFIRMED = "CONFIRMED";
    public static INV_REGISTERED = "REGISTERED";
    public static INV_ACTIVE = "ACTIVE";
    public static INV_INACTIVE = "INACTIVE";

    public static INV_BASIC_MANDATORY_TEXT = "";
    public static INV_CONTACT_MANDATORY_TEXT = "";
    public static INV_JOINT_MANDATORY_TEXT = "";
    public static INV_BANK_MANDATORY_TEXT = "";
    public static INV_BENEFICIARY_MANDATORY_TEXT = "";
    public static INV_DOCUMENT_MANDATORY_TEXT = "";
    public static INV_TRADING_CONFIG_MANDATORY_TEXT = "";

    public static BENEFICIARY_ITEM_DELETE_MSG: String = "";
    public static BANK_ITEM_DELETE_MSG: String = "";
    public static JOINT_ITEM_DELETE_MSG: String = "";
    public static DOCUMENT_ITEM_DELETE_MSG: String = "";

    public static ACCOUNT_CATEGORY_INVESTOR = 4;

    public static ACCOUNT_TYPE_INDIVIDUAL_ID = 1;
    public static ACCOUNT_TYPE_CORPORATE_ID = 2;
    public static ACCOUNT_TYPE_INDIVIDUAL_ITF_ID = 3;
    public static ACCOUNT_TYPE_JOINT_ID = 4;
    public static ACCOUNT_TYPE_INDIVIDUAL_INSTITUTIONAL_ID = 5;
    public static ACCOUNT_TYPE_COLLECTIVE_INVESTMENT_ID = 6;
    public static ACCOUNT_TYPE_CORPORATE_INSTITUTIONAL_ID = 7;

    public static ASSET_CLASS_EQUITIES = "equities";
    public static ASSET_CLASS_BONDS = "bonds";
    public static ASSET_CLASS_ETF = "etf";
    public static ASSET_CLASS_CRYPTO = "crypto";
    public static ASSET_CLASS_COMMODITIES = "commodities";
    public static ASSET_CLASS_REAL_ESTATE = "real_estate";

    public static ASSET_CODE_EQUITIES = "EQTY";
    public static ASSET_CODE_BONDS = "BOND";
    public static ASSET_CODE_ETF = "ETF";

    public static SECURITY_TYPE_EQUITIES = "Equities";
    public static SECURITY_TYPE_BONDS = "Bond";
    public static SECURITY_TYPE_ETF = "ETF";
    public static SECURITY_TYPE_CRYPTO = "Crypto";
    public static SECURITY_TYPE_COMMODITIES = "Commodity";
    public static SECURITY_TYPE_REAL_ESTATE = "Real Estate";

    public static BOND_SECTOR_ID = 2;
    public static debug: boolean = true;
    public static buyColor: String = "#35a947";
    public static sellColor: String = "#e34828";
    public static equityColor: String = "#44DE44";
    public static bondsColor: String = "#ECB500";
    public static etfColor: String = "#5DA7FF";
    public static cryptoColor: String = "#FF4560";
    public static commoditiesColor: String = "#008FFB";
    public static realEstateColor: String = "#FEB019";

    public static exchangeCode: string = "BODIVA";
    public static exchangeId: number = 0;
    public static capitalTaxPercent: number = 10;

    public static loggedinBrokerCode: string = '';
    // public static loggedinBrokerCode: string = 'MEM001'; // QA
    public static username = ''; // SIC
    public static participantId: number = 1;
    public static participantCode: string = "";
    public static loginName: string = '';
    public static userType: string = '';
    public static userId = 0; // user id
    public static tradeType: string = '';
    public static isSelectedEquities: boolean = false;

    public static splitEMS: string = '/[(/\)s]/';
    public static validatePatternSettlementType: string = '^[a-zA-Z0-9 _+.-]+$';

    public static validatePatternNumeric: string = '^[0-9]+$';
    // public static validatePatternNonZeroNumeric: string = '^[1-9]+$';// it validate number without 0, e.g 30 return false;
    public static validatePatternNonZeroNumeric: string = '^[1-9][0-9]*$';
    public static validatePatternDecimal: string = '^[0-9\.?]+$';
    public static validatePatternEmail: string = '^\\S+@(([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6})$';
    public static validatePatternPhone: string = '^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$';

    // http://stackoverflow.com/questions/9208814/validate-ipv4-ipv6-and-hostname
    // http://jsfiddle.net/DanielD/8S4nq/
    public static validate_IPv6_IPv4_Hostname: any = '((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|' +
        '[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]' +
        '{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|' +
        '(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|' +
        '[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|' +
        '[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]' +
        '{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]' +
        '{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)' +
        ')|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]' +
        '|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)' +
        '(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))|(^\s*((?=.{1,255}$)(?=.*[A-Za-z].*)[0-9A-Za-z](?:(?:[0-9A-Za-z]' +
        '|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*)\s*$)';

    lang: any
    public static MSG_BASIC_TAB_REQUIRED = 'Please fill all mandatory fields for Basic tab.';
    public static MSG_CREATE_ACCOUNT: string = 'Account successfully created.';
    public static MSG_REQUEST_FORWARD: string = 'Request is forwarded to depository successfully.';
    public static MSG_RECORD_SAVED: string = 'Record Saved Successfully.';
    public static MSG_RECORD_UPDATED: string = 'Record Updated Successfully.';
    public static MSG_PAYMENT_SCHEDULE_GENERATED: string = 'Payment Schedule is Generated Successfully.';
    public static MSG_RECORD_POSTED: string = 'Record(s) Posted Successfully.';
    public static MSG_RECORD_CANCELED: string = 'Record(s) Canceled Successfully.';;
    public static MSG_RECORD_UNPOSTED: string = 'Record(s) Unposted Successfully.';
    public static MSG_RECORD_REVERSED: string = 'Record(s) Reversed Successfully.';;
    public static MSG_RECORD_CLEARED: string = 'Cheque(s) Cleared Successfully.';
    public static MSG_RECORD_PROCESSED: string = 'Record(s) Processed Successfully.';
    public static MSG_NO_DATA_FOUND: string = 'No Data Found.';
    public static MSG_CONFIRM_RECORD_DELETION: string;

    public static YEAR_CLOSED_TEMP_STR: string;
    public static YEAR_CLOSED_PERMANENT_STR: string;
    public static YEAR_CLOSED_CURRENT_STR: string;
    public static bondMarketTypeDescription: String;
    public static PLEASE_SELECT_DISPLAYVALUE: string;

    // oms variables
    public static SELL_STRING;
    public static BUY_STRING;
    public static BOTH_STRING;

    public static MARKET_TYPE_EQUITY;
    public static ORDER_TYPE_LIMIT;
    public static ORDER_TYPE_MARKET: string = '';
    public static firstQuarter: string;
    public static secondQuarter: string;
    public static thirdQuarter: string;
    public static fourthQuarter: string;

    public static UNKNOWN_ERROR_MSG;
    public static COPY_RIGHT: string;

    public static validatePatternString: string;
    public static validatePatternGlCode: string;
    public static validatePatternStringPostalCode: string;

    public static YES_STRING: string;
    public static NO_STRING: string;


    public static Male: string;
    public static Female: string;
    public static Individual: string;
    public static Corporate: string;

    public static Loggedin: boolean;
    public static PLEASE_SELECT_STR: string;
    public static ALL_STR: string;

    constructor() {

        this.lang = localStorage.getItem("lang");

        if (this.lang == null) { this.lang = 'en' }

        switch (this.lang) {
            case "en":

                AppConstants.BENEFICIARY_ITEM_DELETE_MSG = "Are you sure to delete benficiary item?";
                AppConstants.BANK_ITEM_DELETE_MSG = "Are you sure to delete bank account item?";
                AppConstants.JOINT_ITEM_DELETE_MSG = "Are you sure to delete joint account item?";
                AppConstants.DOCUMENT_ITEM_DELETE_MSG = "Are you sure to delete document item?";

                AppConstants.INV_SUBMITTED = "SUBMITTED";
                AppConstants.INV_PENDING = "PENDING";
                AppConstants.INV_DRAFT = "DRAFT";
                AppConstants.INV_APPROVED = "APPROVED";
                AppConstants.INV_REJECTED = "REJECTED";
                AppConstants.INV_CONFIRMED = "CONFIRMED";

                AppConstants.INV_BASIC_MANDATORY_TEXT = "Please fill all mandatory fields for Basic tab.";
                AppConstants.INV_CONTACT_MANDATORY_TEXT = "Please fill all mandatory fields for Contact tab.";
                AppConstants.INV_JOINT_MANDATORY_TEXT = "Please fill all mandatory fields for Joint Account tab.";
                AppConstants.INV_BANK_MANDATORY_TEXT = "Please fill all mandatory fields for Beneficiary Account tab.";
                AppConstants.INV_BENEFICIARY_MANDATORY_TEXT = "Please fill all mandatory fields for Beneficiary Account tab.";
                AppConstants.INV_DOCUMENT_MANDATORY_TEXT = "Please fill all mandatory fields for Documents Account tab.";
                AppConstants.INV_TRADING_CONFIG_MANDATORY_TEXT = "Please fill all madatory fields for trading configuration tab."

                AppConstants.MSG_BASIC_TAB_REQUIRED = 'Please fill all mandatory fields for Basic tab.';
                AppConstants.MSG_CREATE_ACCOUNT = "Account successfully created.",
                AppConstants.MSG_REQUEST_FORWARD = 'Request is forwarded to depository successfully.';
                AppConstants.MSG_RECORD_SAVED = 'Record Saved Successfully.';
                AppConstants.MSG_RECORD_UPDATED = 'Record Updated Successfully.';
                AppConstants.MSG_PAYMENT_SCHEDULE_GENERATED = 'Payment Schedule is Generated Successfully.';
                AppConstants.MSG_RECORD_POSTED = 'Record(s) Posted Successfully.';
                AppConstants.MSG_RECORD_CANCELED = 'Record(s) Canceled Successfully.';
                AppConstants.MSG_RECORD_UNPOSTED = 'Record(s) Unposted Successfully.';
                AppConstants.MSG_RECORD_REVERSED = 'Record(s) Reversed Successfully.';
                AppConstants.MSG_RECORD_CLEARED = 'Cheque(s) Cleared Successfully.';
                AppConstants.MSG_RECORD_PROCESSED = 'Record(s) Processed Successfully.';
                AppConstants.MSG_NO_DATA_FOUND = 'No Data Found.';
                AppConstants.MSG_CONFIRM_RECORD_DELETION = 'Do you want to delete this record ?';

                AppConstants.YEAR_CLOSED_TEMP_STR = 'Temporary Close';
                AppConstants.YEAR_CLOSED_PERMANENT_STR = 'Permanent Close';
                AppConstants.YEAR_CLOSED_CURRENT_STR = 'Current';
                AppConstants.PLEASE_SELECT_STR = 'Select';
                AppConstants.bondMarketTypeDescription = 'BOND';
                AppConstants.PLEASE_SELECT_DISPLAYVALUE = 'Select';
                AppConstants.ALL_STR = 'ALL';

                // oms variables
                AppConstants.SELL_STRING = 'Sell';
                AppConstants.BUY_STRING = 'Buy';
                AppConstants.BOTH_STRING = 'Both';

                AppConstants.MARKET_TYPE_EQUITY = 'REGULAR';
                AppConstants.ORDER_TYPE_LIMIT = 'limit';
                AppConstants.ORDER_TYPE_MARKET = 'market';
                AppConstants.firstQuarter = '1st Quarter';
                AppConstants.secondQuarter = 'Half Year';
                AppConstants.thirdQuarter = '3rd Quarter';
                AppConstants.fourthQuarter = 'Full Year';

                AppConstants.UNKNOWN_ERROR_MSG = 'Unknown error';
                AppConstants.COPY_RIGHT = 'Copyright © 2019. MARLIN Ver 3.000 - All rights reserved.';

                AppConstants.validatePatternString = '^[a-zA-Z0-9 _.-]+$';
                AppConstants.validatePatternGlCode = '^[a-zA-Z0-9 /_.-]+$';
                AppConstants.validatePatternStringPostalCode = '^[a-zA-Z0-9]+$';

                AppConstants.YES_STRING = 'Yes';
                AppConstants.NO_STRING = 'No';
                AppConstants.Male = 'Male'
                AppConstants.Female = 'Female'
                AppConstants.Individual = 'Individual'
                AppConstants.Corporate = 'Corporate'

                break;
            case 'pt':

                AppConstants.BENEFICIARY_ITEM_DELETE_MSG = "Tem certeza de que deseja excluir o item do beneficiário?";
                AppConstants.BANK_ITEM_DELETE_MSG = "Tem certeza de que deseja excluir o item da conta bancária?";
                AppConstants.JOINT_ITEM_DELETE_MSG = "Tem certeza de excluir o item da conta conjunta?";
                AppConstants.DOCUMENT_ITEM_DELETE_MSG = "Tem certeza de que deseja excluir o item do documento?";

                AppConstants.INV_SUBMITTED = "SUBMETIDO";
                AppConstants.INV_PENDING = "PENDENTE";
                AppConstants.INV_DRAFT = "RASCUNHO";
                AppConstants.INV_APPROVED = "APROVADO";
                AppConstants.INV_REJECTED = "REJEITADO";
                AppConstants.INV_CONFIRMED = "CONFIRMADO";

                AppConstants.INV_BASIC_MANDATORY_TEXT = "Preencha todos os campos obrigatórios da guia Básico.";
                AppConstants.INV_CONTACT_MANDATORY_TEXT = "Por favor, preencha todos os campos obrigatórios da guia Contato.";
                AppConstants.INV_JOINT_MANDATORY_TEXT = "Preencha todos os campos obrigatórios da guia Conta Conjunta.";
                AppConstants.INV_BANK_MANDATORY_TEXT = "Por favor, preencha todos os campos obrigatórios da guia Conta do Beneficiário.";
                AppConstants.INV_BENEFICIARY_MANDATORY_TEXT = "Por favor, preencha todos os campos obrigatórios da guia Conta do Beneficiário.";
                AppConstants.INV_DOCUMENT_MANDATORY_TEXT = "Por favor, preencha todos os campos obrigatórios da guia Conta de Documentos.";

                AppConstants.INV_TRADING_CONFIG_MANDATORY_TEXT = "Por favor, preencha todos os campos obrigatórios para a guia de configuração de negociação."

                AppConstants.MSG_BASIC_TAB_REQUIRED = 'Por favor, preencha todos os campos obrigatórios da aba Básico.';
                AppConstants.MSG_CREATE_ACCOUNT = "Conta criada com sucesso.",
                    AppConstants.MSG_REQUEST_FORWARD = 'A solicitação foi encaminhada ao depositário com sucesso.'
                AppConstants.MSG_RECORD_SAVED = 'Registro Salvo Com Sucesso.';
                AppConstants.MSG_RECORD_UPDATED = 'Registro Atualizado Com Sucesso.';
                AppConstants.MSG_PAYMENT_SCHEDULE_GENERATED = 'A Programação De Pagamento Foi Gerada Com Sucesso.';
                AppConstants.MSG_RECORD_POSTED = 'Registro(s) Postado Com Sucesso.';
                AppConstants.MSG_RECORD_CANCELED = 'Registro(s) Cancelado Com Sucesso.';
                AppConstants.MSG_RECORD_UNPOSTED = 'Registro(s) Não Postado Com Sucesso.';
                AppConstants.MSG_RECORD_REVERSED = 'Registro(s) Invertida Com Sucesso.';
                AppConstants.MSG_RECORD_CLEARED = 'Verifica(s) Limpo Com Sucesso.';
                AppConstants.MSG_RECORD_PROCESSED = 'Registro(s) Processada Com Sucesso.';
                AppConstants.MSG_NO_DATA_FOUND = 'Nenhum Dado Encontrado.';
                AppConstants.MSG_CONFIRM_RECORD_DELETION = 'Deseja Excluir Este Registro ?';

                AppConstants.YEAR_CLOSED_TEMP_STR = 'Fechamento Temporário';
                AppConstants.YEAR_CLOSED_PERMANENT_STR = 'Fechamento Permanente';
                AppConstants.YEAR_CLOSED_CURRENT_STR = 'Atual';
                AppConstants.PLEASE_SELECT_STR = 'Selecionar';
                AppConstants.bondMarketTypeDescription = 'LIGAÇÃO';
                AppConstants.PLEASE_SELECT_DISPLAYVALUE = 'Selecionar';
                AppConstants.ALL_STR = 'Tudo';

                // oms variables
                AppConstants.SELL_STRING = 'Vender';
                AppConstants.BUY_STRING = 'Comprar';
                AppConstants.BOTH_STRING = 'Ambas';
                AppConstants.MARKET_TYPE_EQUITY = 'REGULAR';
                AppConstants.ORDER_TYPE_LIMIT = 'limite';
                AppConstants.ORDER_TYPE_MARKET = 'mercado';
                AppConstants.firstQuarter = '1st Trimestre';
                AppConstants.secondQuarter = 'Meio Ano';
                AppConstants.thirdQuarter = '3rd Trimestre';
                AppConstants.fourthQuarter = 'Ano Completo';

                AppConstants.UNKNOWN_ERROR_MSG = 'Erro Desconhecido';
                AppConstants.COPY_RIGHT = 'Direito Autoral © 2019. MARLIN Ver 3.000 - Todos Os Direitos Reservados.';

                AppConstants.validatePatternString = '';
                AppConstants.validatePatternGlCode = '';
                AppConstants.validatePatternStringPostalCode = '';

                AppConstants.YES_STRING = 'Sim';
                AppConstants.NO_STRING = 'Não';

                AppConstants.Male = 'Macho'
                AppConstants.Female = 'Fêmea'
                AppConstants.Individual = 'Individual'
                AppConstants.Corporate = 'Corporativo'
                break;
            default:

                AppConstants.BENEFICIARY_ITEM_DELETE_MSG = "Are you sure to delete benficiary item?";
                AppConstants.BANK_ITEM_DELETE_MSG = "Are you sure to delete bank account item?";
                AppConstants.JOINT_ITEM_DELETE_MSG = "Are you sure to delete joint account item?";
                AppConstants.DOCUMENT_ITEM_DELETE_MSG = "Are you sure to delete document item?";

                AppConstants.MSG_BASIC_TAB_REQUIRED = 'Please fill all mandatory fields for Basic tab.';
                AppConstants.MSG_CREATE_ACCOUNT = "Account successfully created.",
                    AppConstants.MSG_REQUEST_FORWARD = 'Request is forwarded to depository successfully.'
                AppConstants.MSG_RECORD_SAVED = 'Record Saved Successfully.';
                AppConstants.MSG_RECORD_UPDATED = 'Record Updated Successfully.';
                AppConstants.MSG_PAYMENT_SCHEDULE_GENERATED = 'Payment Schedule is Generated Successfully.';
                AppConstants.MSG_RECORD_POSTED = 'Record(s) Posted Successfully.';
                AppConstants.MSG_RECORD_CANCELED = 'Record(s) Canceled Successfully.';
                AppConstants.MSG_RECORD_UNPOSTED = 'Record(s) Unposted Successfully.';
                AppConstants.MSG_RECORD_REVERSED = 'Record(s) Reversed Successfully.';
                AppConstants.MSG_RECORD_CLEARED = 'Cheque(s) Cleared Successfully.';
                AppConstants.MSG_RECORD_PROCESSED = 'Record(s) Processed Successfully.';
                AppConstants.MSG_NO_DATA_FOUND = 'No Data Found.';
                AppConstants.MSG_CONFIRM_RECORD_DELETION = 'Do you want to delete this record ?';

                AppConstants.YEAR_CLOSED_TEMP_STR = 'Temporary Close';
                AppConstants.YEAR_CLOSED_PERMANENT_STR = 'Permanent Close';
                AppConstants.YEAR_CLOSED_CURRENT_STR = 'Current';
                AppConstants.PLEASE_SELECT_STR = 'Select';
                AppConstants.bondMarketTypeDescription = 'BOND';
                AppConstants.PLEASE_SELECT_DISPLAYVALUE = 'Select';
                AppConstants.ALL_STR = 'ALL';

                // oms variables
                AppConstants.SELL_STRING = 'Sell';
                AppConstants.BUY_STRING = 'Buy';
                AppConstants.BOTH_STRING = 'Both';

                AppConstants.MARKET_TYPE_EQUITY = 'REGULAR';
                AppConstants.ORDER_TYPE_LIMIT = 'limit';
                AppConstants.ORDER_TYPE_MARKET = 'market';
                AppConstants.firstQuarter = '1st Quarter';
                AppConstants.secondQuarter = 'Half Year';
                AppConstants.thirdQuarter = '3rd Quarter';
                AppConstants.fourthQuarter = 'Full Year';

                AppConstants.UNKNOWN_ERROR_MSG = 'Unknown error';
                AppConstants.COPY_RIGHT = 'Copyright © 2019. MARLIN Ver 3.000 - All rights reserved.';

                AppConstants.validatePatternString = '^[a-zA-Z0-9 _.-]+$';
                AppConstants.validatePatternGlCode = '^[a-zA-Z0-9 /_.-]+$';
                AppConstants.validatePatternStringPostalCode = '^[a-zA-Z0-9]+$';

                AppConstants.YES_STRING = 'Yes';
                AppConstants.NO_STRING = 'No';
                AppConstants.Male = 'Male'
                AppConstants.Female = 'Female'
                AppConstants.Individual = 'Individual'
                AppConstants.Corporate = 'Corporate'
        }
    }
    // ..............................................................

    public static PLEASE_SELECT_VAL: number = null;
    public static ALL_VAL: number = -1;
    public static MSG_RECORD_DELETED: string = 'Record Deleted Successfully.';
    public static SECURITY_TYPE_EQUITY: number = 1;
    public static SECURITY_TYPE_BOND: number = 2;
    public static DATE_TIME_FORMAT: string = 'dd-MM-yyyy HH:mm:ss tt';
    public static DATE_FORMAT: string = 'yyyy-MM-dd';
    public static DATE_MASK: '0000-00-00';
    public static ACCOUNT_TYPE_SINGLE: string = 'S';
    public static ACCOUNT_TYPE_JOINT: string = 'J';
    public static INDIVIDUAL_TYPE: string = 'I';
    public static CORPORATE_TYPE: string = 'C';

    public static USER_TYPE_PARTICIPANT_ADMIN: number = 3;
    public static USER_TYPE_PARTICIPANT_OPERATOR: number = 4;
    public static USER_TYPE_AGENT: number = 5;
    public static USER_TYPE_CLIENT: number = 6;
    public static DEFAULT_MIN_DATE: string = '1900-01-01';
    public static YEAR_CLOSED_CURRENT: string = 'C';
    public static YEAR_CLOSED_TEMP: string = 'T';
    public static YEAR_CLOSED_PERMANENT: string = 'P';
    public static YEAR_CLOSED_NEW: string = 'N';
    public static YEAR_CLOSED_NEW_STR: string = '-';
    public static ENTRY_TYPE_DEPOSIT: string = 'D';
    public static ENTRY_TYPE_WITHDRAW: string = 'W';
    public static ENTRY_TYPE_PLEDGE: string = 'P';
    public static ENTRY_TYPE_RELEASE: string = 'R';

    public static MARKET_TYPE_EQUITIES_ = 'Equities';
    public static MARKET_TYPE_QUOTE_ = 'Quote';
    public static MARKET_TYPE_BOND = 'BOND';
    public static MARKET_TYPE_ETF_ = 'ETF';

    public static validatePatternStringSymbolMarketExchange: string = '^[a-zA-Z0-9 (/).-]+$';

    // oms variables
    static delimExp: string = '/,/g';
    public static PRECISION: number = 4;
    public static LABEL_SEPARATOR = '_';
    public static VALUE_SEPARATOR = ':';

    public static MARKET_TYPE_ODD_LOT = 'ODD LOT';
    public static ORDER_TYPE_SL = 'sl';
    public static ORDER_TYPE_SM = 'sm';

    public static COUPON_FREQUENCY_ANNUAL = 'A';
    public static COUPON_FREQUENCY_BIANNUAL = 'B';
    public static COUPON_FREQUENCY_QUARTER = 'Q';


    public static SELL_ABBREVIATION = 'S';
    public static BUY_ABBREVIATION = 'B';
    public static BOTH_ABBREVIATION = 'O';

    public static NUMERIC_FORMATTER = 'n0';
    public static DECIMAL_FORMATTER = 'n4';

    public static PERCENTAGE_ABBREVIATION = 'P';
    public static FIXED_ABBREVIATION = 'F';
    public static PERCENTAGE_ON_COMMISSION_ABBREVIATION = 'C';
    public static PERCENTAGE_ON_BADLA_ABBREVIATION = 'B';
    public static PERCENTAGE_ON_DELIVERY_ABBREVIATION = 'D';

    public static Male_Code: String = 'M'
    public static Female_Code: String = 'F'
    public static Corporate_Code: String = 'C'
    public static Individual_Code: String = 'I'

    public static PERCENTAGE_STRING = 'Percentage On Gross Amount';
    public static FIXED_STRING = 'Fixed';
    public static PERCENTAGE_ON_COMMISSION_STRING = 'Percentage On Commission';
    public static PERCENTAGE_ON_BADLA_STRING = 'Percentage On Badla';
    public static PERCENTAGE_ON_DELIVERY_STRING = 'Percentage On Delivery';

    public static PARTICIPANT = 'Participant';
    public static CLIENT = 'Client';

    public static PARTICIPANT_ABBREVIATION = 'P';
    public static CLIENT_ABBREVIATION = 'C';


    public static SYMBOL_TYPE_EQUITIES = 1;
    public static SYMBOL_TYPE_BONDS = 2;
    public static SYMBOL_TYPE_ETF = 0;
    public static SYMBOL_TYPE_QUOTE = 0;

    public static MARKET_TYPE_EQUITIES = 0;
    public static MARKET_TYPE_BONDS = 0;
    public static MARKET_TYPE_ETF = 8;
    public static MARKET_TYPE_QUOTE = 6;

    public static Dummy_Password: string = 'Aa!1Bb@2Cc#3';

    // Announcement Types Constants.
    public static FINANCIAL_RESULT_ANNOUNCEMENT_ID = 1;
    public static MEETING_ANNOUNCEMENT_ID = 2;
    public static OTHER_ANNOUNCEMENT_ID = 3;

    // order confirmation message display timeout
    public static TIME_OUT_CONFIRMATION_MSG = 5000;

    // ticker
    public static TICKER_EXCHANGE = 'GSE';

    //  Password Management constants
    public static forcePasswordChange: boolean = false;
    public static passwordStrength: string = '';


    public static apiBaseUrl: string = environment.BASE_API_URL; // java app services NayabFaisal
    public static ioBaseUrl: string = environment.socketUrl; // socket io server
    public static omsBaseUrl: string = environment.omsBaseUrl; // cpp services


    // public static loggedinBrokerCode: string = 'MEM001'; // QA
    public static bondMarketTypeId: Number = 3;
    public static claims2 = null;
    public static selectedAssetClass: string = 'equities';
    public static PLEASE_SELECT_VAL_STR: string = '';

    public static DATE_TIME_FORMATT: string = 'yyyy-MM-dd HH:mm:ss';

    // oms variables
    public static LABEL_SEPARATOR2 = '/';

}

