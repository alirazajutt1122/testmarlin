import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})

export class TradingSymbolAdapter {
    public adapt(item): TradingSymbolTypes {
        return {
            boardLot: item.BOARD_LOT,
            closePrice: item.CLOSE_PRICE,
            companyId: item.COMPANY_ID,
            companyName: item.COMPANY_NAME,
            currency: item.CURRENCY,
            fiftyTwoWeekHigh: item.FIFTY_TWO_WEEK_HIGH,
            fiftyTwoWeekLow: item.FIFTY_TWO_WEEK_LOW,
            internalSymbolId: item.INTERNAL_SYMBOL_ID,
            isPosted: item.ISPOSTED,
            lastAnnouncement: item.LAST_ANNOUNCEMENT,
            lastAnnouncementDate: item.LAST_ANNOUNCEMENT_DATE,
            lowerCircuitBreakerLimit: item.LOWER_CURCIT_BREAKER_LIMIT,
            lowerOrderValueLimit: item.LOWER_ORDER_VALUE_LIMIT,
            lowerOrderVolumeLimit: item.LOWER_ORDER_VOLUME_LIMIT,
            lowerValueAlertLimit: item.LOWER_VALUE_ALERT_LIMIT,
            marketId: item.MARKET_ID,
            outstandingShares: item.OUTSTANDING_SHARES,
            quoteSpread: item.QUOTE_SPREAD,
            settlementDate: item.SETTLEMENT_DATE,
            settlementDays: item.SETTLEMENT_DAYS,
            settlementType: item.SETTLEMENT_TYPE,
            state: item.STATE,
            symbol: item.SYMBOL,
            symbolId: item.SYMBOL_ID,
            symbolType: item.SYMBOL_TYPE,
            tickSize: item.TICK_SIZE,
            upperCircuitBreakerLimit: item.UPPER_CURCIT_BREAKER_LIMIT,
            upperOrderValueLimit: item.UPPER_ORDER_VALUE_LIMIT,
            upperOrderVolumeLimit: item.UPPER_ORDER_VOLUME_LIMIT,
            upperValueAlterLimit: item.UPPER_VALUE_ALERT_LIMIT,
        };
    }
}


export interface TradingSymbolTypes {
    boardLot: string;
    closePrice: string;
    companyId: string;
    companyName: string;
    currency: string;
    fiftyTwoWeekHigh: string;
    fiftyTwoWeekLow: string;
    internalSymbolId: any;
    isPosted: boolean;
    lastAnnouncement: number;
    lastAnnouncementDate: Date;
    lowerCircuitBreakerLimit: string;
    lowerOrderValueLimit: string;
    lowerOrderVolumeLimit: string;
    lowerValueAlertLimit: string;
    marketId: string;
    outstandingShares: string;
    quoteSpread: string;
    settlementDate: Date;
    settlementDays: string;
    settlementType: string;
    state: string;
    symbol: string;
    symbolId: string;
    symbolType: string;
    tickSize: string;
    upperCircuitBreakerLimit: string;
    upperOrderValueLimit: string;
    upperOrderVolumeLimit: string;
    upperValueAlterLimit: string;
}
