import { Exchange } from "./exchange";


export class AuditLog {
    logDateTime: Date; 
    logDateStr: String; 
    logTimeStr: String;
    loginId: String;
    eventType: String;
    result: String;
    originationInfo :String ; 
}