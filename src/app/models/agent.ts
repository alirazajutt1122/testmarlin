import { ContactDetail } from './contact-detail';
import { Participant } from './participant';

export class Agent
{
    agentId: Number;
    agentCode: String;
    commissionRate: Number;
    commissionType: String;
    commissionTypeDisplay_: String;
    branchId: Number;
    active: boolean;
    agentType: String;
    contactDetail: ContactDetail;
    participant: Participant;
    displayName_:String;
}