import { ChartOfAccount } from './chart-of-account';
import { VoucherType } from './voucher-type';

export class ParticipantSettlementParams {
    participantParamId: number;
    voucherType: VoucherType;
    glAccount: ChartOfAccount;
    voucherDescription: String;
}