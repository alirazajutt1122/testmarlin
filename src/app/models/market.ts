import { MarketType } from './market-type';

export class Market {

    marketId: Number;
    active: Boolean;
    base: Boolean;
    baseMarketId: Number;
    marketCode: String = "";
    marketDesc: String = "";
    marketType:MarketType ;
    selected:boolean;
    constructor (marketId:number=0, marketCode:string='') {
        this.marketId = marketId;
        this.marketCode = marketCode;
    }
}
