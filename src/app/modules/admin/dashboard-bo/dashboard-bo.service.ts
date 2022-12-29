import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { AppConstants } from 'app/app.utility';
import { Market } from 'app/models/market';
import { RestService } from 'app/services/api/rest.service';

@Injectable({
    providedIn: 'root'
})


export class DashboardBoService {

    private market$ = new BehaviorSubject<Array<any>>([]);
    urlString: string;

    constructor(private _httpClient: HttpClient, private listingService: ListingService, private restService: RestService) {
        this.getMarkets()
    }

    getMarkets() {
        this.listingService.getActiveMarketList()
            .subscribe(
                restData => {
                    let marketList = restData;

                    var market: Market = new Market();
                    market.marketId = AppConstants.PLEASE_SELECT_VAL;
                    market.marketCode = AppConstants.PLEASE_SELECT_STR;

                    marketList.unshift(market)
                    this.market$.next(marketList)
                },
                error => {
                });
    }

    get marketList(): Observable<any> {
        return this.market$.asObservable();
    }


    public participantClientsData(participantId: Number, fromDate: any, toDate: any,): any {
        this.urlString = "dashboard/clientdata/participantId/" + participantId + "/from-date/" + fromDate + "/to-date/" + toDate
        return this.restService.get(true, this.urlString);
    }

    public topBuyers(participantId: Number, fromDate: any, toDate: any, sortingType: string, limit: number): any {
        this.urlString = "dashboard/top-buyers/participantId/" + participantId + "/order/" + sortingType + "/from-date/" + fromDate + "/to-date/" + toDate + "/limit/" + limit
        return this.restService.get(true, this.urlString);
    }

    public topSellers(participantId: Number, fromDate: any, toDate: any, sortingType: string, limit: number): any {
        this.urlString = "dashboard/top-sellers/participantId/" + participantId + "/order/" + sortingType + "/from-date/" + fromDate + "/to-date/" + toDate + "/limit/" + limit
        return this.restService.get(true, this.urlString);
    }

    public getDeliveryObligationData(participantId: Number, marketCode: string): any {
        this.urlString = "dashboard/delivery-obligation/participantId/" + participantId + "/marketCode/" + marketCode
        return this.restService.get(true, this.urlString);
    }

    public getCahsObligationData(participantId: Number): any {
        this.urlString = "dashboard/cash-obligation/participantId/" + participantId
        return this.restService.get(true, this.urlString);
    }

    public getRejectedOrders(participantId: Number, marketCode: string, limit: number, date: string): any {
        this.urlString = "dashboard/rejected-orders/participantId/" + participantId + "/trade-date/" + date + "/marketCode/" + marketCode + "/limit/" + limit
        return this.restService.get(true, this.urlString);
    }

    public getTopPerformers(participantId: Number, marketCode: string, sortingType: string, limit: number): any {
        this.urlString = "dashboard/top-performers/participantId/" + participantId + "/marketCode/" + marketCode + "/order/" + sortingType + "/limit/" + limit
        return this.restService.get(true, this.urlString);
    }

    public systemStats(participantId: Number, date: string): any {
        this.urlString = "dashboard/system-stats/participantId/" + participantId + "/trade-date/" + date
        return this.restService.get(true, this.urlString);
    }



}
