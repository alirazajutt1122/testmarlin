
import { SecurityType } from './security-type';
import { SecurityFisDetail } from './security-fis-detail';
import { Country } from './country';
import { BondCategory } from './bond-category';
import { BondType } from './bond-type';
import { CouponFrequency } from './coupon-frequency';
import * as wijmo from '@grapecity/wijmo';
import { AppUtility } from '../app.utility';
import { AppConstants } from '../app.utility';
import { BondSubCategory } from './bond-sub-category';
import { BondPaymentSchedual } from './bond-payment-schedual';
// this class is used to handle response of security by exchange and market  and used in front end only
// to hanlde the response of the web service

export class SecurityMarketDetails {

  exchangeCode: string = '';
  securityCode: string = '';

  exchangeId: number = 0;
  marketId: number = 0;
  securityId: number = 0;

  issueDate: string = '';
  maturityDate: string = '';
  lastCouponDate: string = '';
  nextCouponDate: string = '';
  tenure: string = '';
  accrudeProfit: number = 0;
  couponRate: number = 0;
  parValue: number = 0;
  etfTypeId: number = 0 ; 

  fisDetail: SecurityFisDetail;
  bondCategory: BondCategory;
  bondSubCategory: BondSubCategory;
  bondType: BondType;
  countryBo: Country;
  couponFrequency: CouponFrequency;
  bondPaymentSchedual: BondPaymentSchedual;

  securityFaceValue: number = 0;

  daysToMaturity: number = 0;
  daysInPeriod: number = 0;

  settlementDate: string = '';
  capitalTax: number = 10

  lastCouponDate_dt: Date;
  nextCouponDate_dt: Date;
  settlementDate_dt: Date;
  currency: string = ""
  marketTypeCode: string = ""
  upperCircuitBreakerLimit: number = 0
  lowerCircuitBreakerLimit: number = 0


  constructor() {

    this.fisDetail = new SecurityFisDetail();
    this.bondCategory = new BondCategory();
    this.bondSubCategory = new BondSubCategory();
    this.bondType = new BondType();
    this.countryBo = new Country();
    this.countryBo.currencyCode = '';
    this.couponFrequency = new CouponFrequency();
    this.bondPaymentSchedual = new BondPaymentSchedual();
  }




  clearData() {
    this.issueDate = '';
    this.maturityDate = '';
    this.lastCouponDate = '';
    this.nextCouponDate = '';
    this.bondType = new BondType();
    this.settlementDate = '';

    this.lastCouponDate_dt = null
    this.nextCouponDate_dt = null
    this.settlementDate_dt = null

    this.accrudeProfit = 0;
  }


  updateSecurityMarketData(data) {
    this.exchangeCode = data.exchangeCode;
    this.marketTypeCode = data.marketTypeCode
    this.securityCode = data.securityCode;
    this.fisDetail = data.fisDetail;
    this.bondCategory = data.fisDetail.bondCategory;
    this.bondSubCategory = data.fisDetail.bondSubCategory;
    this.parValue = data.fisDetail.parValue;
    this.bondType = data.bondType;
    this.countryBo = data.countryBo;
    this.couponFrequency = data.fisDetail.couponFrequency;
    this.bondPaymentSchedual = data.bondPaymentSchedual;
    this.tenure = data.tenure;
    //this.accrudeProfit = data.accrudeProfit;
    this.couponRate = data.fisDetail.couponRate;
    this.currency = data.fisDetail.currency;

    this.upperCircuitBreakerLimit = data.upperCircuitBreakerLimit
    this.lowerCircuitBreakerLimit = data.lowerCircuitBreakerLimit

    this.daysToMaturity = data.daysToMaturity;
    this.daysInPeriod = data.daysInPeriod;

    this.securityFaceValue = data.securityFaceValue;
    this.issueDate = wijmo.Globalize.format(new Date(data.fisDetail.issueDate), AppConstants.DATE_FORMAT);
    this.maturityDate = wijmo.Globalize.format(new Date(data.fisDetail.maturityDate), AppConstants.DATE_FORMAT);
    this.lastCouponDate = wijmo.Globalize.format(new Date(data.lastCouponDate), AppConstants.DATE_FORMAT);
    this.nextCouponDate = wijmo.Globalize.format(new Date(data.nextCouponDate), AppConstants.DATE_FORMAT);
    this.settlementDate = wijmo.Globalize.format(new Date(data.settlementDate), AppConstants.DATE_FORMAT);


    this.lastCouponDate_dt = new Date(this.lastCouponDate)
    this.nextCouponDate_dt = new Date(this.nextCouponDate)
    this.settlementDate_dt = new Date(this.settlementDate)
  }










