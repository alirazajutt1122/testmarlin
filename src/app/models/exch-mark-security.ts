import {BondPaymentSchedual} from './bond-payment-schedual';

export class ExchangeMarketSecurity {
   exchangeMarketSecurityId: number;
   boardLot: number=0;
   lowerCircuitBreakerLimit: number=0;
   lowerCircuitPercent: number=0;
   lowerOrderValueLimit: number=0;
   lowerOrderVolumeLimit: number=0;
   lowerValueAlertLimit: number=0;
   lowerVolumeAlertLimit: number=0;
   marketConfigOverride: number=0;
   state: number=0;
   stateStr:string="";
   tickSize: number=0;
   upperCircuitBreakerLimit: number=0;
   upperCircuitPercent: number=0;
   upperOrderValueLimit: number=0;
   upperOrderVolumeLimit: number=0;
   upperValueAlertLimit: number=0;
   upperVolumeAlertLimit: number=0;
   exchangeId: number;
   exchangeCode: string="";
   marketId: number;
   marketCode: string="";
   exchangeMarketId: number;
   securityId: number;
   securityCode: string="";
   securityName: string="";
   settlementTypeId: number;
   settlementType: string="";
   displayName_: string="";
   bondPaymentSchedual:BondPaymentSchedual[];
}