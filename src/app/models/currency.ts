import { Symbol } from './symbol';
import { Country } from './country';

export class Currency {
    currencyId: Number = null;
    // active: Boolean;
    code: string='';
    currencyCode : string = '';
    name: String;
    symbol: Symbol;
    country: Country;
}

export const CurrencyList: Currency[] = [
    {
        currencyId: null,
        //  active: null,
        currencyCode  : null,
        code: null,
        name: null,
        symbol: null,
        country: null
    }
];