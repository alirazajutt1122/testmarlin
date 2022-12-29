import { Client } from '../models/client';
import { User } from '../models/user';

export class SRO {
    sroId: number;
    docRefNo: string = "";
    status: number;
    client: Client;
    reason: string = "";
    user: User;
    docDate: Date;
    crDate: Date;
    modDate: Date; 
    statusDesc: string = "";

    constructor() {
        this.docDate = new Date();
        this.crDate = new Date();
        this.modDate = new Date();
    }
};