  calculatePriceYield(value): number {
    let retVal: number = 0;
    if (AppUtility.isValidVariable(value) && !AppUtility.isEmpty(value)) {
      retVal = (value == 0) ? 0 : (((this.securityFaceValue / 100) * this.fisDetail.couponRate) / value);
    }
    return retVal;
  }









  calculateAccrudeProfitPrecentage(settlementDate, previousCouponDate, nextCouponDate, CouponRate, CouponFrequency, volume) {

     
    let accruedProfit: any = null;
    let accrude_days = this.getDaysBetweenDates(settlementDate, previousCouponDate)
    let coupon_period = this.getDaysBetweenDates(nextCouponDate, previousCouponDate)
    let accruedDaysRatio = accrude_days / coupon_period;
    let tenurecoupanRate = 0;
    if (CouponFrequency == 'A') {
      tenurecoupanRate = CouponRate / 1;
    }
    else if (CouponFrequency == 'B') {
      tenurecoupanRate = CouponRate / 2;
    }
    else if (CouponFrequency == 'Q') {
      tenurecoupanRate = CouponRate / 4;
    }
    else if (CouponFrequency == 'M') {
      tenurecoupanRate = CouponRate / 12;
    }

    tenurecoupanRate = tenurecoupanRate / 100;
    let tenureAccruedRatio = Number(tenurecoupanRate * accruedDaysRatio).toFixed(9);
    accruedProfit = Number(this.parValue) * volume * Number(tenureAccruedRatio);
    return accruedProfit;

  }






  calculateNominalValue(Volume, ParValue) {
    let NominalValue = Volume * ParValue
    return NominalValue;
  }


  getDaysBetweenDates(date1, date2) {

    let ond_day = 1000 * 60 * 60 * 24;
    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();
    let diff_ms = Math.abs(date1_ms - date2_ms);
    let dayDifference = diff_ms / ond_day;
    return Math.trunc(dayDifference * Math.pow(10, 0)) / Math.pow(10, 0);
  }



  toTrunc(value, n) {
    let x = (value.toString() + ".0").split(".");
    return parseFloat(x[0] + "." + x[1].substr(0, n));
  }

  calculateAccruedProfit(quantity) {

     
    let accruedProfit = 0;
    let freqNumber = 1;
    this.accrudeProfit = 0;

    if (quantity === undefined || quantity == null || quantity == 0) {
      quantity = 1;
    }

    if (AppUtility.getDaysBetweenDates(
      new Date(this.settlementDate),
      new Date(this.nextCouponDate)) == 0) {

      accruedProfit = 0;
    } else {

      let accruedDaysDifference = AppUtility.getDaysBetweenDates(
        new Date(new Date(this.lastCouponDate).toDateString()),
        new Date(this.settlementDate)
      );

      let coupansDaysDifference = AppUtility.getDaysBetweenDates(
        new Date(new Date(this.lastCouponDate).toDateString()),
        new Date(this.nextCouponDate)
      );

      let accruedDaysRatio = accruedDaysDifference / coupansDaysDifference;

      let tenurecoupanRate = 0;

      if (this.couponFrequency.frequencyCode == "A") {
        tenurecoupanRate = this.couponRate / 1;
      } else if (this.couponFrequency.frequencyCode == "B") {
        tenurecoupanRate = this.couponRate / 2;
      } else if (this.couponFrequency.frequencyCode == "Q") {
        tenurecoupanRate = this.couponRate / 4;
      } else if (this.couponFrequency.frequencyCode == "M") {
        tenurecoupanRate = this.couponRate / 12;
      }

      tenurecoupanRate = tenurecoupanRate / 100;

      let tenureAccruedRatio = Number(tenurecoupanRate * accruedDaysRatio).toFixed(9);

      accruedProfit =
        Number(this.parValue) *
        quantity * Number(tenureAccruedRatio);
    }

    this.accrudeProfit = accruedProfit;
    return this.accrudeProfit;
    //this.updateSettlementAmount();
  }


