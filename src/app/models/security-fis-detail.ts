import {BondType} from './bond-type';
import {BondCategory} from './bond-category';
import {CouponFrequency} from './coupon-frequency';
import { BondSubCategory } from './bond-sub-category';
import { MmAuction } from './mm-Auctions';
import { Currency } from './currency';
export class SecurityFisDetail {


    indexedCurrency : Currency;
    indexedBond : boolean = false;


    securityId:number;
    aIrr:number=0;
    baseRate:number=0;
    couponRate:number=0;
    discountRate:number=0;
    irr:number=0;
    issueDate:Date= null;
    maturityDate:Date= null;
    maturityDays:number=0;
    nextCouponDate:Date= null;
    parValue:number=0;
    spreadRate:number=0;
    yearDays:number=0;
    bondType:BondType;
    bondCategory:BondCategory;
    couponFrequency:CouponFrequency;
    dayCountConvention:string=null;    
    bondSubCategory: BondSubCategory;    
    mmAuction: MmAuction;
    
    confirmRate: number = 0;
    maturityAlertDays: number = 0;
    firstTradingDate: Date = null;
    lastTradingDate: Date = null;
    currency: Currency;
    reInvested: string = null;

    constructor() {
        this.couponFrequency = new CouponFrequency();
        this.bondCategory = new BondCategory();
        this.bondSubCategory = new BondSubCategory();
        this.bondType = new BondType();
        this.mmAuction = new MmAuction();
        this.indexedCurrency = new Currency;
        this.currency = new Currency();
    }

     public clear(){
        this.securityId=null;
        this.aIrr=0;
        this.baseRate=0;
        this.couponRate=0;
        this.discountRate=0;
        this.irr=0;
        this.issueDate=new Date();
        this.maturityDate=new Date();
        this.maturityDays=0;
        this.nextCouponDate=new Date();
        this.parValue=0;
        this.spreadRate=0;
        this.yearDays=0;

        this.bondType = new BondType();
        this.bondType.clear();

        this.bondCategory = new BondCategory();
        this.bondCategory.clear();

        this.couponFrequency = new CouponFrequency();
        this.couponFrequency.clear();

        this.dayCountConvention="";
     }
    
}