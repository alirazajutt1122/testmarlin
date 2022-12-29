import { Market } from './market';
import { Client } from './client';

export class ClientMarket {
    clientMarketId:Number;
    clientId: Number;
    exchangeMarketId:Number;
    marketId:Number;
	marketCode:String="";
    exchangeId:Number;
    exchangeName:String="";
    active:Boolean=false;
     constructor(){
        this.active = false;
    }
}