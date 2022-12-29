import { Market } from './market';
import { Exchange } from './exchange'
import { Participant } from './participant'
import { Security } from './security'

export class Alert {
    exchange: String;         //  exchange code.
    market: String;             //  market code.
    symbol: String;           //  security code.
    symbolMarkerExchange: String;
    symbolMarketExchange: String;
    user: String;          //  user id.
    expression: String;
    postfix_expression: String;
    message: String;
    name: String;
    id: Number;                 //  alert id
    persistance: Boolean;
}