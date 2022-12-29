import { ContactDetail } from "./contact-detail";
import { Country } from "./country";

export class SecurityExchange
{
    exchangeId: Number;
    exchangeCode: String;
    exchangeName: String;
    country: Country;
    contactDetail: ContactDetail;

    constructor(id: number = 0, code: string = '', name: string = '',cd: number = 1 , country: number=1)
    {
        this.exchangeId = id;
        this.exchangeCode = code;
        this.exchangeName = name;
        this.contactDetail = new ContactDetail(); 
        this.country = new Country(); 
    }
}