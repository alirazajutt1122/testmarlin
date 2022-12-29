
import { AppConstants } from '../app.utility';
import { AlertMessage } from './alert-message';
import * as wijmo from '@grapecity/wijmo';
import { AppUtility } from 'app/app.utility';


export class Repo {

    exchange: string = '';
    market: string = '';
    symbol: string = '';
    collateral: string = '';
    cleanPrice: number = 0 ;
    dirtyPrice: string = '';

    quantity: string = '';
    nominalValue: string = '';
    marketValue: string = '';

    repoType: string = '';
    haircut: string = '';
    purchasePrice: string = '';

    initialDate: Date;
    repurchaseDate: Date;
    repoInterestRate: string = '';
    repurchasePrice: string = '';
    account: string = '';
    borker: string = '';
    counterBroker: string = '';
    counterAccount: string = '';

    constructor() {
        this.clearRepo()
    }

    // -----------------------------------------------------------------

    clearRepo(): void {

        this.exchange = '';
        this.market = '';
        this.symbol = '';

        this.collateral  = '';
        this.cleanPrice = 0 ;
        this.dirtyPrice = '0000';

        this.quantity = '';
        this.nominalValue = '0000';
        this. marketValue = '0000';

        this.repoType = '';
        this.haircut = '';
        this.purchasePrice = '0000';

        this.initialDate = new Date();
        this.repurchaseDate  = new Date();
        this.repoInterestRate = '';
        this.repurchasePrice = '0000';
        this.account = '';
        this.borker = '';
        this.counterBroker = '';
        this.counterAccount = '';
    }



}
