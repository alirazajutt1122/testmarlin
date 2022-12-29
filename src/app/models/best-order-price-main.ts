import { BestOrderPriceSub } from './best-order-price-sub';

export class BestOrderPriceMain {
    exchange: string = '';
    market: string = '';
    symbol: string = '';
    buy_prices: BestOrderPriceSub[] = [];
    sell_prices: BestOrderPriceSub[] = [];
}
