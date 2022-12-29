import {Order} from './order';
import {AppConstants} from '../app.utility';
import * as wijmo from '@grapecity/wijmo';
import { AppUtility } from 'app/app.utility';

export class ChangeOrder {

    price: string = '';
    price_: number = 0;
    volume: number = 500;
    yield: number = 0;
    order: Order = new Order();


    public formatOrderSubmitMsg(marketType: String): string {
        let str: string = '';
        let price: string = '';
        if (marketType == 'Bond') {
            str = "Change Order: " + AppUtility.ucFirstLetter(this.order.side) + " " + this.order.symbol.toUpperCase() + " " +
                wijmo.Globalize.formatNumber(Number(this.volume), 'n0') +
                " @ " + wijmo.Globalize.formatNumber(Number(this.yield), 'n4') + ' yield with Price ' + wijmo.Globalize.formatNumber(Number(this.price), 'n4') + " in " + this.order.market + " of " + this.order.exchange + " ?";
        }
        else {
            str = "Change Order: "+AppUtility.ucFirstLetter(this.order.side)+ " " + this.order.symbol.toUpperCase() + " " +
            wijmo.Globalize.formatNumber(Number(this.volume), 'n0') +
            " @ "+wijmo.Globalize.formatNumber(Number(this.price), 'n4') + " in "+this.order.market + " of " + this.order.exchange+" ?";
        }
        return str;
    }


}
