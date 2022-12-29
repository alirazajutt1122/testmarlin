import { CommissionSlabMaster } from './commission-slab-master';
import { TraansactionTypesExchange } from './traansaction-type-exchange';

export class CommissionSlabDetail
{
    commissionSlabDetailID: Number;    
    lowerRange: Number;
    upperRange: Number;
    deliveryComm: Number;
    deliveryFP: String;
    deliveryFPDisplay_: String;
    differenceComm: Number;
    differenceFP: String;
    differenceFPDisplay_: String;

    commissionMode: String= '';
    commissionModeDisplay_: String = '';
    applyDelCommission: Number;
    
    traansactionTypesExchange: TraansactionTypesExchange;
    commissionSlabMaster: CommissionSlabMaster;
}
