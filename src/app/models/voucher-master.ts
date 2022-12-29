import { Participant } from './participant';
import { VoucherType } from './voucher-type';
import { SettlementCalendar } from './settlement-calendar';

export class VoucherMaster {
	voucherMasterId: Number;
	vouNo: Number;
	vouDate: Date;
	vouNaration: String;	
	paymentType:Number;
	manual: Boolean;
	posted: Boolean;
	chequeCleared: Boolean;
	reversed: Boolean;

	participant: Participant;	
	voucherType: VoucherType;	 
	settlementCalendar:SettlementCalendar;  
}