import { Exchange } from './exchange';
import { Market } from './market';

export class ExchangeMarket {
    exchangeMarketId: Number
    active: Boolean
    allowShortSell: Boolean
    boardLot: Number
    exchangeConfigOverride: Number
    lowerCircuitBreakerLimit: Number
    lowerCircuitPercent: Number
    lowerOrderValueLimit: Number
    lowerOrderVolumeLimit: Number
    lowerValueAlertLimit: Number
    lowerVolumeAlertLimit: Number
    mboDepth: Number
    mbpDepth: Number
    upperCircuitBreakerLimit: Number
    upperCircuitPercent: Number
    upperOrderValueLimit: Number
    upperOrderVolumeLimit: Number
    upperValueAlertLimit: Number
    upperVolumeAlertLimit: Number
    exchange: Exchange;
    market: Market;
    marketList:any[];
    constructor(){
        this.exchange = new Exchange();
        this.market = new Market();
        this.marketList=[];
    }
}
/*export const ExchangeMarketList: ExchangeMarket[] = [
    {
        exchangeMarketId: null,
        active: null,
        allowShortSell: null,
        boardLot: null,
        exchangeConfigOverride: null,
        lowerCircuitBreakerLimit: null,
        lowerCircuitPercent: null,
        lowerOrderValueLimit: null,
        lowerOrderVolumeLimit: null,
        lowerValueAlertLimit: null,
        lowerVolumeAlertLimit: null,
        mboDepth: null,
        mbpDepth: null,
        upperCircuitBreakerLimit: null,
        upperCircuitPercent: null,
        upperOrderValueLimit: null,
        upperOrderVolumeLimit: null,
        upperValueAlertLimit: null,
        upperVolumeAlertLimit: null,
        exchange: null,
        market: null
        
    }
];*/