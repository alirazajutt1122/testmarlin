import { BestOrderSub } from './best-order-sub';

export class BestOrderMain {
    exchange: string = '';
    market: string = '';
    symbol: string = '';
    buy_orders: BestOrderSub[] = [];
    sell_orders: BestOrderSub[] = [];
}
