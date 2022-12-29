import { Exchange } from './exchange';

export class ClearingHouseLeviesMaster {
    leviesMasterId: Number;
    percentage: Boolean;
    levyDesc: String = '';
    levyCode: String = '';
    levyType: String = '';
    levyTypeDisplay: String = '';
    exchange: Exchange;
}