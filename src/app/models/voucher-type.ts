import { Participant } from './participant';

export class VoucherType {
    voucherTypeId: Number;
	voucherType: String= '';
	typeDesc: String= '';    
	participant: Participant;
	displayName_:String="";
}