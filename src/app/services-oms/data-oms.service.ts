'use strict';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular//common/http';
import { Observable } from 'rxjs';
import {map,catchError } from 'rxjs/operators';



import { Order } from '../models/order';
import { SecurityMarketDetails } from '../models/security-market-details';

import { AppUtility } from '../app.utility';

import { ListingService } from './listing-oms.service';
import { AuthService2 } from 'app/services/auth2.service';
import { AppConstants } from 'app/app.utility';

////////////////////////////////////////////////////////////////////////

// Common data service
@Injectable()
export class DataServiceOMS {
    symbolsData: any[] = [];
    errorMessage: string = '';
    symbolMktExch: string = '';
    symbolBondMktExch: string = '';

    symbolSubscribeArr: any[] = [];

    // ---------------------------------------------------------------

    constructor(private listingService: ListingService,
        private http: HttpClient, private authService: AuthService2) {
        // Getting Participant security exchanges
        this.getExchangeMarketSecurities();
    }

    // ---------------------------------------------------------------

    public getExchangeMarketSecurities() {

        if (this.symbolsData.length !== 0)
            return;

        if (AppUtility.isValidVariable(AppConstants.participantId))
        {
            this.listingService.getParticipantSecurityExchanges(AppConstants.participantId)
            .subscribe(restData => {
                if (AppUtility.isValidVariable(restData)) {
                    this.symbolsData = restData;
                }

            },
            error => this.errorMessage = <any>error);
        }
        if(AppConstants.participantId === null)
        {
            this.listingService.getexchangeCodeSecurityExchanges()
            .subscribe(restData => {
                if (AppUtility.isValidVariable(restData)) {
                    this.symbolsData = restData;
                }

            },
            error => this.errorMessage = <any>error);
        }

    }

    // -------------------------------------------------------------------------

    public getParticipantExchangeMarkets(brokerId: number): any {
        let url: string = AppConstants.apiBaseUrl + 'participants/' + brokerId + '/exchange-markets/';

        let Httpheaders= new HttpHeaders();
        Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

        return this.http.get(url, { headers: Httpheaders })
           .pipe(catchError(error => Observable.throw(error)));
    }

    // ---------------------------------------------------------------

