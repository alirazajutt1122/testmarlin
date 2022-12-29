import { VoucherMaster } from './voucher-master';
import { ChartOfAccount } from './chart-of-account';


export class voucherDetail {
	voucherDetailId: Number;
	debitCredit: Number;	
	debit: Number;	
	credit: Number;	
	transactionType:String;
	instrumentNo: String;
	naration: String;
	serielNo: number;	

	voucherMaster: VoucherMaster;
	chartOfAccount: ChartOfAccount;		   
}