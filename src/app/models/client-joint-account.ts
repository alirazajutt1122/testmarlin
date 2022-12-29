import { ContactDetail } from './contact-detail';
export class ClientJointAccount{
    clientJointAccountId:Number;
    clientId:Number;
    contactDetail:ContactDetail;

    constructor(){
		this.contactDetail = new ContactDetail();
	}
}