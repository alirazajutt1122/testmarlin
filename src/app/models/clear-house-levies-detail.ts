import { SettlementType } from './settlement-type';
import { ClearingHouseLeviesMaster } from './clear-house-levies-master';


export class ClearingHouseLeviesDetail {
    effectiveDate: Date;
    levyRate: Number;
    tradingSide: String;
    tradingSideDisplay_: String;
    minAmount: Number;
    maxAmount: Number;
    leviesDetailId: Number;
    active: Boolean;
    settlementType: SettlementType;
    chLeviesMaster: ClearingHouseLeviesMaster;
}