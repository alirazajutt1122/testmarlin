import {Injectable} from '@angular/core';
import {data} from "autoprefixer";


@Injectable({
    providedIn: 'root'
})

export class TradingGraph {
    public adapt(item): TradingGraphKline {
        return {
            volume: +item.lastTradeQuantity + Math.floor(Math.random() * (1000 - 545 + 1) + 545),
            open: +item.open + Math.floor(Math.random() * (550 - 545 + 1) + 545),
            close: +item.currentPrice +  Math.floor(Math.random() * (550 - 545 + 1) + 545),
            turnover: +item.totalTradedQuantity,
            low: +item.low +  Math.floor(Math.random() * (550 - 545 + 1) + 545),
            high: +item.high +  Math.floor(Math.random() * (550 - 545 + 1) + 545),
            timestamp: new Date(item.entryDatetime).getTime(),
            securityDescription: item.securityDescription,
        };
    }
}

export interface TradingGraphKline {
    volume: number;
    open: number;
    close: number;
    turnover: number;
    low: number;
    high: number;
    timestamp: number;
    securityDescription: string;
}
