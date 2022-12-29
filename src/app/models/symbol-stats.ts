import * as wijmo from '@grapecity/wijmo';
import { AppConstants } from '../app.utility';

export class SymbolStats
{
    average_price: number;
    close: number;
    fifty_two_week_high: number;
    fifty_two_week_low: number;
    last_day_close_price: number;
    last_trade_price: number;
    last_trade_size: number;
    exchange: string = '';
    market: string = '';
    open: number;
    symbol: string = '';
    ldcp: number;
    high: number;
    low: number;
    total_size_traded: number;
    total_no_of_trades: number;
    turn_over: number;
    net_change: number;
    net_change_percentage: number;
    last_trade_time: Date;

    bid : number;
    bid_qty : number;
    offer: number;
    offer_qty : number;

    // ----------------------------------------------------------------

    constructor ()
    {
        this.average_price = 0;
        this.close = 0;
        this.fifty_two_week_high = 0;
        this.fifty_two_week_low = 0;
        this.last_day_close_price = 0;
        this.last_trade_price = 0;
        this.open = 0;
        this.high = 0;
        this.low = 0;
        this.total_size_traded = 0;
        this.total_no_of_trades = 0;
        this.last_trade_size = 0;
        this.turn_over = 0;
        this.net_change = 0;
        this.net_change_percentage = 0;

        this.bid = 0;
        this.bid_qty = 0;
        this.offer = 0;
        this.offer_qty = 0;
    }

    // ----------------------------------------------------------------

    updateSymbolStats(symbolStats)
    {
        this.average_price = symbolStats.average_price;
        this.last_day_close_price = symbolStats.last_day_close_price;
        this.last_trade_price = symbolStats.last_trade_price;
        this.open = symbolStats.open;
        this.high = symbolStats.high;
        this.low = symbolStats.low;
        this.total_size_traded = symbolStats.total_size_traded;
        this.total_no_of_trades = symbolStats.total_no_of_trades;
        this.last_trade_size = symbolStats.last_trade_size;
        this.turn_over = Number(symbolStats.turn_over);
        this.net_change = symbolStats.net_change;
    }


    updateStatsForBidAndOffer(symbolStats){

        this.bid = Number(symbolStats.buy.price);
        this.bid_qty = symbolStats.buy.volume;
        this.offer = Number(symbolStats.sell.price);
        this.offer_qty = symbolStats.sell.volume;
  
     }





    updateSymbolStatsForOrderWindow(symbolStats)
    {
        this.average_price = symbolStats.average_price;
        this.last_day_close_price = symbolStats.last_day_close_price;
        this.last_trade_price = symbolStats.last_trade_price;
        this.open = symbolStats.open;
        this.high = symbolStats.high;
        this.low = symbolStats.low;
        this.total_size_traded = Number(symbolStats.total_size_traded);
        this.total_no_of_trades = Number(symbolStats.total_no_of_trades);
        this.last_trade_size = Number(symbolStats.last_trade_size);
        this.turn_over = Number(symbolStats.turn_over);
        this.net_change = symbolStats.net_change;
    }


}

