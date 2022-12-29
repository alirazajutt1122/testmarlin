import { BankBranch } from './bank-branches';
export class ClientBankAccount{
    clientBankId:Number;
	active:Boolean;
	bankAccountNo:String="";
	bankBranch:BankBranch;
	clientId:Number;
	bankTitle:String="";

	constructor(){
		this.bankBranch = new BankBranch();
	}
}