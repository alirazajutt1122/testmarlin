import { Exchange } from './exchange';
import { Market } from './market';
import { OrderQualifiers } from './order-qualifiers';
import { OrderTypes } from './order-types';
import { TifOptions } from './tif-options';

export class EMAssociation {
    exchangeMarketId: Number
    active: Boolean   
    exchange: Exchange;
    market: Market;

    orderQualifiers:OrderQualifiers[];
    orderTypes:OrderTypes[];
    orderTifOptions:TifOptions[];

    orderTypes_:String;
    orderQualifiers_:String;
    tifOptions_:String;
}