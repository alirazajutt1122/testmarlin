import { Participant } from '../models/participant';
import { User } from '../models/user';

export class AMLDATA {
    Id: number;
    participant: Participant;
    user: User;
    sroDocNo: string = "";
    sroFileName: string = "";
    name: string = "";
    fatherName: string = "";
    cnic: string = "";
    passportId: string = "";
    country: string = "";
    district: string = "";
    province: string = "";
    address: string = "";
    loadDate: Date;
    blockDate: Date;
    status: number;
    loadType: string = "";
    dataOrigin: string="";



    constructor() {

        this.loadDate = new Date();
    }
};