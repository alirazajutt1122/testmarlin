import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { RestService } from 'app/services/api/rest.service';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import { AppConstants } from 'app/app.utility';

@Injectable({
    providedIn: 'root'
})
export class TradingDashboardService {

    constructor(
        private _restService: RestService,) {
    }

    postBuySellOrder(obj: any){
        return this._restService.post(true, 'userTrade/', obj);
    }
    getSecurityStats(exchangeCode:String, symbolCode:String){
        return this._restService.get(true, 'security/symbol/stats/exch/'+ exchangeCode +'/'+ symbolCode +'/limit'+'/1');
    }
    getSecurityImage(exchangeCode:String, symbolCode:String){
        return this._restService.get(true, 'security/symbol/image/'+ exchangeCode +'/'+ symbolCode );
    }
    getMarketStatus(exchangeCode:String, marketCode:String){
        return this._restService.get(true, 'exchange-market-securities/exchanges/'+ exchangeCode +'/markets/'+ marketCode );
    }
    getBuySellPercentage(exchangeCode:String, symbolCode:String,hours:Number){
        return this._restService.get(true, 'userTrade/getUserTradeSentiments/exch/'+ exchangeCode +'/sec/'+ symbolCode +'/hourInt/'+hours );
    }
    getUserTradeHoldings(userId:Number){
        return this._restService.get(true, 'userTrade/holding/'+userId);
    }


}