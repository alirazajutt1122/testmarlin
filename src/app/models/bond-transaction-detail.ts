import { Exchange } from './exchange';
import { Market } from './market';
import { Symbol } from './symbol';
import { SettlementCalendar } from './settlement-calendar';

import { Client } from './client';
import { SecurityFisDetail } from './security-fis-detail';

export class BondTransactionDetail {
  transactionId: Number;
  tradeNumber: number = 0;
  transDate: Date;
  settleDate: Date;
  settlementDate: Date;
  transactionType: String;
  buySell: String;
  participantId: Number;
  participantCode: String;
  clientId: Number;
  clientCode: String;
  custodianId: Number;
  faceValue: number;
  principalAmount: number;
  interestPercentage: number;
  discountedRatePercentage: number;
  discountedPrice: number;
  pricePercentage: number;
  yieldPercentage: number;
  quantity:number=0;
  principal: number = 0;
  accuredInterest: number = 0;
  settlementAmount: number = 0;
  maturityAmount: number = 0;
  csdChargePercentage: number = 0;
  tradeChargePercentage: number = 0;
  overnightChargePercentage: number = 0;
  bankChargePercentage: number = 0;
  counterpartyComissionChargePercentage: number = 0;
  sicbrokerageChargePercentage: number = 0;
  entryDatetime: Date;
  posted: Boolean;
  processed: Boolean;
  remarks: String;
  terminalId: String;

  exchangeId: number;
  exchangeCode: String;
  exchangeName: String;
  marketId: number;
  marketCode: String;
  bondSubCategoryId: number;
  securityId: number;
  securityName: String;
  symbol: String;
  settlementTypeId: Number;
  settlementType: String;


  marketTypeId: Number;
  couponRate: number = 0;
  issueDate: Date;
  maturityDate: Date;
  couponFrequencyId: string = '';
  couponTypeId: number = null;
  securityFisDetail : SecurityFisDetail = new SecurityFisDetail();

  submitted: Boolean =false;
}
