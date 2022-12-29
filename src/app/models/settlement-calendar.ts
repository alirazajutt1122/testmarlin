import { SettlementType } from './settlement-type';
import {Exchange} from './Exchange';

export class SettlementCalendar {
    settlementCalendarId: Number;
    active: Boolean;
    processed:Boolean;
    endDate: Date = new Date();
    exchange: Exchange;
    settlementDate: Date= new Date();
    startDate: Date= new Date();
    settlementType: SettlementType;
    settlementTypeList: SettlementType[];
    lastEntry: Boolean;
}