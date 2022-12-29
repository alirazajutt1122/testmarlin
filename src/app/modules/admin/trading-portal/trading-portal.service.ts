import {Injectable} from '@angular/core';
import {RestService} from "../../../services/api/rest.service";
import {TradingSymbolAdapter} from "./trading-portal-types/trading-symbols.types";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {TradingGraph} from "./trading-portal-types/trading-graph.types";

@Injectable({
    providedIn: 'root'
})

export class TradingPortalService {

    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    tradingSymbols = [{
        BOARD_LOT: "100",
        CLOSE_PRICE: "107",
        COMPANY_ID: "1485",
        COMPANY_NAME: "ALLIED BANK",
        CURRENCY: "GHS",
        FIFTY_TWO_WEEK_HIGH: "0",
        FIFTY_TWO_WEEK_LOW: "0",
        INTERNAL_SYMBOL_ID: "16",
        ISPOSTED: "true",
        LAST_ANNOUNCEMENT: "",
        LAST_ANNOUNCEMENT_DATE: "2021-03-19T10:46:39+05:00",
        LOWER_CURCIT_BREAKER_LIMIT: "101.7000000000000000",
        LOWER_ORDER_VALUE_LIMIT: "10",
        LOWER_ORDER_VOLUME_LIMIT: "100",
        LOWER_VALUE_ALERT_LIMIT: "0",
        MARKET_ID: "1",
        OUTSTANDING_SHARES: "100",
        QUOTE_SPREAD: "0",
        SETTLEMENT_DATE: "2022-01-25T00:00:00+05:00",
        SETTLEMENT_DAYS: "3",
        SETTLEMENT_TYPE: "T+3",
        STATE: "Active",
        SYMBOL: "AADS",
        SYMBOL_ID: "1073",
        SYMBOL_TYPE: "EQUITIES",
        TICK_SIZE: "0.1000000000000000",
        UPPER_CURCIT_BREAKER_LIMIT: "128.4000000000000000",
        UPPER_ORDER_VALUE_LIMIT: "10000000",
        UPPER_ORDER_VOLUME_LIMIT: "1000",
        UPPER_VALUE_ALERT_LIMIT: "0"
    }, {
        BOARD_LOT: "100",
        CLOSE_PRICE: "107",
        COMPANY_ID: "1485",
        COMPANY_NAME: "ALLIED BANK",
        CURRENCY: "GHS",
        FIFTY_TWO_WEEK_HIGH: "0",
        FIFTY_TWO_WEEK_LOW: "0",
        INTERNAL_SYMBOL_ID: "16",
        ISPOSTED: "true",
        LAST_ANNOUNCEMENT: "",
        LAST_ANNOUNCEMENT_DATE: "2021-03-19T10:46:39+05:00",
        LOWER_CURCIT_BREAKER_LIMIT: "101.7000000000000000",
        LOWER_ORDER_VALUE_LIMIT: "10",
        LOWER_ORDER_VOLUME_LIMIT: "100",
        LOWER_VALUE_ALERT_LIMIT: "0",
        MARKET_ID: "1",
        OUTSTANDING_SHARES: "100",
        QUOTE_SPREAD: "0",
        SETTLEMENT_DATE: "2022-01-25T00:00:00+05:00",
        SETTLEMENT_DAYS: "3",
        SETTLEMENT_TYPE: "T+3",
        STATE: "Active",
        SYMBOL: "CAL ",
        SYMBOL_ID: "953",
        SYMBOL_TYPE: "EQUITIES",
        TICK_SIZE: "0.1000000000000000",
        UPPER_CURCIT_BREAKER_LIMIT: "128.4000000000000000",
        UPPER_ORDER_VALUE_LIMIT: "10000000",
        UPPER_ORDER_VOLUME_LIMIT: "1000",
        UPPER_VALUE_ALERT_LIMIT: "0"
    }, {
        BOARD_LOT: "100",
        CLOSE_PRICE: "107",
        COMPANY_ID: "1485",
        COMPANY_NAME: "ALLIED BANK",
        CURRENCY: "GHS",
        FIFTY_TWO_WEEK_HIGH: "0",
        FIFTY_TWO_WEEK_LOW: "0",
        INTERNAL_SYMBOL_ID: "16",
        ISPOSTED: "true",
        LAST_ANNOUNCEMENT: "",
        LAST_ANNOUNCEMENT_DATE: "2021-03-19T10:46:39+05:00",
        LOWER_CURCIT_BREAKER_LIMIT: "101.7000000000000000",
        LOWER_ORDER_VALUE_LIMIT: "10",
        LOWER_ORDER_VOLUME_LIMIT: "100",
        LOWER_VALUE_ALERT_LIMIT: "0",
        MARKET_ID: "1",
        OUTSTANDING_SHARES: "100",
        QUOTE_SPREAD: "0",
        SETTLEMENT_DATE: "2022-01-25T00:00:00+05:00",
        SETTLEMENT_DAYS: "3",
        SETTLEMENT_TYPE: "T+3",
        STATE: "Active",
        SYMBOL: "ABL",
        SYMBOL_ID: "44101",
        SYMBOL_TYPE: "EQUITIES",
        TICK_SIZE: "0.1000000000000000",
        UPPER_CURCIT_BREAKER_LIMIT: "128.4000000000000000",
        UPPER_ORDER_VALUE_LIMIT: "10000000",
        UPPER_ORDER_VOLUME_LIMIT: "1000",
        UPPER_VALUE_ALERT_LIMIT: "0"
    }]

    constructor(private _httpClient: HttpClient, private restService: RestService, private tradingSymbolAdapter: TradingSymbolAdapter, private tradingGraphData: TradingGraph) {
    }

    getAllTradingSymbols() {
        return this.tradingSymbols.map(data => {
            return this.tradingSymbolAdapter.adapt(data)
        });
    }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    getData(): Observable<any> {
        
        return this._httpClient.get('api/dashboards/crypto').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getKlineGraphData() {
        return this.restService.get(false, 'security/symbol/stats/exch/GSE/CPC/limit/1000').pipe(map((res => {
            return res.map(u => this.tradingGraphData.adapt(u));
        })));
    }

    getKlineGraphDataDynamic(exchange: string, symbolCode: string, dataLength: number) {
        return this.restService.get(false, `security/symbol/stats/exch/${exchange}/${symbolCode}/limit/${dataLength}`).pipe(map((res => {
            return res.map(u => this.tradingGraphData.adapt(u));
        })))
    }
}
