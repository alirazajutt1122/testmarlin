import { Exchange } from './exchange';
import { User } from "./user";
import { ContactDetail } from './contact-detail';
import { ParticipantType} from './participant-type';
import { DepoUser } from './depo-user';

export class Participant {



    participantId: Number
    active: Boolean
    participantCode: String ='';
    cdcCode: String ='';
    participantName: String ='';
    accountType:String='';
    cmId: Number
    displayName_:String='';
    selected:boolean;

    exchange: Exchange;
    user: User;
    dashboard: String='';
    contactDetail: ContactDetail;
    participantType: ParticipantType;

    depoUser : DepoUser;
}
