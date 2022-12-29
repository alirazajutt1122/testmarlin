import {Order} from './order';

import {AppConstants} from '../app.utility';
import * as wjcCore from '@grapecity/wijmo';
import { AppUtility } from 'app/app.utility';
export class CancelOrder {

    order: Order= new Order();

     public formatOrderSubmitMsg(marketType: String):string {
        let str:string='';
        let price:string='';
        if (marketType == 'Bond') {
        str = "Cancel Order: "+AppUtility.ucFirstLetter(this.order.side)+ " " + this.order.symbol.toUpperCase() + " " +
        wjcCore.Globalize.formatNumber(Number(this.order.volume), 'n0') +
                " @ " + wjcCore.Globalize.formatNumber(Number(this.order.yield), 'n4') + ' yield with Price ' + wjcCore.Globalize.formatNumber(Number(this.order.price_), 'n4') + " in "+this.order.market + " of " + this.order.exchange+" ?";
        }
        else{
            str = "Cancel Order: "+AppUtility.ucFirstLetter(this.order.side)+ " " + this.order.symbol.toUpperCase() + " " +
            wjcCore.Globalize.formatNumber(Number(this.order.volume), 'n0') +
                " @ "+wjcCore.Globalize.formatNumber(Number(this.order.price_), 'n4') + " in "+this.order.market + " of " + this.order.exchange+" ?";
        }
        return str;
    }

}
