import * as wijmo from '@grapecity/wijmo';
import {AppConstants} from '../app.utility';
import {AppUtility} from '../app.utility';

export class BestMarket {

    exchange:string;
    market:string='';
    symbol:string='';
    buy_price:number;
    sell_price:number;
    buy_volume:number;
    sell_volume:number;

    constructor() {
        this.buy_price = 0;
        this.buy_volume = 0;
        this.sell_price = 0;
        this.sell_volume = 0;
    }

    updateBestMarketData(bestMarket) {
        // this.sell_price  = wijmo.Globalize.format(Number(bestMarket.sell.price), AppConstants.DECIMAL_FORMATTER);
        // this.sell_volume = wijmo.Globalize.format(Number(bestMarket.sell.volume), AppConstants.NUMERIC_FORMATTER);
        // this.buy_price   = wijmo.Globalize.format(Number(bestMarket.buy.price), AppConstants.DECIMAL_FORMATTER);
        // this.buy_volume  = wijmo.Globalize.format(Number(bestMarket.buy.volume), AppConstants.NUMERIC_FORMATTER);

        if ( AppUtility.isValidVariable(bestMarket.sell) ) {
            this.sell_price  = Number(bestMarket.sell.price);
            this.sell_volume = Number(bestMarket.sell.volume);
        }
        if ( AppUtility.isValidVariable(bestMarket.buy) ) {
            this.buy_price   = Number(bestMarket.buy.price);
            this.buy_volume  = Number(bestMarket.buy.volume);
        }

    }

}
