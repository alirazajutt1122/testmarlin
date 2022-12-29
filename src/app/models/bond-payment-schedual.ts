import { ExchangeMarketSecurity } from './exch-mark-security';
export class BondPaymentSchedual{
    scheduleId:number;
	markup:number;
	markupRate:number;
	noOfDays:number;
	paymentDate:Date=null;
	principalPayment:number;
    exchangeMarketSecurity:ExchangeMarketSecurity;
    noOfCoupons:number;
	total:number;
}