
import { ContactDetail } from './contact-detail';
import { Country } from './country';

export class Exchange {

    exchangeId: Number;
    exchangeCode: String = '';
    exchangeName: String = '';
    contactDetail: ContactDetail;
    bondPricingMechanism: Number = 0;
    bondPricingModel: Number = 0;

    constructor(id: number = 0, code: string = '', name: string = '', bondPricingMechanism: number = 0, bondPricingModel: number = 0) {
        this.exchangeId = id;
        this.exchangeCode = code;
        this.exchangeName = name;
        this.bondPricingMechanism = bondPricingMechanism;
        this.bondPricingModel = bondPricingModel;
    }
}
