
import {Client} from './client';
import {Relation} from './relation';
import { IdentificationType } from './identification-type';

export class Beneficiary {
    client: Client;
    taxNumber : String;
    identificationType : IdentificationType= new IdentificationType();
    beneficiaryId: Number;
    beneficiaryName: String = "";
    relation : Relation = new Relation();
    beneficiaryCNIC: String = "" ;
}