    public getMarketType(exchangeCode, marketCode, securityCode): string {
        let marketTypeCode: string = '';
        if (!AppUtility.isValidVariable(this.symbolsData))
            return marketTypeCode;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeCode === exchangeCode &&
                this.symbolsData[i].marketCode === marketCode &&
                this.symbolsData[i].securityCode === securityCode) {
                return this.symbolsData[i].marketTypeCode;
            }
        }

        return marketTypeCode;
    }

    // ---------------------------------------------------------------

    public getSecuritiesByExchange(exchangeId) {
        let data = [];
        if (!AppUtility.isValidVariable(this.symbolsData))
            return data;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeId === exchangeId) {
                data[i] = this.symbolsData[i];
            }
        }

        return data;
    }

    // ---------------------------------------------------------------

    public getSecurityDetails(exchangeCode, marketCode, securityCode): any {
        let data: any;
        if (!AppUtility.isValidVariable(this.symbolsData))
            return data;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeCode === exchangeCode &&
                this.symbolsData[i].marketCode === marketCode &&
                this.symbolsData[i].securityCode === securityCode) {
                data = this.symbolsData[i];
            }
        }

        return data;
    }

    // ---------------------------------------------------------------

    public getSecurityId(exchangeId: number, marketId: number, securityCode: string): number {
        let securityId = 0;
        if (!AppUtility.isValidVariable(this.symbolsData) || AppUtility.isEmpty(this.symbolsData))
            return securityId;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeId === exchangeId &&
                this.symbolsData[i].marketId === marketId &&
                this.symbolsData[i].securityCode === securityCode) {
                securityId = this.symbolsData[i].securityId;
            }
        }

        return securityId;
    }

    // ---------------------------------------------------------------

    public isValidSymbol(exchangeCode: string, marketCode: string, securityCode: string): boolean {
        let securityFound: boolean = false;
        if (!AppUtility.isValidVariable(this.symbolsData) || AppUtility.isEmpty(this.symbolsData))
            return securityFound;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeCode === exchangeCode &&
                this.symbolsData[i].marketCode === marketCode &&
                this.symbolsData[i].securityCode === securityCode) {
                securityFound = true;
                break;
            }
        }

        return securityFound;
    }

    // ---------------------------------------------------------------

    public getEmsId(exchangeCode: string, marketCode: string, securityCode: string): number {
        if (!AppUtility.isValidVariable(this.symbolsData) || AppUtility.isEmpty(this.symbolsData))
            return -1;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeCode === exchangeCode &&
                this.symbolsData[i].marketCode === marketCode &&
                this.symbolsData[i].securityCode === securityCode) {
                return this.symbolsData[i].exchangeMarketSecurityId;
            }
        }

        return -1;
    }

    // ---------------------------------------------------------------

    public isValidEquitySymbol(exchangeCode: string, marketCode: string, securityCode: string): boolean {
        let securityFound: boolean = false;
        if (!AppUtility.isValidVariable(this.symbolsData) || AppUtility.isEmpty(this.symbolsData))
            return securityFound;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeCode === exchangeCode &&
                this.symbolsData[i].marketCode === marketCode &&
                this.symbolsData[i].securityCode === securityCode &&
                this.symbolsData[i].marketTypeCode !== AppConstants.MARKET_TYPE_BOND) {
                securityFound = true;
                break;
            }
        }

        return securityFound;
    }

    // ---------------------------------------------------------------

    public isValidBondSymbol(exchangeCode: string, marketCode: string, securityCode: string): boolean {
        let securityFound: boolean = false;
        if (!AppUtility.isValidVariable(this.symbolsData) || AppUtility.isEmpty(this.symbolsData))
            return securityFound;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeCode === exchangeCode &&
                this.symbolsData[i].marketCode === marketCode &&
                this.symbolsData[i].securityCode === securityCode &&
                this.symbolsData[i].marketTypeCode === AppConstants.MARKET_TYPE_BOND) {
                securityFound = true;
                break;
            }
        }

        return securityFound;
    }

    // ---------------------------------------------------------------

    getSecurityMarketDetails(exchangeCode, marketCode, securityCode): SecurityMarketDetails {
        let securityMD: SecurityMarketDetails = new SecurityMarketDetails();
        if (!AppUtility.isValidVariable(this.symbolsData) || AppUtility.isEmpty(this.symbolsData))
            return securityMD;

        for (let i = 0; i < this.symbolsData.length; i++) {
            if (this.symbolsData[i].exchangeCode === exchangeCode &&
                this.symbolsData[i].marketCode === marketCode &&
                this.symbolsData[i].securityCode === securityCode) {
                securityMD.exchangeId = this.symbolsData[i].exchangeId;
                securityMD.marketId = this.symbolsData[i].marketId;
                securityMD.securityId = this.symbolsData[i].securityId;
            }
        }

        return securityMD;
    }

    // ---------------------------------------------------------------

    getEmptyOrders(count): any {
        let tempData = [];
        let order: Order;

        for (let i = 0; i < count; i++) {
            order = new Order();
            order.clearOrder();
            tempData.push(order);
        }

        return tempData;
    }

    // ---------------------------------------------------------------

    clearSymbolSubscribed() {
        this.symbolSubscribeArr = [];
    }

    // ---------------------------------------------------------------

    isSymbolSubscribed(exchange, market, symbol): boolean {
        let isSubscribed: boolean = false;
        for (let i = 0; i < this.symbolSubscribeArr.length; i++) {
            if (this.symbolSubscribeArr[i].exchangeCode === exchange &&
                this.symbolSubscribeArr[i].exchangeCode === exchange &&
                this.symbolSubscribeArr[i].exchangeCode === exchange) {
                isSubscribed = true;
                return true;
            }
        }

        return isSubscribed;
    }

    // ---------------------------------------------------------------

    setExchMktSymbol(exchange, market, symbol) {
        this.symbolMktExch = symbol + AppConstants.LABEL_SEPARATOR + market + AppConstants.LABEL_SEPARATOR + exchange;
    }

    // ---------------------------------------------------------------

    setExchBondMktSymbol(exchange, market, symbol) {
        this.symbolBondMktExch = symbol + AppConstants.LABEL_SEPARATOR + market + AppConstants.LABEL_SEPARATOR + exchange;
    }
}



