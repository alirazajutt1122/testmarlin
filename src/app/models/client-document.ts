import {DocumentType} from './document-type';
import { IdentificationType } from './identification-type';
export class ClientDocument {

    identificationType: IdentificationType;
     
    issueDate : Date;
    expiryDate : Date = new Date();
    issuePlace : String = "";

    clientDocumentId:Number;
	clientId:Number;
	contentType:String;
	documentName:String;
	documentType:DocumentType;
    documentBase64_:String;
    constructor(){
        this.documentType = new DocumentType();
    }
}
