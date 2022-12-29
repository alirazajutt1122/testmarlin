
import { Registrar } from './registrar';
import { Sector } from './sector';
import { Currency } from './currency';
import { SecurityType } from './security-type';

export class Symbol {
    securityId: Number;
	active: Boolean;
	isin: String;
	securityCode:string='';
	securityName: String="";
	symbol: String="";
	registrar:Registrar
	sector:Sector=new Sector();
	//securityGroupId:Number
	securityType:SecurityType;
	currency: Currency = new Currency() ;


    constructor (symbolId:number = 0, symbolCode:string='') {
        this.securityId = symbolId;
        this.securityCode = symbolCode;
        this.symbol = symbolCode;
        this.securityName = symbolCode
    }


}
