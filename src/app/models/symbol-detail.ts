import {Symbol} from "./symbol";

export class SymbolDetail extends Symbol {

    lowerCircuitBreakerLimit:Number;
    upperCircuitBreakerLimit:Number;
    lowerOrderVolumeLimit:Number;
    upperOrderVolumeLimit:Number;
    lowerOrderValueLimit:Number;
    upperOrderValueLimit:Number;
    boardLot:Number;
    tickSize:Number;

    state:string='';
    announcement:any='';
    code:String='';
    currencyCode:string='';
    sectorCode:string;

    constructor() {
        super();
        this.lowerCircuitBreakerLimit=0;
        this.upperCircuitBreakerLimit=0;
        this.lowerOrderVolumeLimit=0;
        this.upperOrderVolumeLimit=0;
        this.lowerOrderValueLimit=0;
        this.upperOrderValueLimit=0;
        this.boardLot=0;
        this.tickSize=0;

        this.state='';
        this.announcement='';
        this.code='';
        this.currencyCode='';
        this.sectorCode='';
    }
    setDetails(symbolDetail) {
        //console.log(" symbol details:: "+ JSON.stringify(symbolDetail));
        this.code = symbolDetail.code;
        this.lowerCircuitBreakerLimit = Number(symbolDetail.lower_circuit_breaker_limit);
        this.upperCircuitBreakerLimit = Number(symbolDetail.upper_circuit_breaker_limit);

        this.lowerOrderVolumeLimit = symbolDetail.lower_volume_limit;
        this.upperOrderVolumeLimit = symbolDetail.upper_volume_limit;

        this.lowerOrderValueLimit = Number(symbolDetail.lower_value_limit);
        this.upperOrderValueLimit = Number(symbolDetail.upper_value_limit);

        this.boardLot = symbolDetail.board_lot;
        //console.log(" tick size 1: " + symbolDetail.tick_size);
        this.tickSize = Number(symbolDetail.tick_size);
        // console.log(" tick size 2: " +  this.tickSize);
        this.state = (symbolDetail.active==true)?symbolDetail.state='Active':symbolDetail.state='Suspended';
        this.currencyCode = symbolDetail.currency;
        this.sectorCode = symbolDetail.sector;
        this.announcement = symbolDetail.announcement;
    }

}
