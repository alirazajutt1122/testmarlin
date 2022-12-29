import { ContactDetail } from './contact-detail';
import { Bank } from './bank';

export class BankBranch
{
    bankBranchId: Number;
    bankBranchCode: String;
    branchName: String;
    active: boolean;
    bank: Bank;
    contactDetail: ContactDetail;

    constructor(){
        this.bank = new Bank();
    }
}