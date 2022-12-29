import { ChartOfAccount } from './chart-of-account';
import { Agent } from './agent';
import { Participant } from './participant';
import { ContactDetail } from './contact-detail';
import { CommissionSlabMaster } from './commission-slab-master';
import { ParticipantBranch } from './participant-branches';
import { User } from './user';
import { ClientBankAccount } from './client-bank-account';
import { ClientAppliedLevy } from './client-applied-levy';
import { ClientJointAccount } from './client-joint-account';
import { ClientExchange } from './client-exchange';
import { ClientDocument } from './client-document';
import { ClientMarket } from './client-market';
import { ClientCustodian } from './client-custodian';
import { IncomeSource } from './income-source';

import { Beneficiary } from './beneficiary';
import { AccountCategory } from './account-category';
import { AccountType } from './account-type';

export class Client {

////For Investor Registration Form

   todayDate: Date = new Date();
   accountTypeNew : AccountType = new AccountType();
   statusCode : string = "";

    clientId: Number;
    clientCode: String = "";
    accountType: String = "";
    active: Boolean;
    allowShortSell: Boolean;
    bypassCrs: Boolean;
    depositoryAccountNo: String = "";
    sendEmail: Boolean;
    sendMail: Boolean;
    proprietaryAccount: Boolean;
    sendSms: Boolean;
    generateKits: Boolean;
    margin: Number;
    onlineClient: Boolean;
    openPositionStatus: Boolean;
    reference: String = "";
    clientType: String = "";
    displayName_: String = "";
    displayValue_: String = "";
    risk:String;
    chartOfAccount: ChartOfAccount;
    agent: Agent;
    participant: Participant;
    contactDetail: ContactDetail;
    commissionSlabMaster: CommissionSlabMaster;
    participantBranch: ParticipantBranch;
    glCodeLength_: number = 0;
    user: User;
    bankAccount: ClientBankAccount[];
    appliedLevy: ClientAppliedLevy[];
    jointAccount: ClientJointAccount[];
    clientExchange: ClientExchange[];
    clientDocuments: ClientDocument[];
    clientMarkets: ClientMarket[];
    clientCustodiands: ClientCustodian[];

    annualGrossIncome: number=0;
    incomePercentage: number=0;
    incomeSource: IncomeSource;

    beneficiary: Beneficiary[] ;

    accountCategory : AccountCategory;


    constructor(clientcode : any = -1 , displayvalue_ : any = "") {

         this.clientCode = clientcode;
         this.displayValue_ = displayvalue_;

    }


}
