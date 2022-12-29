import { Participant } from './participant';

export class ParticipantBranch {
    branchId: Number;
    branchCode: String;
    branchDesc: String;
    active: boolean;
    participant: Participant;
    displayName_:String;
}