  calculatePriceToYield(currentPrice: number, currentVolume: number, currentYield: number, isBondPricingMechanismPercentage: boolean): number {
    ////Added by MSL to define new formulae for conversion of price to yield////
    
    let yield_ = 0;
    let nominalValue: number = 0;

    if (currentPrice == 0) {
      return 0;
    }

    let absoluteMarketPrice = (Number(this.parValue) * currentPrice) / 100;
    let annualCouponAmount = (Number(this.parValue) * this.couponRate) / 100;

    // let dayCountConvention = AppUtility.getDaysBetweenDates(this.lastCouponDate, this.nextCouponDate);
    // let daysToMaturity = AppUtility.getDaysBetweenDates(new Date(), this.lastCouponDate);


    yield_ = (annualCouponAmount / absoluteMarketPrice) * 100;

    console.log ("Yield: " + yield_) ; 
    if (this.fisDetail.bondType.bondType.toUpperCase() == "ZEROCOUPON" &&
      this.etfTypeId == 0) {
        yield_ = currentPrice ;

    } else if ((this.fisDetail.bondType.bondType.toUpperCase() == "ZEROCOUPON" &&
      this.etfTypeId == 2) ||
      (this.fisDetail.bondType.bondType.toUpperCase() == "ZEROCOUPON" &&
        this.etfTypeId == 2)) {
          yield_ = 0 ; 
    }

    return yield_;
  }


  calculateYieldToPrice(currentVolume: number, currentYield: number, isBondPricingMechanismPercentage: boolean): number {

 
    let price: number = 0;
    let val: number = 0;
    let settlementAmount: number = 0;
    let cleanSettlementAmount: number = 0;
    let settlementAmountFromAccruedInterest: number = 0;
    let accrudeProfitPercent: any = 0
    let nominalValue: number = 0;


    let annualCouponAmt = this.parValue * (this.couponRate / 100);
    let absMarketPrice = (annualCouponAmt / currentYield) * 100;

    this.daysToMaturity = this.getDaysBetweenDates(new Date(), new Date(this.maturityDate));
    this.daysInPeriod = this.getDaysBetweenDates(new Date(this.lastCouponDate), new Date(this.nextCouponDate));

    nominalValue = this.calculateNominalValue(currentVolume, this.parValue);

    if (this.settlementDate == this.maturityDate && currentYield == this.fisDetail.couponRate) {
      price = 100;
      cleanSettlementAmount = (price / 100) * nominalValue;
      settlementAmountFromAccruedInterest = cleanSettlementAmount + this.accrudeProfit;
    }

    else if (this.fisDetail.bondType.bondType == "Zero Coupon") {
 
      if (isBondPricingMechanismPercentage) {
        price = (this.parValue * currentYield * this.daysToMaturity) / (this.daysInPeriod * 100);
        price = ((this.parValue - price) / this.parValue) * 100;

        cleanSettlementAmount = (price / 100) * nominalValue;
        settlementAmountFromAccruedInterest = cleanSettlementAmount + this.accrudeProfit;
      }
      else {
        price = (this.parValue * currentYield * this.daysToMaturity) / (this.daysInPeriod * 100);
        price = this.parValue - price;

      }
    }

    else {

      if (isBondPricingMechanismPercentage) {
        price = (absMarketPrice / this.parValue) * 100;
      }
      else {
        price = absMarketPrice;
      }

    }
    //////

    return Number(price.toFixed(2));
  }






  public roundToDecimalPlaces(decimalPlaces: number, num: number): number {

    if (num > 0) {
      var temp: number = num;
      for (var i: number = 5; i >= decimalPlaces; i--) {
        temp = Number(num.toFixed(i));
        num = temp;
      }
    }

    return num;
  }

  public setAccruedProfit(profit) {
    this.accrudeProfit = profit;
  }

}
