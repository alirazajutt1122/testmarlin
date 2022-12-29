import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestService} from "../../../services/api/rest.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {

    private dataSource = new BehaviorSubject({});

    constructor(
        private _restService: RestService,) {
    }

    getUserTradeHoldings(userId:Number){
        return this._restService.get(true, 'userTrade/holding/'+userId);
    }

  

}