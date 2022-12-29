import { Exchange } from './exchange';
import { Participant } from './participant';

export class ParticipantExchange {
    participantExchangeId:Number;
    exchange:Exchange;
    participant:Participant;
    participantList:any[];
    constructor(){
        this.exchange = new Exchange();
        this.participant = new Participant();
        this.participantList=[];
    }
}