import { Client } from './client';
import { Participant } from './participant';

export class ClientCustodian {
    clientCustodianId: Number;
    custodian: Participant;
    client: Client;
    active:Boolean=false;
    constructor() {
        this.custodian = new Participant();
        this.client= new Client();
         this.active = false;
    }
}