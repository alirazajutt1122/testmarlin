import * as wijmo from '@grapecity/wijmo';


import { AppConstants, AppUtility } from '../app.utility';

////////////////////////////////////////////////////////////////////////////

export class MarketWatch {
    exchangeId: string = '';
    exchangeCode: string = '';
    marketId: string = '';
    marketCode: string = '';
    symbol: string = '';
    currency: string = '';

    // best market fields 
    sell_price: string = '';
    sell_price_old: string = '';
    sell_volume: string = '';
    sell_volume_old: string = '';
    buy_price: string = '';
    buy_price_old: string = '';
    buy_volume: string = '';
    buy_volume_old: string = '';

    // symbol stats fields 
    last_day_close_price: string = '';
    last_trade_price: string = '';
    last_trade_size: string = '';
    total_size_traded: string = '';
    total_no_of_trades: string = '';
    turn_over: string = '';
    net_change: string = '';
    net_change_percentage: string = '';
    average_price: string = '';
    open: string = '';
    high: string = '';
    low: string = '';

    // bond related fields; 
    couponRate: string = '';
    nextCouponDate: string = '';
    maturityDate: string = '';

    // ----------------------------------------------------------------------

    clearData(all: boolean = false)
    {
        if (all)
        {
            this.exchangeCode = '';
            this.marketCode = '';
            this.symbol = '';
        }

        this.currency = '';

        // best market fields 
        this.sell_price = '';
        this.sell_volume = '';
        this.buy_price = '';
        this.buy_volume = '';

        // symbol stats fields 
        this.last_day_close_price = '';
        this.last_trade_price = '';
        this.last_trade_size = '';
        this.total_size_traded = '';
        this.total_no_of_trades = '';
        this.turn_over = '';
        this.net_change = '';
        this.net_change_percentage = '';
        this.average_price = '';
        this.open = '';
        this.high = '';
        this.low = '';

        this.couponRate = '';
        this.nextCouponDate = '';
        this.maturityDate = '';
    }

    // ----------------------------------------------------------------------

    updateSymbolDetails(symbol)
    {
        this.currency = symbol.currency;
    }

    // ----------------------------------------------------------------------

    updateSymbolStats(symbolStats)
    {
        if (!AppUtility.isValidVariable(symbolStats))
            return;

        this.average_price = wijmo.Globalize.format(Number(symbolStats.average_price), AppConstants.DECIMAL_FORMATTER);
        this.last_day_close_price = wijmo.Globalize.format(Number(symbolStats.last_day_close_price), AppConstants.DECIMAL_FORMATTER);
        this.last_trade_price = wijmo.Globalize.format(Number(symbolStats.last_trade_price), AppConstants.DECIMAL_FORMATTER);
        this.open = wijmo.Globalize.format(Number(symbolStats.open), AppConstants.DECIMAL_FORMATTER);
        this.high = wijmo.Globalize.format(Number(symbolStats.high), AppConstants.DECIMAL_FORMATTER);
        this.low = wijmo.Globalize.format(Number(symbolStats.low), AppConstants.DECIMAL_FORMATTER);
        this.total_size_traded = wijmo.Globalize.format(Number(symbolStats.total_size_traded), AppConstants.NUMERIC_FORMATTER);
        this.total_no_of_trades = wijmo.Globalize.format(Number(symbolStats.total_no_of_trades), AppConstants.NUMERIC_FORMATTER);
        this.last_trade_size = wijmo.Globalize.format(Number(symbolStats.last_trade_size), AppConstants.NUMERIC_FORMATTER);
        this.turn_over = wijmo.Globalize.format(Number(symbolStats.turn_over), AppConstants.NUMERIC_FORMATTER);
        this.net_change = wijmo.Globalize.format(Number(symbolStats.net_change), AppConstants.DECIMAL_FORMATTER);
        this.net_change_percentage = wijmo.Globalize.format(Number(symbolStats.net_change_percentage), AppConstants.DECIMAL_FORMATTER);        
    }

    // ----------------------------------------------------------------------

    updateBestMarket(bestMarket)
    {
        if (!AppUtility.isValidVariable(bestMarket))
            return;

        this.sell_price_old = this.sell_price;
        this.sell_volume_old = this.sell_volume;
        this.buy_price_old = this.buy_price;
        this.buy_volume_old = this.buy_volume;

        if (AppUtility.isValidVariable(bestMarket.sell))
        {
            this.sell_price = wijmo.Globalize.format(Number(AppUtility.isValidVariable(bestMarket.sell.price) ? bestMarket.sell.price : 0.0), AppConstants.DECIMAL_FORMATTER);
            this.sell_volume = wijmo.Globalize.format(Number(AppUtility.isValidVariable(bestMarket.sell.volume) ? bestMarket.sell.volume : 0.0), AppConstants.NUMERIC_FORMATTER);
        }

        if (AppUtility.isValidVariable(bestMarket.buy))
        {
            this.buy_price = wijmo.Globalize.format(Number(AppUtility.isValidVariable(bestMarket.buy.price) ? bestMarket.buy.price : 0.0), AppConstants.DECIMAL_FORMATTER);
            this.buy_volume = wijmo.Globalize.format(Number(AppUtility.isValidVariable(bestMarket.buy.volume) ? bestMarket.buy.volume : 0.0), AppConstants.NUMERIC_FORMATTER);
        }
    }
}
