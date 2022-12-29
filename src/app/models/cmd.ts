import { cmdHolding } from './cmd-holding';

export class ClientMarginDetails {
    allowShortSell: boolean = false;
    cash: string = '';
    code: string = '';
    margin: string = '';
    riskAssessment: boolean = false;
    useOpenPosition: boolean = false;
    cmdHoldingList: cmdHolding[];
}
