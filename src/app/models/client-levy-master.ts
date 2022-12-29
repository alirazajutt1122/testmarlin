import { Participant } from './participant';
import { ChartOfAccount } from './chart-of-account';
import { Exchange } from './exchange';
import { VoucherType } from './voucher-type';

export class ClientLevieMaster {
    leviesMasterId: Number;
    levyCode: String= '';
    levyDesc: String= '';
    leviesDescription: String='';
    vouNaration: String = '';
    levyType: String = '';
    levyTypeDispaly_: String='';
    participant: Participant;
    chartOfAccount: ChartOfAccount;
    exchange: Exchange;
    voucherType: VoucherType;

}