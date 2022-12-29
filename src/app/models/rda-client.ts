import { ChartOfAccount } from './chart-of-account';
import { Agent } from './agent';
import { Participant } from './participant';
import { CommissionSlabMaster } from './commission-slab-master';
import { ParticipantBranch } from './participant-branches';
import { User } from './user';
import { ClientBankAccount } from './client-bank-account';
import { ClientAppliedLevy } from './client-applied-levy';
import { ClientExchange } from './client-exchange';
import { ClientMarket } from './client-market';
import { IncomeSource } from './income-source';




export class RdaClient {
   
rdaClientsId:Number;
bankId:String;
bankShortCode:String;
brokerShortCode:String;
fullName:String;
fatherSpouseName:String;
motherMaidenName:String;
dateofBirth:String;
placeofBirth:String;
cnicNicopPoc:String;
uinType:String;
cnicNicopPocDateofIssuance:String;
opfmembershipnumber:String;
passportNumber:String;
nationalities:String;
emailAddress:String;
landlineNumber:String;
cellNumber:String;

completeMailingAddress:String;
fatcaCRSDeclaration:String;
profession:String;
sourceofIncome:String;
existingBankAccountDetailsofcustomer:String;
ibanofNRANCAAccount:String;
uploadedFileNames:String;
numberofDocuments:Number;
termsandconditionagreed:String;
selectedBroker:String;
securitymarket:String;
reserved:String;
clientCode:String;
clientId:Number;
/////////////////////////////////////////////////
accountType:String;
chartOfAccount:ChartOfAccount;
margin:Number;
reference:String;
agent: Agent;   
commissionSlabMaster: CommissionSlabMaster;
participant:Participant;
participantBranch: ParticipantBranch;
clientType: String;
displayName_:String;
user:User;
bankAccount:ClientBankAccount[];
appliedLevy:ClientAppliedLevy[];
clientExchange: ClientExchange[];
clientMarkets: ClientMarket[];
displayValue_:String;

sendSms: Boolean=false;
sendMail: Boolean=false;
generateKits: Boolean=false;
proprietaryAccount: Boolean=false;
risk:String;

}
